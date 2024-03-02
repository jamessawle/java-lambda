import { Consumer, Func, Predicate } from '../types'
import { Empty } from './Empty'
import { Optional } from './Optional'

export class Present<T> implements Optional<T> {
  public constructor(private readonly value: T) {}

  filter = (predicate: Predicate<T>): Optional<T> =>
    predicate(this.value) ? this : new Empty()

  flatMap = <U>(mapper: Func<T, Optional<U>>) => mapper(this.value)

  get = (): T => this.value

  ifPresent = (action: Consumer<T>): void => action(this.value)

  ifPresentOrElse = (action: Consumer<T>): void => action(this.value)

  isEmpty = (): boolean => false

  isPresent = (): boolean => true

  map = <U>(mapper: Func<T, U>): Optional<U> => new Present(mapper(this.value))

  or = (): Optional<T> => this

  orElse = (): T => this.value

  orElseGet = (): T => this.value

  orElseThrow = (): T => this.value
}
