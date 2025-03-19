import assert from "assert";
import { Brick } from "./Brick";


describe('Brick', () => {
    it('should create a brick', () => {
        const brick = Brick.createBrick('test', {type: 'test'});
assert.notStrictEqual(brick, null);        
    });
});