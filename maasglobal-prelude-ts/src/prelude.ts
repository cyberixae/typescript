// TypeScript Prelude

// key stuff

export type FE<R> = () => R;
export type II = <R>(fe: FE<R>) => R;
export const ii: II = (fe) => fe();

export { pipe } from 'fp-ts/lib/pipeable';
export { flow } from 'fp-ts/lib/function';
export { identity } from 'fp-ts/lib/function';

// basic stuff

import { unknownType } from './standard';
import { unknown as unknownCodec } from 'io-ts';
export const unknown = unknownCodec;
export type unknown = unknownType;

import { nullType } from './standard';
import { null as nullCodec } from 'io-ts';
export const null = nullCodec;
export type null = nullType;

import { stringType } from './standard';
import { string as stringCodec } from 'io-ts';
export const string = stringCodec;
export type string = stringType;

import { undefinedType } from './standard';
import { undefined as undefinedCodec } from 'io-ts';
export const undefined = undefinedCodec;
export type undefined = undefinedType;

import { voidType } from './standard';
import { void as voidCodec } from 'io-ts';
export const void = voidCodec;
export type void = voidType;

// function
import * as function_ from 'fp-ts/lib/function';
export { function_ };

// Lazy
export { Lazy } from 'fp-ts/lib/function';

// Predicate
export { Predicate } from 'fp-ts/lib/function';

// boolean
import { booleanType } from './standard';
import { boolean as booleanCodec } from 'io-ts';
export const boolean = booleanCodec;
export type boolean = booleanType;
import * as boolean_ from 'fp-ts/lib/boolean';
export { boolean_ };

// number
import { numberType } from './standard';
import { number as numberCodec } from 'io-ts';
export const number = numberCodec;
export type number = numberType;
export { NumberFromString as numberFromString } from 'io-ts-types/lib/NumberFromString';

// Array
import { ArrayType } from './standard';
import { array as ArrayCodec } from 'io-ts';
export const Array = ArrayCodec;
export type Array<T> = ArrayType<T>;
import * as Array_ from 'fp-ts/lib/Array';
export { Array_ };
export { array as Array__ } from 'fp-ts/lib/Array';
export const array = <A>(...a: Array<A>) => a;

// Record

import { RecordType } from './standard';
import { record as RecordCodec } from 'io-ts';
export const Record = RecordCodec;
export type Record<K extends string | number | symbol, T> = RecordType<K, T>;
import * as Record_ from 'fp-ts/lib/Record';
export { Record_ };
export { record as Record__ } from 'fp-ts/lib/Record';

// Int
export { Int } from 'io-ts';
export { IntFromString } from 'io-ts-types/lib/IntFromString';

// NonEmptyArray
import { nonEmptyArray as NonEmptyArrayCodec } from 'io-ts-types/lib/nonEmptyArray';
import { NonEmptyArray as NonEmptyArrayType } from 'fp-ts/lib/NonEmptyArray';
export const NonEmptyArray = NonEmptyArrayCodec;
export type NonEmptyArray<A> = NonEmptyArrayType<A>;
import * as NonEmptyArray_ from 'fp-ts/lib/NonEmptyArray';
export { NonEmptyArray_ };

// Option
import { Option as OptionType } from 'fp-ts/lib/Option';
import { option as OptionCodec } from 'io-ts-types/lib/option';
export const Option = OptionCodec;
export type Option<A> = OptionType<A>;
export { optionFromNullable as OptionFromNullable } from 'io-ts-types/lib/optionFromNullable';
import * as Option_ from 'fp-ts/lib/Option';
export { Option_ };
export { option as Option__ } from 'fp-ts/lib/Option';

// None
export { None } from 'fp-ts/lib/Option';
export { none } from 'fp-ts/lib/Option';

// Some
export { Some } from 'fp-ts/lib/Option';
export { some } from 'fp-ts/lib/Option';

// Either
import { Either as EitherType } from 'fp-ts/lib/Either';
import { either as EitherCodec } from 'io-ts-types/lib/either';
export const Either = EitherCodec;
export type Either<E, A> = EitherType<E, A>;
import * as Either_ from 'fp-ts/lib/Either';
export { Either_ };
export { either as Either__ } from 'fp-ts/lib/Either';

// Left
export { Left } from 'fp-ts/lib/Either';
export { left } from 'fp-ts/lib/Either';

// Right
export { Right } from 'fp-ts/lib/Either';
export { right } from 'fp-ts/lib/Either';

// IO
export { IO } from 'fp-ts/lib/IO';
import * as IO_ from 'fp-ts/lib/IO';
export { IO_ };
export { io as IO__ } from 'fp-ts/lib/IO';

// IOEither
export { IOEither } from 'fp-ts/lib/IOEither';
import * as IOEither_ from 'fp-ts/lib/IOEither';
export { IOEither_ };
export { ioEither as IOEither__ } from 'fp-ts/lib/IOEither';

// Task
export { Task } from 'fp-ts/lib/Task';
import * as Task_ from 'fp-ts/lib/Task';
export { Task_ };
export { task as Task__ } from 'fp-ts/lib/Task';
export { taskSeq as TaskSeq__ } from 'fp-ts/lib/Task';

// TaskEither
export { TaskEither } from 'fp-ts/lib/TaskEither';
import * as TaskEither_ from 'fp-ts/lib/TaskEither';
export { TaskEither_ };
export { taskEither as TaskEither__ } from 'fp-ts/lib/TaskEither';
export { taskEitherSeq as TaskEitherSeq__ } from 'fp-ts/lib/TaskEither';

// Magma
export { Magma } from 'fp-ts/lib/Magma';

// Ord
export { Ord } from 'fp-ts/lib/Ord';
import * as Ord_ from 'fp-ts/lib/Ord';
export { Ord_ };
export { ord as Ord__ } from 'fp-ts/lib/Ord';

// Reader
import * as Reader_ from 'fp-ts/lib/Reader';
export { Reader_ };

// Apply
import * as Apply_ from 'fp-ts/lib/Apply';
export { Apply_ };

// Foldable
import * as Foldable_ from 'fp-ts/lib/Foldable';
export { Foldable_ };
