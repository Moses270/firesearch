# FireSearch

FireSearch is a JavaScript package built to easily support text searches in firestore database. Built by [EmbyBest Concept](https://embyconcept.com) to assist firebase/firestore developers to search through their data content stored in firestore. It is tested with Node.js and can easily be adapted to other JavaScript-based environments as well.

## Installation
Install FireSearch via npm by running the following command: 
> `npm install firesearch --save`

## Usage
Create an instance of FireSearch and call available methods from the instance created.

 ```typescript
import { FireSearch } from 'firesearch';

const fireSearch = new FireSearch();
 ``` 

### Use `FireSearch` utilities functions as follows
```typescript
// converts all timestamp in doc to js date
const doc = {
  a: {},
  b: {}
};

console.log(doc);
```

### Methods
| Method Name | Params  | Return type | Description                                        |
|-------------|---------|-------------|----------------------------------------------------|
| firstMethod     |      Arg1     | void      | Description should be here.|
