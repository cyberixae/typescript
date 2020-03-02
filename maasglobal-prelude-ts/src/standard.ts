
export type unknownType = unknown;
export type nullType = null;
export type stringType = string;
export type undefinedType = undefined;
export type voidType = void;

export type booleanType = boolean;
export type numberType = number;

export type RecordType<K extends string | number | symbol, T> = Record<K, T>;
export type ArrayType<T> = Array<T>;
