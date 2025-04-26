export type SetDataArg<T> = T | ((state: T) => T);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DevtoolState<T> = T | {type: 'sideEffect', payload: any};