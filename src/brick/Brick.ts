import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { distinctUntilChanged } from "rxjs/internal/operators/distinctUntilChanged";
import { map } from "rxjs/internal/operators/map";
import { Observable } from "rxjs/internal/Observable";
import { BrickDirectory } from "./BrickDirectory";
import { BrickInternalData } from "./types/Types";


const brickDirectory = {};

export class Brick<T, E=string> {

    private subject: BehaviorSubject<BrickInternalData<T,E>>;
    private instance = BrickDirectory.getInstance();
    private actions = new Map<string, (state: T, payload: any) => T>();
    private sideEffects = new Map<string, (args: any) => any>();

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
        if(arg1 instanceof Function) {
            this.subject.next( {
                ...this.subject.value,
                data: arg1(this.subject.value.data)
            });
            return;
        }
        if(arg1 instanceof Object) {
            this.subject.next({
                ...this.subject.value,
                data: arg1 as T
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

    public select$(): Observable<T>;
    public select$<S>(selector?: (source: T) => S): Observable<S>;
    public select$<S>(
        selector?: (source: T) => S,
        comparator?: (source: S) => boolean
    ): Observable<S> {

        if(!selector){
            return this.data$ as unknown as Observable<S>; 
        } 

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

// TODOs: 
// Remove redundant methods. make it simple
    public get snapshot(): T {
        return this.subject.value.data;
    }

    public registerAction(name: string, reducer: (state: T, payload: any)=> T): void {
        if(this.actions.has(name)){
            throw new Error(`Action with the name "${name}" is already registered.`);
        }
        this.actions.set(name, reducer);
    }

    public dispatch(action: string, payload: any): void {
        const reducer = this.actions.get(action);
        const sideEffect = this.sideEffects.get(action);
        if (typeof reducer === 'function') {
            this.setData((state) => reducer(state, payload));
        }
        if (typeof sideEffect === 'function') {
            sideEffect(payload);
        }
    }

    public registerSideEffect(name: string, effect: (args: any)=>any): void {
        if (this.sideEffects.has(name)) {
            throw new Error(`Side effect with the name "${name}" is already registered.`);
        }
        this.sideEffects.set(name, effect);
    }
}