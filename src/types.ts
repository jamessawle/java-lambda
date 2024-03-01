/**
 * Represents an operation that accepts a single input argument and returns no result. Unlike most other functional interfaces, Consumer is expected to operate via side-effects.
 */
export type Consumer<T> = {
  /**
   * Performs this operation on the given argument.
   *
   * @param value the input argument
   */
  accept: (value: T) => void
}

/**
 * Represents a function that accepts one argument and produces a result.
 */
export type Func<T, R> = {
  /**
   * Applies this function to the given argument.
   *
   * @param value the function argument
   * @returns the function result
   */
  apply: (value: T) => R
}

/**
 * Represents a predicate (boolean-valued function) of one argument.
 */
export type Predicate<T> = {
  /**
   * Evaluates this predicate on the given argument.
   *
   * @param value the input argument
   * @returns *true* if the input argument matches the predicate, otherwise *false*
   */
  test: (value: T) => boolean
}

/**
 * Represents an operation that does not return a result.
 */
export type Runnable = {
  /**
   * Runs this operation.
   */
  run: () => void
}

/**
 * Represents a supplier of results.
 *
 * There is no requirement that a new or distinct result be returned each time the supplier is invoked.
 */
export type Supplier<T> = {
  /**
   * Gets a result.
   *
   * @returns a result
   */
  get: () => T
}
