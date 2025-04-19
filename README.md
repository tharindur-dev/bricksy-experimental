

# Bricksy: A zero boilerplate solution to state management

<!-- Introduction -->
<!-- Add a brief introduction to the library and its purpose. -->
Bricksy is a light weight zero boilerplate state management library built on top of RxJs.


## When to use Bricksy
- Your app needs state management, you don't need to go for a full blown state management library like NgRx or Redux.

- You need a lightweight state management libary.

<!-- Features -->
<!-- List the key features of Bricksy. -->
## Features

- 🚀 **Zero Boilerplate**: Simplify state management with minimal setup and configuration.
- ⚡ **Reactive by Design**: Built on top of RxJs, enabling powerful reactive programming capabilities.
- 📦 **Lightweight**: Small footprint, perfect for projects that don't require heavy state management libraries.
- 🌟 **TypeScript Support**: Fully typed for a better developer experience.
- 🌐 **Framework Agnostic**: Works with any JavaScript or TypeScript framework.

<!-- Installation -->
<!-- Provide installation instructions. -->
## Installation

To install Bricksy, you can use npm or yarn:

```bash
# Using npm
npm install bricksy

# Using yarn
yarn add bricksy
```

## Usage
### Usage

Here’s how you can use Bricksy to manage your application state:

#### 1. `createStore`
The `createStore()` function initializes a new store with a default state.

```typescript
import { createStore } from 'bricksy';

const store = createStore({ count: 0 });
```

#### 2. `setData()`
The `setData()` method allows you to update the state in the store.

```typescript
store.setData({ count: 5 });
console.log(store.snapshot()); // { count: 5 }
```

You can also setData with an update function.
```typescript
store.setData(state => ({count: state.count + 1}));
console.log(store.snapshot()); // { count: 6 }
```


#### 3. `select()`
The `select()` function enables you to extract observable "slices" of the state.

Selecting the entire state

```typescript
store.select().subscribe((state) => {
    console.log('State updated:', state);
});
```

Selecting an observable slice of the state.

```typescript
const store = createStore({
    user: {
        name: 'John Doe',
        age: 30,
    },
    settings: {
        theme: 'dark',
        notifications: true,
    },
});


store.select((state)=> state.user).subscribe((user) => {
    console.log('User updated:', user);
});

```

You can also declare a comparison function with select() so that events are emitted only when the comparison function returns true.

```typescript
const store = createStore({
    user: {
        id: 1,
        name: 'John Doe',
        age: 30,
    },
    settings: {
        theme: 'dark',
        notifications: true,
    },
});


store.select(
    (state)=> state.user, 
    (prevUser, currentUser)=> prevUser.id !== currentUser.id
    ).subscribe((user) => {
    console.log('User updated:', user);
});

// no event is emitted here, since the id has not been changed
store.setData((state) => ({...state, user: {...state.user, name: 'Jane Doe'}}));

// this will emit an event since the id has been changed
store.setData((state) => ({...state, user: {...state.user, id: 2, name: 'Jane Doe'}}));

```
#### 4. `registerAction()` 
The `registerAction()` method lets you define actions that can modify the state.

```typescript
store.registerAction('increment', (state, payload) => {
    return { ...state, count: state.count + payload };
});

store.dispatch('increment', 1);
console.log(store.getData()); // { count: 6 }
```

#### 5. `registerSideEffect()`
The `registerSideEffect()` method allows you to define side effects that respond to state changes.

```typescript
store.registerSideEffect('logCount', (state) => {
    console.log('Side effect triggered. Current count:', state.count);
});

store.setData({ count: 10 });
// Logs: Side effect triggered. Current count: 10
```

With these methods, Bricksy provides a simple yet powerful way to manage application state reactively.

<!-- API Reference -->
<!-- Document the main API methods and their usage. -->

<!-- Contributing -->
<!-- Explain how others can contribute to the project. -->

<!-- License -->
<!-- Specify the license under which the library is distributed. -->