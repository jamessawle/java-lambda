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
 * Represents an operation that accepts two input arguments and returns no result.
 *
 * Unlike most other functional interfaces, Consumer is expected to operate via side-effects.
 *
 * @param t the first function argument
 * @param u the second function argument
 * @returns the function result
 */
export type BiConsumer<T, U> = (t: T, u: U) => void

/**
 * Represents a function that accepts one argument and produces a result.
 *
 * @param value the function argument
 * @returns the function result
 */
export type Func<T, R> = (value: T) => R

/**
 * A specialised version of `Func` that returns the same type as it accepts.
 */
export type UnaryOperator<T> = Func<T, T>

/**
 * Represents a function that accepts two arguments and produces a result.
 *
 * @param t the first function argument
 * @param u the second function argument
 * @returns the function result
 */
export type BiFunc<T, U, R> = (t: T, u: U) => R

/**
 * A specialised version of `BiFunc` where all input and output values are the same type.
 */
export type BinaryOperator<T> = BiFunc<T, T, T>

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

/**
 * Compares its two arguments for order. Returns a negative integer, zero, or a positive integer as the
 * first argument is less than, equal to, or greater than the second.
 *
 * The implementor must also ensure that the relation is transitive: `((compare(x, y)>0) && (compare(y, z)>0))`
 * implies `compare(x, z)>0`.
 *
 * @param a the first value to be compared
 * @param b the second value to be compared
 * @returns a negative integer, zero, or a positive integer as the first argument is less than, equal to, or greater than the second
 */
export type Comparator<T> = (a: T, b: T) => number
