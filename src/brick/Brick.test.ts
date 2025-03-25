import assert from "assert";
import { Brick } from "./Brick";


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
            const brick = new Brick({ count: 0, name: 'Bricksy' });
            brick.select$(
                (s)=> s.name,
                (prev, curr) => prev?.toLowerCase() !== curr?.toLowerCase()
            ).subscribe(
            (name) => {
                assert.strictEqual(name, 'Bricksy');
                done();
            }
            )
        });
    });
})