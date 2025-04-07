import { createStore } from "../brick";

type Pet = {
    name: string;
    age: number;
    type: 'dog' | 'cat' | 'bird' | 'fish';
    owner: {
        name: string;
        contact: {
            email: string;
            phone: string;
        };
    };
};

const myPet: Pet = {
    name: 'Buddy',
    age: 3,
    type: 'dog',
    owner: {
        name: 'John Doe',
        contact: {
            email: 'john.doe@example.com',
            phone: '123-456-7890'
        }
    }
};

const petstore = createStore(myPet);


const owner$ = petstore.select$((s)=>(s.owner));
const store$ = petstore.select$();
const ownerName$ = petstore.select$(
    (s) => s.owner.name,
    (x,y) => x === y
);

owner$.subscribe(x=>console.log('owner',x));
store$.subscribe(x=> console.log('store obs', x));

petstore.setData({
    ...myPet,
    name: 'Max'
});


petstore.setData({
    ...myPet,
    owner: {
        ...myPet.owner,
        name: 'Jane Doe',
        contact: {
            ...myPet.owner.contact,
            email: 'jane.doe@example.com',
            phone: '987-654-3210'
        }
    }
});

ownerName$.subscribe((name)=> console.log('owner name', name));

petstore.setData((d)=> ({...d, owner: {...d.owner, name: 'paul'}}));

petstore.setData((state)=>({...state, name: 'bunny'}));



