import { of } from 'rxjs';
import { Brick } from './brick/Brick';
import { count } from 'console';

of('hello', 'rxjs').subscribe(console.log);
type X = {message: string, count: number};
const brick: Brick<X> = new Brick({count: 10, message: 'hello'});
const brick2 = new Brick('hello');

brick.data$.subscribe(console.log);

const count$ = brick.getSelector$((s)=> s.count);
const err$ = brick.error$;
err$.subscribe(console.log)
count$.subscribe(console.log);

brick.registerSideEffect(
    (curr) => curr.count === 100,
    (value) => console.log('🎉value is 100 🎉🎉🎉🎉🎉', value)
);

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

