import assert from "assert";
import { Brick } from "./Brick";
import { createStore } from ".";


describe('Brick', () => {
    it('should create a brick', () => {
        const brick = createStore({type: 'test'});
        assert.notStrictEqual(brick, null);        
    });
});


describe('Selectors test', () => {
    it('should observe the entire state', (done) => {
        const brick = createStore({ count: 0, name: 'Bricksy' });
        brick.select$().subscribe((state) => {

            assert.deepStrictEqual(state, { count: 0, name: 'Bricksy' });
            done();
        });
    });

    it('should observe a specific portion of the state', (done) => {
        const brick = new Brick({ count: 0, name: 'Bricksy' });
        brick.select$((state) => state.count).subscribe((count) => {
            assert.strictEqual(count, 0);
            done();
        });
    });

    it('should observe with a custom comparator', (done) => {
        const store = createStore({ count: 0, name: 'Bricksy' });
        const data: string[] = [];
        store.select$(
            (s)=> s.name,
            (prev, curr) => prev.toLowerCase() === curr.toLowerCase()
        ).subscribe(
            (name) => {
                data.push(name);
            }
        );

        store.setData((data) => ({ ...data, count: 1 }));
        store.setData((data) => ({ ...data, name: 'brisky' }));
        store.setData((data) => ({ ...data, name: 'BriskY' }));
        store.setData((data) => ({ ...data, name: 'Bricksy' }));

        defer(()=> {
            assert.deepStrictEqual(data, ['Bricksy', 'brisky', 'Bricksy']);
            done();
        });
    });
});


describe('Actions test', () => {
    it('should register an action and update state when dispatched', () => {
        const brick = createStore({ count: 0 });
        brick.registerAction('increment', (state, payload: number) => ({
            ...state,
            count: state.count + payload
        }));

        brick.dispatch('increment', 5);

        assert.deepStrictEqual(brick.snapshot, { count: 5 });
    });

    it('should throw an error when registering an action with a duplicate name', () => {
        const brick = createStore({ count: 0 });
        brick.registerAction('increment', (state, payload: number) => ({
            ...state,
            count: state.count + payload
        }));

        assert.throws(() => {
            brick.registerAction('increment', (state, payload: number) => ({
                ...state,
                count: state.count + payload
            }));
        }, /Action with the name "increment" is already registered/);
    });

    it('should handle multiple actions and update state accordingly', () => {
        const brick = createStore({ count: 0 });
        brick.registerAction('increment', (state, payload: number) => ({
            ...state,
            count: state.count + payload
        }));
        brick.registerAction('decrement', (state, payload: number) => ({
            ...state,
            count: state.count - payload
        }));

        brick.dispatch('increment', 10);
        assert.deepStrictEqual(brick.snapshot, { count: 10 });

        brick.dispatch('decrement', 3);
        assert.deepStrictEqual(brick.snapshot, { count: 7 });
    });
})

describe('Side Effects test', () => {
    it('should register a side effect and trigger it when dispatched', () => {
        const brick = createStore({ count: 0 });
        let sideEffectTriggered = false;

        brick.registerSideEffect('log', (payload) => {
            sideEffectTriggered = true;
            assert.deepStrictEqual(payload, { message: 'Hello, Bricksy!' });
        });

        brick.dispatch('log', { message: 'Hello, Bricksy!' });

        assert.strictEqual(sideEffectTriggered, true);
    });

    it('should throw an error when registering a side effect with a duplicate name', () => {
        const brick = createStore({ count: 0 });
        brick.registerSideEffect('log', (payload) => {
            console.log(payload);
        });

        assert.throws(() => {
            brick.registerSideEffect('log', (payload) => {
                console.log(payload);
            });
        }, /Side effect with the name "log" is already registered/);
    });

    it('should handle multiple side effects and trigger them independently', () => {
        const brick = createStore({ count: 0 });
        let logTriggered = false;
        let notifyTriggered = false;

        brick.registerSideEffect('log', (payload) => {
            logTriggered = true;
            assert.strictEqual(payload, 'Logging...');
        });

        brick.registerSideEffect('notify', (payload) => {
            notifyTriggered = true;
            assert.strictEqual(payload, 'Notification sent');
        });

        brick.dispatch('log', 'Logging...');
        assert.strictEqual(logTriggered, true);
        assert.strictEqual(notifyTriggered, false);

        brick.dispatch('notify', 'Notification sent');
        assert.strictEqual(notifyTriggered, true);
    });
});


function defer(fn: () => void, delay: number = 100): void {
    setTimeout(fn, delay);
}