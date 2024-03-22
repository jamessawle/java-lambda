import assert from 'node:assert'
import { describe, it, mock } from 'node:test'
import {
  allMatch,
  anyMatch,
  collect,
  collection,
  count,
  distinct,
  dropWhile,
  filter,
  findAny,
  flatMap,
  forEach,
  limit,
  map,
  mapMulti,
  mapReduce,
  max,
  min,
  noneMatch,
  peek,
  reduce,
  reduceToOptional,
  skip,
  sorted,
  takeWhile,
  toArray,
} from './iteratorMethods'
import { Optional } from '../optional'
import { Collector } from '../collector/Collector'
import { Consumer } from '../types'

describe('iteratorMethods', () => {
  describe('allMatch', () => {
    ;[
      {
        title: 'should return true when iterator is empty',
        input: [],
        expected: true,
      },
      {
        title: 'should return true when all values in iterator match predicate',
        input: [1, 2, 3],
        expected: true,
      },
      {
        title:
          'should return false when all values in iterator do not match predicate',
        input: [-1, -2, -3],
        expected: false,
      },
      {
        title:
          'should return false when any values in iterator do not match predicate',
        input: [1, -2, 3],
        expected: false,
      },
    ].forEach(({ title, input, expected }) =>
      it(title, () => {
        const iterator = input.values()

        const result = allMatch(iterator, (input: number) => input >= 0)

        assert.equal(result, expected, title)
      })
    )
  })

  describe('anyMatch', () => {
    ;[
      {
        title: 'should return false when iterator is empty',
        input: [],
        expected: false,
      },
      {
        title: 'should return true when all values in iterator match predicate',
        input: [1, 2, 3],
        expected: true,
      },
      {
        title:
          'should return false when all values in iterator do not match predicate',
        input: [-1, -2, -3],
        expected: false,
      },
      {
        title: 'should return true when any values in iterator match predicate',
        input: [1, -2, 3],
        expected: true,
      },
    ].forEach(({ title, input, expected }) =>
      it(title, () => {
        const iterator = input.values()

        const result = anyMatch(iterator, (input: number) => input >= 0)

        assert.equal(result, expected, title)
      })
    )
  })

  describe('collect', () => {
    ;[
      {
        title: 'should return supplier value with values array',
        input: [],
        supplier: () => [],
        accumulator: (acc: number[], current: number) => acc.push(current),
        combiner: (a: number[], b: number[]) => [...a, ...b],
        expected: [],
      },
      {
        title: 'should recreate array with single value',
        input: [3],
        supplier: () => [],
        accumulator: (acc: number[], current: number) => acc.push(current),
        combiner: (a: number[], b: number[]) => [...a, ...b],
        expected: [3],
      },
      {
        title: 'should recreate array with multiple values',
        input: [1, 2, 3, 4],
        supplier: () => [],
        accumulator: (acc: number[], current: number) => acc.push(current),
        combiner: (a: number[], b: number[]) => [...a, ...b],
        expected: [1, 2, 3, 4],
      },
    ].forEach(({ title, input, supplier, accumulator, combiner, expected }) =>
      it(title, () => {
        const iterator = input.values()

        const result = collect(iterator, supplier, accumulator, combiner)

        assert.deepEqual(result, expected)
      })
    )
  })

  describe('collection', () => {
    ;[
      {
        title: 'should return supplier value with values array',
        input: [],
        supplier: () => [],
        accumulator: (acc: number[], current: number) => acc.push(current),
        combiner: (a: number[], b: number[]) => [...a, ...b],
        expected: [],
      },
      {
        title: 'should recreate array with single value',
        input: [3],
        supplier: () => [],
        accumulator: (acc: number[], current: number) => acc.push(current),
        combiner: (a: number[], b: number[]) => [...a, ...b],
        expected: [3],
      },
      {
        title: 'should recreate array with multiple values',
        input: [1, 2, 3, 4],
        supplier: () => [],
        accumulator: (acc: number[], current: number) => acc.push(current),
        combiner: (a: number[], b: number[]) => [...a, ...b],
        expected: [1, 2, 3, 4],
      },
      {
        title: 'should use finisher if provided',
        input: [1, 2, 3, 4],
        supplier: () => [],
        accumulator: (acc: number[], current: number) => acc.push(current),
        combiner: (a: number[], b: number[]) => [...a, ...b],
        finisher: (a: number[]): number => a.length,
        expected: 4,
      },
    ].forEach(
      ({ title, input, supplier, accumulator, combiner, finisher, expected }) =>
        it(title, () => {
          const iterator = input.values()
          const collector = Collector.of(
            supplier,
            accumulator,
            combiner,
            finisher
          )

          const result = collection(iterator, collector)

          assert.deepEqual(result, expected)
        })
    )
  })

  describe('count', () => {
    ;[
      {
        title: 'given an empty Iterator',
        input: [],
        expectedCount: 0,
      },
      {
        title: 'given an Iterator with a single value',
        input: ['single'],
        expectedCount: 1,
      },
      {
        title: 'given an Iterator with a single value',
        input: ['one', 'two', 'three', 'four', 'five'],
        expectedCount: 5,
      },
    ].forEach(({ title, input, expectedCount }) =>
      it(title, () => {
        const iterator = input.values()

        const result = count(iterator)

        assert.equal(result, expectedCount)
      })
    )
  })

  describe('distinct', () => {
    ;[
      { title: 'should handle empty iterator', input: [], expected: [] },
      {
        title: 'should handle single value iterator',
        input: ['a'],
        expected: ['a'],
      },
      {
        title: 'should handle iterator with all matching values',
        input: ['a', 'a', 'a', 'a'],
        expected: ['a'],
      },
      {
        title: 'should handle iterator with all different values',
        input: ['a', 'b', 'c', 'd'],
        expected: ['a', 'b', 'c', 'd'],
      },
      {
        title: 'should handle iterator with different types',
        input: ['a', 'b', 1, 2, 1, 'a'],
        expected: ['a', 'b', 1, 2],
      },
      {
        title: 'should handle iterator with objects',
        input: [{ hello: 'james' }, { hello: 'bob' }, { hello: 'james' }],
        expected: [{ hello: 'james' }, { hello: 'bob' }],
      },
    ].forEach(({ title, input, expected }) =>
      it(title, () => {
        const iterator = input.values()

        const result = distinct(iterator as Iterator<unknown>)
        const resultArray = toArray(result)

        assert.deepEqual(resultArray, expected)
      })
    )
  })

  describe('dropWhile', () => {
    const predicate = (value: number) => value < 5

    ;[
      { title: 'should handle empty iterator: input', input: [], expected: [] },
      {
        title: 'should handle all values matching predicate',
        input: [1, 2, 3, 4],
        expected: [],
      },
      {
        title: 'should handle all values non-matching predicate',
        input: [5, 6, 7, 8],
        expected: [5, 6, 7, 8],
      },
      {
        title: 'should drop until predicate non-matching',
        input: [1, 2, 4, 5, 4, 3, 2, 1, 6],
        expected: [5, 4, 3, 2, 1, 6],
      },
    ].forEach(({ title, input, expected }) =>
      it(title, () => {
        const iterator = input.values()

        const result = dropWhile(iterator, predicate)
        const resultArray = toArray(result)

        assert.deepEqual(resultArray, expected)
      })
    )
  })

  describe('forEach', () => {
    ;[
      { title: 'should handle empty iterator', input: [] },
      { title: 'should handle single value iterator', input: ['a'] },
      {
        title: 'should handle multi-value iterator',
        input: ['a', 'b', 'c', 'd'],
      },
      {
        title: 'should handle multi-value with different types iterator',
        input: ['a', 2, 'c', 4],
      },
    ].forEach(({ title, input }) =>
      it(title, () => {
        const mockConsumer = mock.fn()
        const iterator = input.values()

        forEach(iterator, mockConsumer)

        assert.equal(mockConsumer.mock.callCount(), input.length)
      })
    )
  })

  describe('filter', () => {
    ;[
      { title: 'should handle empty iterator', input: [], expected: [] },
      {
        title: 'should return empty iterator if no value matches',
        input: [-10, -15],
        expected: [],
      },
      {
        title: 'should return iterator with matching value',
        input: [-10, 10, -15, 15],
        expected: [10, 15],
      },
    ].forEach(({ title, input, expected }) =>
      it(title, () => {
        const iterator: Iterator<number> = input.values()

        const result = filter(iterator, (input: number) => input >= 0)

        const assertionObject = toArray(result)
        assert.deepEqual(assertionObject, expected)
      })
    )
  })

  describe('findAny', () => {
    ;[
      {
        title: 'should return empty Optional when empty Iterator provided',
        input: [],
        expectPresent: false,
      },
      {
        title: 'should return only value in Iterator',
        input: [5],
        expectPresent: true,
      },
      {
        title: 'should return random value from Iterator',
        input: [1, 2, 3, 4, 5],
        expectPresent: true,
      },
    ].forEach(({ title, input, expectPresent }) =>
      it(title, () => {
        const iterator = input.values()

        const result = findAny(iterator)

        assert.equal(result.isPresent(), expectPresent, title)
        if (expectPresent) {
          assert.equal(
            input.includes(result.get()),
            true,
            'value in Optional should be contained in the original array'
          )
        }
      })
    )
  })

  describe('findFirst', () => {
    ;[
      {
        title: 'should return empty Optional when empty Iterator provided',
        input: [],
        expectedValue: undefined,
      },
      {
        title: 'should return only value in Iterator',
        input: [5],
        expectedValue: 5,
      },
      {
        title: 'should return random value from Iterator',
        input: [1, 2, 3, 4, 5],
        expectedValue: 1,
      },
    ].forEach(({ title, input, expectedValue }) =>
      it(title, () => {
        const iterator = input.values()

        const result = findAny(iterator)

        const expectPresent = expectedValue !== undefined
        assert.equal(
          result.isPresent(),
          expectPresent,
          `Optional.isPresent() should equal ${expectPresent}`
        )
        if (expectedValue) {
          assert.equal(
            result.get(),
            expectedValue,
            'value should be first element in iterator'
          )
        }
      })
    )
  })

  describe('flatMap', () => {
    ;[
      {
        title: 'should return empty iterator if empty iterator provided',
        input: [],
        returns: [],
        expected: [],
      },
      {
        title: 'should return empty iterator if mapper returns empty',
        input: [1, 2, 3],
        returns: [[], [], []],
        expected: [],
      },
      {
        title: 'should return combined iterator',
        input: [1, 2, 3],
        returns: [[5, 4, 3], [], [2, 1]],
        expected: [5, 4, 3, 2, 1],
      },
    ].forEach(({ title, input, returns, expected }) =>
      it(title, () => {
        const iterator = input.values()
        const mapperIterator: Iterator<number[]> = returns.values()
        const mapper = (): Iterator<number> =>
          mapperIterator.next().value.values()

        const result = flatMap(iterator, mapper)

        const assertionObject = toArray(result)
        assert.deepEqual(assertionObject, expected)
      })
    )
  })

  describe('limit', () => {
    ;[
      {
        title:
          'should return empty iterator if provided empty iterator and limit of 0',
        input: [],
        maxSize: 0,
        expected: [],
      },
      {
        title:
          'should return empty iterator if provided non-empty iterator and limit of 0',
        input: [1, 2, 3],
        maxSize: 0,
        expected: [],
      },
      {
        title:
          'should return empty iterator if provided empty iterator and limit of 5',
        input: [],
        maxSize: 5,
        expected: [],
      },
      {
        title:
          'should return provided iterator if limit is larger than iterator length',
        input: [1, 2, 3, 4],
        maxSize: 5,
        expected: [1, 2, 3, 4],
      },
      {
        title:
          'should return provided iterator if limit is equal to iterator length',
        input: [1, 2, 3, 4],
        maxSize: 4,
        expected: [1, 2, 3, 4],
      },
      {
        title:
          'should return shortened iterator if limit is less than iterator length',
        input: [1, 2, 3, 4],
        maxSize: 2,
        expected: [1, 2],
      },
    ].forEach(({ title, input, maxSize, expected }) =>
      it(title, () => {
        const iterator = input.values()

        const result = limit(iterator, maxSize)

        const resultArray = toArray(result)
        assert.deepEqual(resultArray, expected)
      })
    )
  })

  describe('map', () => {
    ;[
      {
        title: 'should return empty iterator if passed empty iterator',
        input: [],
        expected: [],
      },
      {
        title: 'should return singleton iterator if passed singleton iterator',
        input: [1],
        expected: [2],
      },
      {
        title:
          'should return multi-element iterator if passed multi-element iterator',
        input: [1, 2, 3, 4],
        expected: [2, 4, 6, 8],
      },
    ].forEach(({ title, input, expected }) =>
      it(title, () => {
        const iterator = input.values()

        const result = map(iterator, (a: number) => a * 2)

        const resultArray = toArray(result)
        assert.deepEqual(resultArray, expected)
      })
    )
  })

  describe('mapReduce', () => {
    ;[
      {
        title: 'empty array and identity of 0',
        input: [].values(),
        identity: 0,
        expected: 0,
      },
      {
        title: 'empty array and identity of 5',
        input: [].values(),
        identity: 5,
        expected: 5,
      },
      {
        title: 'single element array and identity of 0',
        input: ['one'].values(),
        identity: 0,
        expected: 3,
      },
      {
        title: 'single element array and identity of 5',
        input: ['one'].values(),
        identity: 5,
        expected: 8,
      },
      {
        title: 'multiple element array and identity of 0',
        input: ['one', 'two', 'three'].values(),
        identity: 0,
        expected: 11,
      },
      {
        title: 'multiple element array and identity of 5',
        input: ['one', 'two', 'three'].values(),
        identity: 5,
        expected: 16,
      },
    ].forEach(({ title, input, identity, expected }) =>
      it(title, () => {
        const accumulator = (accumulation: number, current: string) =>
          accumulation + current.length

        const result = mapReduce(input, identity, accumulator, (a, b) => a + b)

        assert.equal(result, expected)
      })
    )
  })

  describe('mapMulti', () => {
    ;[
      { title: 'should handle empty iterator', input: [], expected: [] },
      {
        title: 'should handle where all elements map to single values',
        input: ['a', 'b', 'c'],
        expected: ['a', 'b', 'c'],
      },
      {
        title: 'should handle where one multi-value element',
        input: ['abc'],
        expected: ['a', 'b', 'c'],
      },
      {
        title: 'should handle mixture of elements',
        input: ['ab', 'c', 'def'],
        expected: ['a', 'b', 'c', 'd', 'e', 'f'],
      },
    ].forEach(({ title, input, expected }) =>
      it(title, () => {
        const iterator = input.values()
        const stringToChars = (value: string, consumer: Consumer<string>) => {
          for (const char of value.split('')) {
            consumer(char)
          }
        }

        const result = mapMulti(iterator, stringToChars)
        const resultArray = toArray(result)

        assert.deepEqual(resultArray, expected)
      })
    )
  })

  describe('max', () => {
    ;[
      { title: 'should handle empty iterator', input: [], expected: undefined },
      {
        title: 'should return value if only single value in iterator',
        input: [5],
        expected: 5,
      },
      {
        title: 'should handle max case at end',
        input: [1, 2, 3, 4, 5],
        expected: 5,
      },
      {
        title: 'should handle max case at beginning',
        input: [5, 4, 3, 2, 1],
        expected: 5,
      },
      {
        title: 'should handle max case in middle',
        input: [1, 2, 5, 4, 3],
        expected: 5,
      },
      {
        title: 'should handle max value contained twice',
        input: [1, 2, 5, 4, 5],
        expected: 5,
      },
    ].forEach(({ title, input, expected }) =>
      it(title, () => {
        const iterator = input.values()
        const comparator = (a: number, b: number) => a - b

        const result = max(iterator, comparator)

        if (expected) {
          assert.equal(
            result.isPresent(),
            true,
            'should return present Optional'
          )
          assert.equal(result.get(), expected)
        } else {
          assert.equal(result.isEmpty(), true, 'should return empty Optional')
        }
      })
    )
  })

  describe('min', () => {
    ;[
      { title: 'should handle empty iterator', input: [], expected: undefined },
      {
        title: 'should return value if only single value in iterator',
        input: [5],
        expected: 5,
      },
      {
        title: 'should handle min case at end',
        input: [1, 2, 3, 4, 5],
        expected: 1,
      },
      {
        title: 'should handle min case at beginning',
        input: [5, 4, 3, 2, 1],
        expected: 1,
      },
      {
        title: 'should handle min case in middle',
        input: [5, 2, 1, 4, 3],
        expected: 1,
      },
      {
        title: 'should handle min value contained twice',
        input: [1, 2, 5, 4, 5],
        expected: 1,
      },
    ].forEach(({ title, input, expected }) =>
      it(title, () => {
        const iterator = input.values()
        const comparator = (a: number, b: number) => a - b

        const result = min(iterator, comparator)

        if (expected) {
          assert.equal(
            result.isPresent(),
            true,
            'should return present Optional'
          )
          assert.equal(result.get(), expected)
        } else {
          assert.equal(result.isEmpty(), true, 'should return empty Optional')
        }
      })
    )
  })

  describe('peek', () => {
    ;[
      { title: 'should handle empty iterator', input: [] },
      { title: 'should handle single value iterator', input: ['a'] },
      { title: 'should handle multi-value iterator', input: ['a', 'b', 'c'] },
    ].forEach(({ title, input }) =>
      it(title, () => {
        const iterator = input.values()
        const mockConsumer = mock.fn()

        const result = peek(iterator, mockConsumer)
        const resultArray = toArray(result)

        assert.deepEqual(
          resultArray,
          input,
          'output iterator should match input'
        )
        assert.equal(
          mockConsumer.mock.callCount(),
          input.length,
          `consumer should have been called ${input.length} times`
        )
      })
    )
  })

  describe('noneMatch', () => {
    ;[
      {
        title: 'should return true when iterator is empty',
        input: [],
        expected: true,
      },
      {
        title:
          'should return false when all values in iterator match predicate',
        input: [1, 2, 3],
        expected: false,
      },
      {
        title:
          'should return true when all values in iterator do not match predicate',
        input: [-1, -2, -3],
        expected: true,
      },
      {
        title:
          'should return false when any values in iterator match predicate',
        input: [1, -2, 3],
        expected: false,
      },
    ].forEach(({ title, input, expected }) =>
      it(title, () => {
        const iterator = input.values()

        const result = noneMatch(iterator, (input: number) => input >= 0)

        assert.equal(result, expected, title)
      })
    )
  })

  describe('reduce', () => {
    ;[
      {
        title: 'empty array and identity of 0',
        input: [].values(),
        identity: 0,
        expected: 0,
      },
      {
        title: 'empty array and identity of 5',
        input: [].values(),
        identity: 5,
        expected: 5,
      },
      {
        title: 'single element array and identity of 0',
        input: [5].values(),
        identity: 0,
        expected: 5,
      },
      {
        title: 'single element array and identity of 5',
        input: [4].values(),
        identity: 5,
        expected: 9,
      },
      {
        title: 'multiple element array and identity of 0',
        input: [1, 2, 3, 4].values(),
        identity: 0,
        expected: 10,
      },
      {
        title: 'multiple element array and identity of 5',
        input: [1, 2, 3, 4].values(),
        identity: 5,
        expected: 15,
      },
    ].forEach(({ title, input, identity, expected }) =>
      it(title, () => {
        const accumulator = (accumulation: number, current: number) =>
          accumulation + current

        const result = reduce(input, identity, accumulator)

        assert.equal(result, expected)
      })
    )
  })

  describe('reduceToOptional', () => {
    ;[
      {
        title: 'should return empty Optional if empty iterator provided',
        input: [],
        presentAssertionMessage: 'should be empty Optional',
        presentAssertionCheck: (value: Optional<number>) => value.isEmpty(),
      },
      {
        title: 'should return only value in singleton iterator',
        input: [1],
        presentAssertionMessage: 'should be present Optional',
        presentAssertionCheck: (value: Optional<number>) => value.isPresent(),
        expectedValue: 1,
      },
      {
        title: 'should return result of accumulator over two values',
        input: [1, 2],
        presentAssertionMessage: 'should be present Optional',
        presentAssertionCheck: (value: Optional<number>) => value.isPresent(),
        expectedValue: 3,
      },
      {
        title: 'should return result of accumulator over multiple values',
        input: [1, 2, 3, 4, 5],
        presentAssertionMessage: 'should be present Optional',
        presentAssertionCheck: (value: Optional<number>) => value.isPresent(),
        expectedValue: 15,
      },
    ].forEach(
      ({
        title,
        input,
        presentAssertionCheck,
        presentAssertionMessage,
        expectedValue,
      }) =>
        it(title, () => {
          const iterator = input.values()

          const result = reduceToOptional<number>(iterator, (a, b) => a + b)

          assert.equal(
            presentAssertionCheck(result),
            true,
            presentAssertionMessage
          )

          if (expectedValue) {
            assert.equal(result.get(), expectedValue)
          }
        })
    )
  })

  describe('skip', () => {
    ;[
      {
        title: 'should handle empty iterator and n of 0',
        input: [],
        n: 0,
        expected: [],
      },
      {
        title: 'should handle empty iterator and negative n',
        input: [],
        n: -1,
        expected: [],
      },
      {
        title: 'should handle empty iterator and positive n',
        input: [],
        n: 5,
        expected: [],
      },
      {
        title: 'should handle iterator with values and n of 0',
        input: [1, 2, 3],
        n: 0,
        expected: [1, 2, 3],
      },
      {
        title: 'should handle iterator with values and negative n',
        input: [1, 2, 3],
        n: -1,
        expected: [1, 2, 3],
      },
      {
        title:
          'should handle iterator with values and n is less than iterator length',
        input: [1, 2, 3],
        n: 1,
        expected: [2, 3],
      },
      {
        title:
          'should handle iterator with values and n is greater than iterator length',
        input: [1, 2, 3],
        n: 4,
        expected: [],
      },
    ].forEach(({ title, input, n, expected }) =>
      it(title, () => {
        const iterator = input.values()

        const result = skip(iterator, n)
        const resultArray = toArray(result)

        assert.deepEqual(resultArray, expected)
      })
    )
  })

  describe('sorted', () => {
    const reverse = (a: number, b: number) => b - a

    ;[
      {
        title: 'should handle emtpy iterator and no comparator',
        input: [],
        expected: [],
      },
      {
        title: 'should handle empty iterator and reverse comparator',
        input: [],
        comparator: reverse,
        expected: [],
      },
      {
        title: 'should handle single value iterator and no comparator',
        input: [1],
        expected: [1],
      },
      {
        title: 'should handle single value iterator and reverse comparator',
        input: [1],
        comparator: reverse,
        expected: [1],
      },
      {
        title: 'should handle multi-value iterator and no comparator',
        input: [1, 3, 2],
        expected: [1, 2, 3],
      },
      {
        title: 'should handle multi-value iterator and reverse comparator',
        input: [1, 3, 2],
        comparator: reverse,
        expected: [3, 2, 1],
      },
      {
        title: 'should handle pre-sorted iterator and no comparator',
        input: [1, 2, 3],
        expected: [1, 2, 3],
      },
      {
        title: 'should handle pre-sorted iterator and reverse comparator',
        input: [3, 2, 1],
        comparator: reverse,
        expected: [3, 2, 1],
      },
    ].forEach(({ title, input, comparator, expected }) =>
      it(title, () => {
        const iterator = input.values()

        const result = sorted(iterator, comparator)
        const resultArray = toArray(result)

        assert.deepEqual(resultArray, expected)
      })
    )
  })

  describe('takeWhile', () => {
    ;[
      { title: 'should handle empty iterator', input: [], expected: [] },
      {
        title: 'should handle iterator where all values match predicate',
        input: [1, 2, 3, 4],
        expected: [1, 2, 3, 4],
      },
      {
        title: 'should handle iterator where no values match predicate',
        input: [5, 6, 7, 8],
        expected: [],
      },
      {
        title: 'should drop all values after predicate matches',
        input: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1],
        expected: [1, 2, 3, 4],
      },
    ].forEach(({ title, input, expected }) =>
      it(title, () => {
        const iterator = input.values()
        const predicate = (value: number) => value < 5

        const result = takeWhile(iterator, predicate)
        const resultArray = toArray(result)

        assert.deepEqual(resultArray, expected)
      })
    )
  })

  describe('toArray', () => {
    ;[
      { title: 'empty array', input: [].values(), expected: [] },
      { title: 'single element array', input: [1].values(), expected: [1] },
      {
        title: 'multiple element array',
        input: [1, 2, 3].values(),
        expected: [1, 2, 3],
      },
    ].forEach(({ title, input, expected }) =>
      it(title, () => {
        const result = toArray(input)

        assert.deepEqual(result, expected)
      })
    )
  })
})
