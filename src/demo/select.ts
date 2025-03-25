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
type Vet = {
    name: string;
    specialization: string;
    contact: {
        email: string;
        phone: string;
    };
};

const vets: Vet[] = [
    {
        name: 'Dr. Smith',
        specialization: 'Canine Specialist',
        contact: {
            email: 'dr.smith@example.com',
            phone: '111-222-3333'
        }
    },
    {
        name: 'Dr. Brown',
        specialization: 'Feline Specialist',
        contact: {
            email: 'dr.brown@example.com',
            phone: '444-555-6666'
        }
    },
    {
        name: 'Dr. Green',
        specialization: 'Avian Specialist',
        contact: {
            email: 'dr.green@example.com',
            phone: '777-888-9999'
        }
    }
];


const petstore = createStore(myPet);
const vetStore = createStore(vets);

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

petstore.setData((state)=>({...state, name: 'bunny'}));



