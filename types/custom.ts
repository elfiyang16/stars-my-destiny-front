type Brand<K, T> = K & { __brand: T };

export type UUID = Brand<string, 'UUID'>;
