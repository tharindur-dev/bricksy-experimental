import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { distinctUntilChanged } from "rxjs/internal/operators/distinctUntilChanged";
import { map } from "rxjs/internal/operators/map";
import { Observable } from "rxjs/internal/Observable";

export class Brick<T> {

    private subject: BehaviorSubject<T>;
    private actions = new Map<string, (state: T, payload: any) => T>();
    private sideEffects = new Map<string, (args: any) => any>();

    constructor(initialData: T) {
        this.subject = new BehaviorSubject(initialData);
    }

    public static createBrick<T>(initialData: T): Brick<T> {
        return new Brick<T>(initialData);
    }

    /**
     * Updates the state of the Brick with new data or a transformation function.
     *
     * @param arg1 - Either a new state object of type `T` or a function that takes the current state
     *               and returns a new state.
     *
     * @remarks
     * - If `arg1` is a function, it will be called with the current state, and its return value
     *   will be used as the new state.
     * - If `arg1` is an object, it will directly replace the current state.
     *
     * @example
     * ```typescript
     * const brick = new Brick({ count: 0 });
     *
     * // Update state with a new object
     * brick.setData({ count: 5 });
     *
     * // Update state using a transformation function
     * brick.setData((current) => ({ count: current.count + 1 }));
     * ```
     */
    public setData(data: T): void;
    public setData(updateFn: (current: T) => T): void;
    public setData(arg1: T | ((current: T)=> T)): void {
        if(arg1 instanceof Function) {
            this.subject.next(arg1(this.subject.value));
            return;
        }
        if(arg1 instanceof Object) {
            this.subject.next(arg1);
        }

    }

    public asObservable(): Observable<T> {
        return this.subject.asObservable();
    }

    /**
     * Selects and observes a portion of the state or the entire state of the Brick.
     *
     * @typeParam S - The type of the selected state if a selector is provided.
     *
     * @param selector - An optional function to extract a specific portion of the state.
     *                   If not provided, the entire state is observed.
     * @param comparator - An optional function to determine if the selected state has changed.
     *                     If not provided, strict equality comparison is used.
     *
     * @returns An `Observable` that emits the selected state or the entire state.
     *
     * @remarks
     * - If no selector is provided, the entire state is emitted as an observable.
     * - If a selector is provided, it extracts a specific portion of the state.
     * - The comparator function can be used to customize the change detection logic.
     *
     * @example
     * ```typescript
     * const brick = new Brick({ count: 0, name: 'Bricksy' });
     *
     * // Observe the entire state
     * brick.select$().subscribe(state => {
     *   console.log(state); // { count: 0, name: 'Bricksy' }
     * });
     *
     * // Observe a specific portion of the state
     * brick.select$(state => state.count).subscribe(count => {
     *   console.log(count); // 0
     * });
     *
     * // Observe with a custom comparator
     * brick.select$(state => state.name, (prev,curr) => prev.name?.equalsIgnoreCase(curr.name)).subscribe(name => {
     *   console.log(name); // 'Bricksy'
     * });
     * ```
     */
    public select$(): Observable<T>;
    public select$<S>(selector: (source: T) => S): Observable<S>;
    public select$<S>(
        selector: (source: T) => S,
        comparator: (previous: S, current: S) => boolean
    ): Observable<S>;
    public select$<S>(
        selector?: (source: T) => S,
        comparator?: (previous: S, current: S) => boolean
      ): Observable<any> { 

        if(!selector){
            return this.subject.asObservable() as unknown as Observable<S>;
        } 

        return this.subject.pipe(
            map(selector),
            distinctUntilChanged(comparator),
        );
    }

    /**
     * @returns The current state of the store.
     * 
     */

    public get snapshot(): T {
        return this.subject.value;
    }

    /**
     * Registers a new action with a reducer function.
     *
     * @param name - The name of the action to register.
     * @param reducer - A function that takes the current state and a payload, and returns the new state.
     *
     * @throws An error if an action with the same name is already registered.
     *
     * @example
     * ```typescript
     * const brick = new Brick({ count: 0 });
     *
     * brick.registerAction('increment', (state, payload) => ({
     *   ...state,
     *   count: state.count + payload
     * }));
     *
     * brick.dispatch('increment', 1);
     * console.log(brick.snapshot); // { count: 1 }
     * ```
     */
    public registerAction(name: string, reducer: (state: T, payload: any)=> T): void {
        if(this.actions.has(name)){
            throw new Error(`Action with the name "${name}" is already registered.`);
        }
        this.actions.set(name, reducer);
    }

    /**
     * Registers a new side effect with a specified name.
     *
     * @param name - The name of the side effect to register.
     * @param effect - A function that performs a side effect when the associated action is dispatched.
     *
     * @throws An error if a side effect with the same name is already registered.
     *
     * @example
     * ```typescript
     * const brick = new Brick({ count: 0 });
     *
     * brick.registerSideEffect('log', (payload) => {
     *   console.log('Side effect triggered with payload:', payload);
     * });
     *
     * brick.dispatch('log', { message: 'Hello, Bricksy!' });
     * // Output: Side effect triggered with payload: { message: 'Hello, Bricksy!' }
     * ```
     */
    public registerSideEffect(name: string, effect: (args: any)=>any): void {
        if (this.sideEffects.has(name)) {
            throw new Error(`Side effect with the name "${name}" is already registered.`);
        }
        this.sideEffects.set(name, effect);
    }

    /**
     * Dispatches an action or triggers a side effect by its name.
     *
     * @param action - The name of the action or side effect to invoke.
     * @param payload - The data to pass to the action reducer or side effect.
     *
     * @remarks
     * - If an action is registered with the given name, its reducer updates the state.
     * - If a side effect is registered with the given name, it is executed with the payload.
     *
     * @example
     * ```typescript
     * const brick = new Brick({ count: 0 });
     * brick.registerAction('increment', (state, payload) => ({ count: state.count + payload }));
     * brick.dispatch('increment', 1); // Updates state to { count: 1 }
     * ```
     */
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
}