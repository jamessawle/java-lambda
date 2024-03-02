/**
 * Represents an operation that accepts a single input argument and returns no result.
 *
 * Unlike most other functional interfaces, Consumer is expected to operate via side-effects.
 *
 * @param value the function argument
 * @returns the function result
 */
export type Consumer<T> = (value: T) => void

/**
 * Represents a function that accepts one argument and produces a result.
 *
 * @param value the function argument
 * @returns the function result
 */
export type Func<T, R> = (value: T) => R

/**
 * Represents a predicate (boolean-valued function) of one argument.
 *
 * @param value the input argument
 * @returns *true* if the input argument matches the predicate, otherwise *false*
 */
export type Predicate<T> = (value: T) => boolean

/**
 * Represents an operation that does not return a result.
 */
export type Runnable = () => void

/**
 * Represents a supplier of results.
 *
 * There is no requirement that a new or distinct result be returned each time the supplier is invoked.
 *
 * @returns a result
 */
export type Supplier<T> = () => T
