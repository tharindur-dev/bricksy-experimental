import { DevtoolState } from "./types";

export class DevtoolWrapper<T> {
    private static instance: DevtoolWrapper<unknown>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private devtools: any;
    private constructor(initialState: T) {
        if(typeof window === 'undefined') return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.devtools = (window as any)?.__REDUX_DEVTOOLS_EXTENSION__?.connect({
          name: 'bricksy-store',
        });
        this.devtools?.init(initialState);
    }

    static initDevtools<T>(initialState: T): DevtoolWrapper<T> {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new DevtoolWrapper(initialState);
        return this.instance;
    }

    public send(action: string, state: DevtoolState<T>): void {
        this.devtools?.send(action, state);
    }


}