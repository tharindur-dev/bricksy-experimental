import { Brick } from '../brick/Brick';

type X = {message: string, count: number};
const brick: Brick<X> = Brick.createBrick('test', {count: 10, message: 'hello'});
const brick2 = new Brick('test','hello');

brick.data$.subscribe(console.log);

const count$ = brick.select$((s)=> s.count);
const err$ = brick.error$;
err$.subscribe(console.log)
count$.subscribe(console.log);

brick.registerSideEffect(
    (curr) => curr.count === 100,
    (value) => console.log('🎉value is 100 🎉🎉🎉🎉🎉', value)
);

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
    brick.patch({count: value});
    console.log('value set:', value);
}

