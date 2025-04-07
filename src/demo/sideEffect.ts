import { skip } from "rxjs";
import { createStore } from "../brick";

type PetAccessory = {
    id: string;
    name: string;
    price: number;
    category: "toys" | "food" | "grooming" | "bedding";
};

type VetConsultation = {
    id: string;
    petName: string;
    ownerName: string;
    date: string;
    issueDescription: string;
    vetName: string;
};

type PetAccessoryShop = {
    accessories: PetAccessory[];
    consultations: VetConsultation[];
    isLoading?: boolean;
    error?: string;
};

const sampleData: PetAccessoryShop = {
    accessories: [
        { id: "1", name: "Chew Toy", price: 10.99, category: "toys" },
        { id: "2", name: "Dog Food", price: 25.5, category: "food" },
        { id: "3", name: "Cat Brush", price: 15.0, category: "grooming" },
        { id: "4", name: "Pet Bed", price: 50.0, category: "bedding" },
    ],
    consultations: [
        {
            id: "101",
            petName: "Buddy",
            ownerName: "Alice",
            date: "2023-10-01",
            issueDescription: "Skin rash",
            vetName: "Dr. Smith",
        },
        {
            id: "102",
            petName: "Mittens",
            ownerName: "Bob",
            date: "2023-10-02",
            issueDescription: "Limping",
            vetName: "Dr. Johnson",
        },
    ],
};



/*******************************************************
 *                                                     *
 *                  Testing CODE HERE                  *
 *                                                     *
 *******************************************************/

const store = createStore(sampleData);
const SET_LOADING = 'ACTION_SET_LOADING';
const FETCH_DATA = 'FETCH_DATA';
store.registerAction(SET_LOADING, (state, isLoading: boolean) => {
    return {
        ...state,
        isLoading
    }
});

store.registerSideEffect(FETCH_DATA, async (id: number)=> {
    console.log('fetching data for id:', id);
    store.dispatch(SET_LOADING, true);
    await mockDataFetch(id);
    store.dispatch(SET_LOADING, false);
})

function mockDataFetch(id: number){
    return new Promise<void>((resolve) => {

        setTimeout(() => {
            console.log('Data fetched successfully for', id);
            resolve();
        }, 3000);
    });

}

store.select$((state)=> state.isLoading)
.pipe(skip(1))
.subscribe((isLoading?: boolean)=> console.log('isLoading changed', isLoading));

store.dispatch(FETCH_DATA, 10);

