import { Consumer, Func, Predicate, Runnable, Supplier } from '../types'

/**
 * A container object which may or may not contain a non-null or undefined value. If a value is present, isPresent() returns true. If no value is present, the object is considered empty and isPresent() returns false.
 * Additional methods that depend on the presence or absence of a contained value are provided, such as orElse() (returns a default value if no value is present) and ifPresent() (performs an action if a value is present).
 *
 * This is a value-based class; programmers should treat instances that are equal as interchangeable and should not use instances for synchronization, or unpredictable behavior may occur. For example, in a future release, synchronization may fail.
 *
 * **API Note**:
 * Optional is primarily intended for use as a method return type where there is a clear need to represent "no result," and where using null is likely to cause errors. A variable whose type is Optional should never itself be null; it should always point to an Optional instance.
 */
export interface Optional<T> {
  /**
   * If a value is present, and the value matches the given predicate, returns an Optional describing the value, otherwise returns an empty Optional.
   *
   * @param predicate the predicate to apply to a value, if present
   * @returns an Optional describing the value of this Optional, if a value is present and the value matches the given predicate, otherwise an empty Optional
   */
  filter(predicate: Predicate<T>): Optional<T>

  /**
   * If a value is present, returns the result of applying the given Optional-bearing mapping function to the value, otherwise returns an empty Optional.
   *
   * This method is similar to map(Function), but the mapping function is one whose result is already an Optional, and if invoked, flatMap does not wrap it within an additional Optional.
   *
   * @param mapper the mapping function to apply to a value, if present
   * @returns the result of applying an Optional-bearing mapping function to the value of this Optional, if a value is present, otherwise an empty Optional
   */
  flatMap<U>(mapper: Func<T, Optional<U>>): Optional<U>

  /**
   * If a value is present, returns the value, otherwise throws NoSuchElementException.
   *
   * **API Note**:
   * The preferred alternative to this method is orElseThrow().
   *
   * @returns the non-null value described by this Optional
   * @throws if no value is present
   */
  get(): T

  /**
   * If a value is present, performs the given action with the value, otherwise does nothing.
   *
   * @param action the action to be performed, if a value is present
   */
  ifPresent(action: Consumer<T>): void

  /**
   * If a value is present, performs the given action with the value, otherwise performs the given empty-based action.
   *
   * @param action the action to be performed, if a value is present
   * @param emptyAction the empty-based action to be performed, if no value is present
   */
  ifPresentOrElse(action: Consumer<T>, emptyAction: Runnable): void

  /**
   * If a value is not present, returns true, otherwise false.
   *
   * @returns true if a value is not present, otherwise false
   */
  isEmpty(): boolean

  /**
   * If a value is present, returns true, otherwise false.
   *
   * @returns true if a value is present, otherwise false
   */
  isPresent(): boolean

  /**
   * If a value is present, returns an Optional describing (as if by ofNullable(T)) the result of applying the given mapping function to the value, otherwise returns an empty Optional.
   *
   * If the mapping function returns a null result then this method returns an empty Optional.
   *
   * **API Note**:
   * This method supports post-processing on Optional values, without the need to explicitly check for a return status. For example, the following code traverses a stream of URIs, selects one that has not yet been processed, and creates a path from that URI, returning an Optional<Path>:
   *
   * ```js
   * const p: Optional<Path> =
   *    uris.stream().filter(uri -> !isProcessedYet(uri))
   *        .findFirst()
   *        .map(getPathForURI);
   * ```
   *
   * Here, findFirst returns an Optional<URI>, and then map returns an Optional<Path> for the desired URI if one exists.
   *
   * @param mapper the mapping function to apply to a value, if present
   * @returns an Optional describing the result of applying a mapping function to the value of this Optional, if a value is present, otherwise an empty Optional
   */
  map<U>(mapper: Func<T, U>): Optional<U>

  /**
   * If a value is present, returns an Optional describing the value, otherwise returns an Optional produced by the supplying function.
   *
   * @param supplier the supplying function that produces an Optional to be returned
   * @returns an Optional describing the value of this Optional, if a value is present, otherwise an Optional produced by the supplying function.
   */
  or(supplier: Supplier<Optional<T>>): Optional<T>

  /**
   * If a value is present, returns the value, otherwise returns other.
   *
   * @param other the value to be returned, if no value is present. May be null.
   * @returns the value, if present, otherwise other
   */
  orElse(other: T): T

  /**
   * If a value is present, returns the value, otherwise returns the result produced by the supplying function.
   *
   * @param supplier the supplying function that produces a value to be returned
   * @returns the value, if present, otherwise the result produced by the supplying function
   */
  orElseGet(supplier: Supplier<T>): T

  /**
   * If a value is present, returns the value, otherwise throws NoSuchElementException.
   *
   * @returns the non-null value described by this Optional
   * @throws if no value is present
   */
  orElseThrow(): T

  /**
   * If a value is present, returns the value, otherwise throws an exception produced by the exception supplying function.
   *
   * @param supplier the supplying function that produces an exception to be thrown
   * @returns the value, if present
   * @throws if no value is present
   */
  orElseThrow<E>(supplier: Supplier<E>): T
}
