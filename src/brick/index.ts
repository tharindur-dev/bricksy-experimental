import {Brick} from './Brick';

export function createStore<T>(initialData: T): Brick<T> {
    return new Brick(initialData);
}