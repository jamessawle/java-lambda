import { Consumer, Runnable, Supplier } from '../types'
import { Optional } from './Optional'

export class NoSuchElementError extends Error {}

export class Empty<T> implements Optional<T> {
  filter = (): Optional<T> => this

  flatMap = <U>(): Optional<U> => this as unknown as Empty<U>

  get = () => {
    throw new NoSuchElementError()
  }

  ifPresent = (): void => {}

  ifPresentOrElse = (_: Consumer<T>, emptyAction: Runnable): void =>
    emptyAction.run()

  isEmpty = (): boolean => true

  isPresent = (): boolean => false

  map = <U>(): Optional<U> => this as unknown as Optional<U>

  or = (supplier: Supplier<Optional<T>>): Optional<T> => supplier.get()

  orElse = (other: T): T => other

  orElseGet = (supplier: Supplier<T>): T => supplier.get()

  orElseThrow = <E>(supplier?: Supplier<E>): T => {
    const error = supplier ? supplier.get() : new NoSuchElementError()
    throw error
  }
}
