import { BehaviorSubject, distinctUntilChanged, filter, map, Observable, Subscription } from "rxjs";
import { BrickDirectory } from "./BrickDirectory";
import { BrickInternalData } from "./types/Types";


const brickDirectory = {};

export class Brick<T, E=string> {

    private subject: BehaviorSubject<BrickInternalData<T,E>>;
    private instance = BrickDirectory.getInstance();

    constructor(name: string, initialData: T) {
        this.subject = new BehaviorSubject({
            data: initialData,
            error: null,
            isLoading: false
        } as BrickInternalData<T,E>);
        // register in brick directory
        // todo: better way to handle this
        this.instance.registerBrick(name, this as unknown as Brick<any, string>);
    }

    public static createBrick<T, E=string>(name: string, initialData: T): Brick<T, E> {
        const brick = new Brick<T, E>(name, initialData);

        return brick;
    }

    public setData(data: T): void;
    public setData(updateFn: (current: T) => T): void;

    public setData(arg1: T | ((current: T)=> T)): void {
        if(arg1 instanceof Object) {
            this.subject.next({
                ...this.subject.value,
                data: arg1 as T
            });
        }
        if(arg1 instanceof Function) {
            this.subject.next( {
                ...this.subject.value,
                data: arg1(this.subject.value.data)
            });
        }
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

    public select$<S>(
        selector: (source: T) => S,
        comparator?: (source: S) => boolean
    ): Observable<S> {
        return this.subject.pipe(
            map( value => selector(value.data)),
            distinctUntilChanged(comparator),
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
    ): Subscription {
        // write cleanup
        return this.data$.pipe(
            filter(changeFn)
        ).subscribe(value => effect(value))
    }

    // prevent memory leaks 
    // way to register middleware - side effects -done
    // combine few bricks

    public get snapshot(): T {
        return this.subject.value.data;
    }
}