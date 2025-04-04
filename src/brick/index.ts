import {Brick} from './Brick';


export default Brick;

export function createStore<T>(initialData: T): Brick<T> {
    return new Brick(initialData);
}