import { createStore } from '../brick';
import { Brick } from '../brick/Brick';

type X = {message: string, count: number};
const brick: Brick<X> = createStore({count: 10, message: 'hello'});

brick.select$().subscribe(console.log);

const count$ = brick.select$((s)=> s.count);
count$.subscribe(console.log);


const countS = brick.select$((x)=> x.count );
countS.subscribe(value=> console.log('count changed:', value));

setValue(brick, 10);
setValue(brick, 100);
setValue(brick, 50);
setValue(brick, 10);
setValue(brick, 100);
setValue(brick, 10);
setValue(brick, 10);


function setValue(brick: Brick<X>, value: number ) {
    brick.setData((state)=>({...state, count: value}));
    console.log('value set:', value);
}

