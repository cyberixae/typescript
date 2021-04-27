# MaaS Global Guide to TypeScript and Functional Programming

TypeScript has a relatively good [type system](https://typescriptlang.org/docs/) that lets the developer validate architectural decisions by describing them in the integrated type language. However, taking [full advantage](https://softwareengineering.stackexchange.com/questions/347402/how-do-the-type-systems-in-functional-languages-differ-from-those-in-oo-language/347426) requires maintaining referential transparency. This means avoiding mutations and constructing new immutable values with functional programming tools.

This guide attemps to explaing basics of working with a code base written in this manner. The guide covers basics of [type variables](https://www.typescriptlang.org/docs/handbook/generics.html#working-with-generic-type-variables), [io-ts](https://github.com/gcanti/io-ts/blob/master/README.md#implemented-types--combinators) and [fp-ts](https://gcanti.github.io/fp-ts/introduction/core-concepts.html) data structures.

#### Type Variables

TypeScript throws away the types of your function inputs by default.
You can preserve the types by annotating your function with type variables.
```typescript
function createPair<A,B>(first: A, second: B): [A, B] {
  return [first, second];
}
```

Above we defined the types in the function definition but it is also ok
to define the types for the const that contains the function. As long
as TypeScript can infer the types you should be ok. Please note how `a`
and `b` are meaningless in the example below but are still required in
the code.

```typescript
type PairCreator = <A,B>(a: A, b: B) => [A, B];
const createPair2: PairCreator = (first, second) => [first, second];
```

#### Pipeline

The code base makes heavy use of pipelines. Pipelines are the Javascript equivalent for UNIX pipes (the `ls|grep omg` sort of thing). The [pipeline operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Pipeline_operator) `|>` is an upcoming starndard. TypeScript is currently [waiting](https://github.com/microsoft/TypeScript/issues/17718) for TC39 standardization. However, fp-ts provides a similar `pipe` function that works today. It works as follows.

```typescript
import { pipe } from 'fp-ts/lib/function'

const double = <X extends number>(x: number) => x * 2;
const increment = <X extends number>(x: number) => x + 1;

pipe(
  5,
  double,
  double,
  increment,
  double,
); // 42
```

When debugging runtime errors it may be desirable to add debug prints into a pipe using console.log. The type language does not contain print statement. However, type assertions can be used for the same effect when debugging the type language code.

```typescript
pipe(
  5,
  double,
  (x) => { console.log(x); return x; },  // debug print
  double,
  (x: number) => x,  // type assertion
  increment,
  double,
);
```

#### Decoding JSON

Another situation where the type information is lost is when we convert
our data structures to JSON. Or the data might not have types to begin
if we read it from some external source. We use io-ts for such types
since this provides us with the type signature but also a matching
runtime validator.

In the example below we define io-ts data type user with the static
type `type User = ` and runtime validator `const User = `. The static
type is equivalent to `{ userId: number, name: string }`.

```typescript
import * as t from 'io-ts'

const User = t.type({
  userId: t.number,
  name: t.string
})
type User = t.TypeOf<typeof User>
```

In the example below we pass a json structure to the runtime validator.

```typescript
import { validator } from 'io-ts-validator';

const json: unknown = JSON.parse('{"userId":123,"name":"Bob"}');

const user: User = validator(User).decodeSync(json);
```

#### Types

We have collected some of the most basic utilities from typescript,
fp-ts and io-ts  into maasglobal-prelude-ts package to make their
use more convenient.

```typescript
import * as P from 'maasglobal-prelude-ts'

// type aliases are useful for humans and maintainability
type Failure = string

const number: number = 123
const constant: 123 = 123
const array: Array<string|number> = ['foo', 123, 'bar', 456]
const pair: [string, number] = ['foo', 123]
const record: Record<string, string|number> = {
  foo: 'foo',
  bar: 123
}
const stuct: { foo: string, bar: number } = {
  foo: 'foo',
  bar: 123
}


const aValue: P.Some<number> = {
  _tag: 'Some',
  value: 123
}
const noValue: P.None = {
  _tag: 'None',
}
const anOptionalValue: P.Option<number> = aValue
const noOptionalValue: P.Option<number> = noValue


const success: P.Right<number> = {
  _tag: 'Right',
  right: 123,
}
const failure: P.Left<Failure> = {
  _tag: 'Left',
  left: 'Unable to calculate number',
}
const eitherSucess: P.Either<Failure, number> = success
const eitherFailure: P.Either<Failure, number> = failure

type Divide = (d: number) => (i: number) => P.Either<Failure, number>
const divide: Divide = (divider) => {
  return (input) => {
    if (divider === 0) {
      return {
        _tag: 'Left',
        left: 'Division by zero error',
      };
    }
    return {
      _tag: 'Right',
      right: input / divider,
    };
  };
}


const printHello: P.IO<void> = () => console.log('hello')

type Printer = (x: unknown) => P.IO<void>
const printer: Printer = (x) => () => console.log(x)

type SumPrinter = (y: number) => (x: number) => P.IO<void>
const printSum: SumPrinter = (y) => (x) => () => console.log(x + y)

type Dice = (sides: number) => P.IO<number>
const dice: Dice = (sides) => () => 1 + Math.floor(Math.random() * sides)

type D6 = P.IO<number>
const d6: D6 = dice(6)

// P.IOEither<A, B> is the same as P.IO<P.Either<A, B>>
type D6Divider = (i: number) => P.IOEither<Failure, number>
const d6Divider: D6Divider = (input) => () => {
  const diceRoll = d6();
  const logger = printer(diceRoll);
  logger();
  const diveByDiceRoll = divide(diceRoll)
  return diveByDiceRoll(input);
}

// Task and TaskEither is similar to IO and IOEither but work with Promises
type AsyncPrinter = <S>(s: S) => P.Task<void>
const asyncPrinter: AsyncPrinter = (x) => async () => console.log(x)


// ReaderTaskEither takes dependencies and returns a task with result
type WithoutDeps = (i: number) => P.ReaderTaskEither<{ print: AsyncPrinter }, Failure, number>
const withoutDeps: WithoutDeps = (input) => ({ print }) => async () => {
  const diceRoll = d6();
  const logger = print(diceRoll);
  await logger();
  const diveByDiceRoll = divide(diceRoll)
  return diveByDiceRoll(input);
}

```

#### Convenience

The example code in previous chapter is intended to be transparent
do the reader can see the raw action that is going on in the
background. However, big amount of the glue code can be avoided
by using standard utils provided by fp-ts.

```typescript
const anOptionalValue2: P.Option<number> = P.Option_.some(123)
const noOptionalValue2: P.Option<number> = P.Option_.none

const eitherSucess2: P.Either<Failure, number> = P.Either_.right(123)
const eitherFailure2: P.Either<Failure, number> = P.Either_.left('Unable to calculate number')

const divide2: Divide = (divider) => (input) => P.pipe(
 P.Either_.right(divider),
 P.Either_.filterOrElse(
   (d) => d !== 0,
   () => 'Division by zero error'
 ),
 P.Either_.map((d) => input / d),
);


const printHello2: P.IO<void> = P.Console_.log('hello')

const printer2: Printer = P.Console_.log

const printSum2: SumPrinter = (y) => (x) => P.Console_.log(x + y)

import * as Random_  from 'fp-ts/lib/Random'
const dice2: Dice = (sides) => Random_.randomInt(1, sides)

const d6Divider2: D6Divider = (input) => P.pipe(
  d6,
  P.IO_.chainFirst(P.Console_.log),
  P.IO_.map((diceRoll) => P.pipe(
    input,
    divide(diceRoll),
  )),
)

const asyncPrinter2: AsyncPrinter = P.Task_.fromIOK(P.Console_.log)

const withoutDeps2: WithoutDeps = (input) => ({ print }) => P.pipe(
  P.Task_.fromIO(d6),
  P.Task_.chainFirst(print),
  P.Task_.map((diceRoll) => P.pipe(
    input,
    divide(diceRoll),
  )),
)
```

#### Functional Programming

The example code in the _Decoding JSON_ chapter above contained some
side-effects and introduced a `null` into the type signature. These are
properties that we would typically want to avoid in the functional parts
of our code. In the example below, we extend this example into a tiny
functional application that reads user information from a hypothetical
API and prints out the user information.

```typescript
import { Errors as ValidationErrors } from 'io-ts-validator';

type Api = {
  userInfo: (userId: number) => Promise<string>
}
const api: Api = {
  userInfo: (userId) => {
    return Promise.resolve(JSON.stringify({ userId: userId, name: 'Bob' }));
  },
};

const logResult = (result: unknown) => () => console.log(result);

const main = pipe(
  P.TaskEither_.tryCatch(() => api.userInfo(123), (error) => ({ error: 'API Error', info: [String(error)] })),
  P.TaskEither_.chain((response) =>
  P.TaskEither_.fromEither(
      P.Either_.tryCatch(() => JSON.parse(response), (error) => ({ error: 'Parse Error', info: [String(error)] })),
    ),
  ),
  P.TaskEither_.chain((json) =>
    pipe(
      validator(User).decodeEither(json),
      P.Either_.mapLeft((errors) => ({ error: 'Decode Error', info: errors })),
      P.TaskEither_.fromEither,
    ),
  ),
  P.TaskEither_.fold((error) => P.Task_.fromIO(logResult(error)), (user) => P.Task_.fromIO(logResult(user))),
);

main();
```

#### Debugging Functional Code

The code example in previous chapter doesn't have many type signatures. This is not a problem since TypeScript is often able to infer the types for your code as long as you are using typesafe building blocks. Indeed, that is one of the reasons what makes functional programming a good match for strongly typed code.

Even thought explicit variable names and type signatures are not necessary for the compiler. It is often a good idea to provide some to make the code more readable. When you are building your first application it is a good idea to write type signatures for every tiny piece of the puzzle. This will help you pinpoint down possible errors in your code. Below is the code example from previous chapter with *way too many* type signatures. However, this is exactly what you might want to confirm that the type inferance matches your expectation. You may then remove unnecessary clutter as you get more confident about your work.

```typescript

type BuildMain = P.ReaderTask<{ api: Api }, void>
const buildMain: BuildMain = ({ api }) => {

  // IO Type Definitions

  type UserC = t.Type<{
    userId: number,
    name: string,
  }>
  const User: UserC = t.type({
    userId: t.number,
    name: t.string,
  });
  type User = t.TypeOf<typeof User>;

  // Typesafe Output Mechanism

  const logResult = (result: unknown): P.IO<void> => {
    const action: P.IO<void> = () => {
      // effects are OK inside IO
      console.log(result);
    };
    return action;
  };

  // Internal Type Definitions

  type Response = string;
  type Json = unknown;

  enum Errors {
    Api = 'API Error',
    Parse = 'Parse Error',
    Decode = 'Decode Error',
  }

  interface ErrorInfo {
    error: Errors;
    info: Array<string>;
  }
  const ErrorInfo_ = {
    fromApiError: (error: unknown): ErrorInfo => ({ error: Errors.Api, info: [String(error)] }),
    fromParseError: (error: unknown): ErrorInfo => ({ error: Errors.Parse, info: [String(error)] }),
    fromDecodeError: (errors: ValidationErrors): ErrorInfo => ({ error: Errors.Decode, info: errors }),
  };

  // Architecture Description

  type ResponseRetriever = P.TaskEither<ErrorInfo, Response>;
  type ResponseParser = (s: P.TaskEither<ErrorInfo, Response>) => P.TaskEither<ErrorInfo, Json>;
  type UserDecoder = (j: P.TaskEither<ErrorInfo, Json>) => P.TaskEither<ErrorInfo, User>;
  type ResultReporter = (j: P.TaskEither<ErrorInfo, User>) => P.Task<void>;

  // Functional Implementation

  const responseRetriever: ResponseRetriever = P.TaskEither_.tryCatch((): Promise<Response> => {
    // failure and effects are OK inside TaskEither
    return api.userInfo(123);
  }, ErrorInfo_.fromApiError);

  const responseParser: ResponseParser = P.TaskEither_.chain(
    (response: Response): P.TaskEither<ErrorInfo, Json> => {
      const parsingResult: P.Either<ErrorInfo, Json> = P.Either_.tryCatch((): Json => {
        // failure is OK inside an Either (but effects are NOT)
        return JSON.parse(response);
      }, ErrorInfo_.fromParseError);
      // We "lift" the result to TaskEither to match the type of the chain
      return P.TaskEither_.fromEither(parsingResult);
    },
  );

  const responseDecoder: UserDecoder = P.TaskEither_.chain(
    (json: Json): P.TaskEither<ErrorInfo, User> => {
      type ErrorTransform = (r: P.Either<ValidationErrors, User>) => P.Either<ErrorInfo, User>;
      const errorTransform: ErrorTransform = P.Either_.mapLeft(ErrorInfo_.fromDecodeError);
      const rawDecodeResult: P.Either<ValidationErrors, User> = validator(User).decodeEither(json);

      const decodeResult: P.Either<ErrorInfo, User> = errorTransform(rawDecodeResult);
      return P.TaskEither_.fromEither(decodeResult);
    },
  );

  const resultReporter: ResultReporter = P.TaskEither_.fold(
    (error: ErrorInfo): P.Task<void> => {
      const action: P.IO<void> = logResult(error);
      return P.Task_.fromIO(action);
    },
    (user: User): P.Task<void> => {
      const action: P.IO<void> = logResult(user);
      return P.Task_.fromIO(action);
    },
  );

  return resultReporter(responseDecoder(responseParser(responseRetriever)))
}

const strictMain: P.Task<void> = buildMain({
  api: {
    userInfo: (userId: number): Promise<string> => {
      return Promise.resolve(JSON.stringify({ userId: userId, name: 'Bob' }));
    },
  }
})

// Our entire application is typesafe up to this point.  The execution of the
// main Task<void> (below) breaks referential transparency and returns
// Promise<void>.  We chose type Task<void> for main to indicate that we were
// building a standalone application.  If we were building a functional plugin
// we might have chosen main to have type Task<User|null> to let the parent
// application access the result of the computation.

strictMain();
```

#### Links To Some Basic Tools

* [function](https://gcanti.github.io/fp-ts/modules/function.ts.html) helper functions
* [Record](https://gcanti.github.io/fp-ts/modules/Record.ts.html) key/value mapping
* [Array](https://gcanti.github.io/fp-ts/modules/Array.ts.html) regular arrays
* [NonEmptyArray](https://gcanti.github.io/fp-ts/modules/NonEmptyArray.ts.html) array with at least one item

* [Either](https://gcanti.github.io/fp-ts/modules/Either.ts.html) value or error
* [Option](https://gcanti.github.io/fp-ts/modules/Option.ts.html) value or "null"

Taming [non-functional](https://gcanti.github.io/fp-ts/recipes/interoperability.html) code
* [IO](https://gcanti.github.io/fp-ts/modules/IO.ts.html)/[IOEither](https://gcanti.github.io/fp-ts/modules/IOEither.ts.html) safety wrapper for synchronous side-effects
* [Task](https://gcanti.github.io/fp-ts/modules/Task.ts.html)/[TaskEither](https://gcanti.github.io/fp-ts/modules/TaskEither.ts.html) safety wrapper for asynchronous side-effects
