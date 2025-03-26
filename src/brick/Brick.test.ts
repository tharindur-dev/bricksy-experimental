import assert from "assert";
import { Brick } from "./Brick";
import { createStore } from ".";


describe('Brick', () => {
    it('should create a brick', () => {
        const brick = new Brick({type: 'test'});
        assert.notStrictEqual(brick, null);        
    });
});

describe('Selectors test', ()=> {
    describe('Selectors test', () => {
        it('should observe the entire state', (done) => {
            const brick = new Brick({ count: 0, name: 'Bricksy' });
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
})

function defer(fn: () => void, delay: number = 100): void {
    setTimeout(fn, delay);
}