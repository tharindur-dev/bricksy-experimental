import { DevtoolWrapper } from "../src/brick/devtoolWrapper";

/**
 * @jest-environment jsdom
 */
describe('DevtoolWrapper', () => {
    let mockDevTools: { connect: jest.Mock };

    beforeAll(() => {
        const sendFn = jest.fn();
        const initFn = jest.fn();
        // Mock the Redux DevTools extension
        mockDevTools = {
            connect: jest.fn(() => ({
                send: sendFn,
                init: initFn
            }))
        };

        // Mock the global window object
        global.window = {
            __REDUX_DEVTOOLS_EXTENSION__: mockDevTools,
        } as unknown as Window & typeof globalThis;
    });

    afterEach(()=>{
        jest.clearAllMocks();
    })

    it('should initialize Redux DevTools with the initial state', () => {
        const initialState = { count: 0 };
        DevtoolWrapper.initDevtools(initialState);
        expect(mockDevTools.connect).toHaveBeenCalledWith({ name: 'bricksy-store' });
        expect(mockDevTools.connect().init).toHaveBeenCalledWith(initialState);
    });

    it('should send actions and state to Redux DevTools', () => {
        const initialState = { count: 0 };
        const devtoolWrapper = DevtoolWrapper.initDevtools(initialState);

        const action = 'INCREMENT';
        const newState = { count: 1 };

        devtoolWrapper.send(action, newState);

        expect(mockDevTools.connect().send).toHaveBeenCalledWith(action, newState);
    });

    it('should return the same instance for multiple calls to initDevtools', () => {
        const initialState1 = { count: 0 };
        const initialState2 = { count: 10 };

        const instance1 = DevtoolWrapper.initDevtools(initialState1);
        const instance2 = DevtoolWrapper.initDevtools(initialState2);

        expect(instance1).toBe(instance2);
    });

    it('should not initialize Redux DevTools if window is undefined', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (global.window as any) = undefined;

        const initialState = { count: 0 };
        DevtoolWrapper.initDevtools(initialState);

        expect(mockDevTools.connect).not.toHaveBeenCalled();
    });
});