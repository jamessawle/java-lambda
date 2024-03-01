import { Empty } from './Empty'
import { Optional } from './Optional'
import { Present } from './Present'

export { Optional } from './Optional'

export const ofNullable = <T>(value: T | undefined | null): Optional<T> => {
  if (value) {
    return new Present(value)
  }

  return new Empty()
}

export const of = <T>(value: T): Optional<T> => new Present(value)

export const empty = <T>(): Optional<T> => new Empty()
