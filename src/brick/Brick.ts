import { BehaviorSubject, distinctUntilChanged, filter, map, Observable } from "rxjs";

export type BrickInternalData<T,E=string> = {
    data: T;
    error: E | null;
    isLoading: boolean;
}

export class Brick<T, E=string> {

    private subject: BehaviorSubject<BrickInternalData<T,E>>;

    constructor(initialData: T) {
        this.subject = new BehaviorSubject({
            data: initialData,
            error: null,
            isLoading: false
        } as BrickInternalData<T,E>);
    }

    public setData(data: T): void {
        this.subject.next({
            ...this.subject.value,
            data
        });
    }

    public setError(error: E): void {
        this.subject.next({
            ...this.subject.value,
            error
        });
    }

    public setIsLoading(isLoading: boolean): void {
        this.subject.next({
            ...this.subject.value,
            isLoading
        });
    }

    public asObservable(): Observable<BrickInternalData<T,E>> {
        return this.subject.asObservable();
    }

    public get data$(): Observable<T> {
        return this.subject.pipe(
            map( value => value.data),
            distinctUntilChanged(),
        )
    }

    public get error$(): Observable<E | null> {
        return this.subject.pipe(
            map(value => value.error),
            distinctUntilChanged(),
        );
    }

    public get isLoading$(): Observable<boolean> {
        return this.subject.pipe(
            map(value => value.isLoading),
            distinctUntilChanged(),
        );
    }

    public getSelector$<S>(selector: (source: T) => S): Observable<S> {
        return this.subject.pipe(
            map( value => selector(value.data)),
            distinctUntilChanged(),
        );
    }

    public getValue(): BrickInternalData<T,E> {
        return this.subject.value;
    }

    public patch(partial: Partial<T>): void {
        this.setData({...this.subject.value.data, ...partial});
    }

    public registerSideEffect(
        changeFn: (state: T) => boolean,
        effect: (value: T) => any
    ): void {
        // write cleanup
        this.data$.pipe(
            filter(changeFn)
        ).subscribe(value => effect(value))
    }

    // prevent memory leaks 
    // way to register middleware - side effects -done
    // combine few bricks
}