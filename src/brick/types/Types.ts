export type BrickInternalData<T,E=string> = {
    data: T;
    error: E | null;
    isLoading: boolean;
}
