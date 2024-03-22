import { BiConsumer, BinaryOperator, Func, Supplier } from '../types'

/**
 * Identity function that forces the type from the intermediary to the result type
 */
const IdentityFinisher = <A, R>(value: A) => value as unknown as R

/**
 * A mutable reduction operation that accumulates input elements into a mutable result
 * container, optionally transforming the accumulated result into a final representation
 * after all input elements have been processed. Reduction operations can be performed
 * either sequentially or in parallel.
 *
 * A Collector is specified by four functions that work together to accumulate entries into a mutable result container, and optionally perform a final transform on the result. They are:
 * - creation of a new result container (supplier())
 * - incorporating a new data element into a result container (accumulator())
 * - combining two result containers into one (combiner())
 * - performing an optional final transform on the container (finisher())
 *
 * The main use cases for Collectors are with the `Stream.collect` and `iteratorMethods.collection`
 * methods, to allow for the generation of result objects from stream based data.
 */
export class Collector<T, A, R> {
  /**
   * Returns a new Collector described by the given supplier, accumulator, combiner, and
   * optional finisher functions.
   *
   * @type T The type of input elements for the new collector
   * @type A The intermediate accumulation type of the new collector
   * @type R The final result type of the new collector
   *
   * @param supplier The supplier function for the new collector
   * @param accumulator The accumulator function for the new collector
   * @param combiner The combiner function for the new collector
   * @param finisher The finisher function for the new collector, or an identity function if not provided
   * @returns A Collector based upon the above provided values
   */
  static of<T, A, R>(
    supplier: Supplier<A>,
    accumulator: BiConsumer<A, T>,
    combiner: BinaryOperator<A>,
    finisher?: Func<A, R>
  ): Collector<T, A, R> {
    return new Collector(supplier, accumulator, combiner, finisher)
  }

  private constructor(
    public readonly supplier: Supplier<A>,
    public readonly accumulator: BiConsumer<A, T>,
    public readonly combiner: BinaryOperator<A>,
    public readonly finisher: Func<A, R> = IdentityFinisher
  ) {}
}
