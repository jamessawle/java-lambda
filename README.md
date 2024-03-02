# Java Lambda

A package to provide functional primitives, inline with Java's functional patterns for Javascript, following the Java SE SDK for provided features.

The name is based on the fact that the primitives were added as part of Java 8's Lambda functions.

## Install

Node: `npm i @jamessawle/java-lambda`

## Usage

### Optional

The [Optional](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Optional.html) class allows for safe processing of data that may not be present.

```ts
import { Optional } from '@jamessawle/java-lambda'

const input = 12 | undefined
const result = Optional.ofNullable(input)
  .map((x) => x * 2)
  .filter((x) => x > 20)
  .orElseGet(5)

// 12 => 24
// undefined => 5
```

**Note**
Optionals are not intended to be used as object values or method parameters, but instead a clear way to represent "no result" - [designer of Optional type](https://stackoverflow.com/questions/26327957/should-java-8-getters-return-optional-type/26328555#26328555).

### Stream (Not implemented yet)

The [Stream](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/stream/Stream.html) class allows for the processing of data in the form of a pipeline. Utility methods are provided to turn different types into a Stream.

Whilst similar to the utility methods `map`, `filter` etc. on Arrays in Javascript; the Stream class will lazily operate on each element in the Stream, only processing data that is required to fulfill the final result.

In the following example, only the first element in the provided array will ever be processed:

```ts
const result = Stream.of([12, 24, 36, 48, 60])
  .map((x) => x / 2)
  .filter((x) => x < 20)
  .findFirst()

// => 6
```
