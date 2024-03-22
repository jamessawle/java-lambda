import { Collector } from '../collector/Collector'
import { isEqual } from '../util/equality'
import { Optional } from '../optional'
import {
  BiConsumer,
  BiFunc,
  BinaryOperator,
  Comparator,
  Consumer,
  Func,
  Predicate,
  Supplier,
} from '../types'

export function allMatch<T>(
  iterator: Iterator<T>,
  predicate: Predicate<T>
): boolean {
  let current = iterator.next()
  while (current.done === false) {
    if (!predicate(current.value)) {
      return false
    }

    current = iterator.next()
  }

  return true
}

export function anyMatch<T>(
  iterator: Iterator<T>,
  predicate: Predicate<T>
): boolean {
  let current = iterator.next()
  while (current.done === false) {
    if (predicate(current.value)) {
      return true
    }

    current = iterator.next()
  }

  return false
}

export function collect<T, R>(
  iterator: Iterator<T>,
  supplier: Supplier<R>,
  accumulator: BiConsumer<R, T>,
  combiner: BinaryOperator<R>
): R {
  const collector = Collector.of<T, R, R>(supplier, accumulator, combiner)
  return collection(iterator, collector)
}

export function collection<T, A, R>(
  iterator: Iterator<T>,
  collector: Collector<T, A, R>
) {
  const result = collector.supplier()

  let current = iterator.next()
  while (current.done === false) {
    collector.accumulator(result, current.value)
    current = iterator.next()
  }

  return collector.finisher(result)
}

export function count<T>(iterator: Iterator<T>): number {
  return mapReduce(
    iterator,
    0,
    (acc) => acc + 1,
    (a, b) => a + b
  )
}

export function* distinct<T>(iterator: Iterator<T>): Iterator<T> {
  const seen: T[] = []

  let current = iterator.next()
  while (current.done === false) {
    if (!anyMatch(seen.values(), (value) => isEqual(value, current.value))) {
      seen.push(current.value)
      yield current.value
    }

    current = iterator.next()
  }
}

export function* dropWhile<T>(
  iterator: Iterator<T>,
  predicate: Predicate<T>
): Iterator<T> {
  let drop = true

  let current = iterator.next()
  while (current.done === false) {
    if (drop) {
      drop = predicate(current.value)
      if (!drop) {
        yield current.value
      }
    } else {
      yield current.value
    }

    current = iterator.next()
  }
}

export function* filter<T>(
  iterator: Iterator<T>,
  predicate: Predicate<T>
): Iterator<T> {
  let current = iterator.next()
  while (current.done === false) {
    if (predicate(current.value)) {
      yield current.value
    }
    current = iterator.next()
  }
}

export function findAny<T>(iterator: Iterator<T>): Optional<T> {
  return findFirst(iterator)
}

export function findFirst<T>(iterator: Iterator<T>): Optional<T> {
  return Optional.ofNullable(iterator.next().value)
}

export function* flatMap<T, R>(
  iterator: Iterator<T>,
  mapper: Func<T, Iterator<R>>
): Iterator<R> {
  let currentValue = iterator.next()
  while (currentValue.done === false) {
    const mappedIterator = mapper(currentValue.value)

    let iteratorValue = mappedIterator.next()
    while (iteratorValue.done === false) {
      yield iteratorValue.value
      iteratorValue = mappedIterator.next()
    }

    currentValue = iterator.next()
  }
}

export function forEach<T>(iterator: Iterator<T>, consumer: Consumer<T>): void {
  let current = iterator.next()
  while (current.done === false) {
    consumer(current.value)
    current = iterator.next()
  }
}

export function* limit<T>(iterator: Iterator<T>, maxSize: number): Iterator<T> {
  let count = 0

  let current = iterator.next()
  while (current.done === false && count < maxSize) {
    yield current.value
    current = iterator.next()
    count++
  }
}

export function* map<T, R>(
  iterator: Iterator<T>,
  mapper: Func<T, R>
): Iterator<R> {
  let current = iterator.next()
  while (current.done === false) {
    yield mapper(current.value)
    current = iterator.next()
  }
}

export function* mapMulti<T, R>(
  iterator: Iterator<T>,
  mapper: BiConsumer<T, Consumer<R>>
): Iterator<R> {
  let current = iterator.next()
  while (current.done === false) {
    const buffer: R[] = []
    mapper(current.value, (value) => buffer.push(value))
    for (const value of buffer) {
      yield value
    }
    current = iterator.next()
  }
}

export function mapReduce<T, U>(
  iterator: Iterator<T>,
  identity: U,
  accumulator: BiFunc<U, T, U>,
  combiner: BinaryOperator<U> //eslint-disable-line @typescript-eslint/no-unused-vars
): U {
  /**
   * Combiner is required, as it is with the Java SDK version to allow for
   * future parrallelisation of this code. This optimisation is envisioned
   * due to the merging of the `map` and `reduce` and the overhead that this
   * might introduce.
   */

  let result = identity

  let current = iterator.next()
  while (current.done === false) {
    result = accumulator(result, current.value)
    current = iterator.next()
  }

  return result
}

export function max<T>(
  iterator: Iterator<T>,
  comparator: Comparator<T>
): Optional<T> {
  return reduceToOptional(iterator, (a, b) => (comparator(a, b) > 0 ? a : b))
}

export function min<T>(
  iterator: Iterator<T>,
  comparator: Comparator<T>
): Optional<T> {
  return reduceToOptional(iterator, (a, b) => (comparator(a, b) < 0 ? a : b))
}

export function noneMatch<T>(
  iterator: Iterator<T>,
  predicate: Predicate<T>
): boolean {
  let current = iterator.next()
  while (current.done === false) {
    if (predicate(current.value)) {
      return false
    }

    current = iterator.next()
  }

  return true
}

export function peek<T>(
  iterator: Iterator<T>,
  consumer: Consumer<T>
): Iterator<T> {
  return map(iterator, (value) => {
    consumer(value)
    return value
  })
}

export function reduce<T>(
  iterator: Iterator<T>,
  identity: T,
  accumulator: BinaryOperator<T>
): T {
  let result = identity

  let current = iterator.next()
  while (current.done === false) {
    result = accumulator(result, current.value)
    current = iterator.next()
  }

  return result
}

export function reduceToOptional<T>(
  iterator: Iterator<T>,
  accumulator: BinaryOperator<T>
): Optional<T> {
  let result: T | undefined = undefined

  let current = iterator.next()
  while (current.done === false) {
    if (!result) {
      result = current.value
    } else {
      result = accumulator(result, current.value)
    }
    current = iterator.next()
  }

  return Optional.ofNullable(result)
}

export function* skip<T>(iterator: Iterator<T>, n: number): Iterator<T> {
  let count = 0
  let current = iterator.next()
  while (current.done === false) {
    count++
    if (count > n) {
      yield current.value
    }

    current = iterator.next()
  }
}

export function sorted<T>(
  iterator: Iterator<T>,
  comparator?: Comparator<T>
): Iterator<T> {
  const array = toArray(iterator).sort(comparator)
  return array.values()
}

export function* takeWhile<T>(
  iterator: Iterator<T>,
  predicate: Predicate<T>
): Iterator<T> {
  let current = iterator.next()
  while (current.done === false && predicate(current.value)) {
    yield current.value
    current = iterator.next()
  }
}

export function toArray<T>(iterator: Iterator<T>): T[] {
  return collect(
    iterator,
    () => [],
    (acc: T[], current: T) => acc.push(current),
    (a: T[], b: T[]) => [...a, ...b]
  )
}
