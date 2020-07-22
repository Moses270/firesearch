# FireSearch

FireSearch is a JavaScript package built to easily support text searches in firestore database. Built by [EmbyBest Concept](https://embyconcept.com) to assist firebase/firestore developers to search through their data content stored in firestore. It is tested with Node.js and can easily be adapted to other JavaScript-based environments as well.

## Installation
Install FireSearch via npm by running the following command: 
> `npm install firesearch --save`

## Usage
Create an instance of FireSearch and call available methods from the instance created.

 ```typescript
import * as fns from 'firebase-functions';
import * as admin from 'firebase-admin';
import { FireSearch, FireSearchConfig } from 'firesearch';

type Snap = functions.Change<functions.firestore.DocumentSnapshot>;

// init firebase admin
admin.initializeApp();

// setup firesearch
const config: FireSearchConfig = {
  collectionName: '<COLLECTION_NAME>',
  indexProperties: ['firstName', 'lastName', 'profile.address'],
  resultantProperties: ['firstName', 'lastName', 'photo', 'profile.age']
};

const fireSearch = new FireSearch(admin.firestore(), config);

// handle sync indexes whenever document changes in collection
functions.firestore.document('<COLLECTION_NAME>/{docId}').onWrite((snap, ctx) => {
    return fireSearch.onWrite(snap, ctx);
});
```

### Search
To search with admin SDK, simply call the search method of the FireSearch instance created earlier. Example:
```typescript
fireSearch.search('SEARCH_TEXT', 20).then(results => {
  console.log(results);
});
```

To search client side, `package is coming soon`.

### Methods
| Method Name | Params  | Return type | Description                                        |
|-------------|---------|-------------|----------------------------------------------------|
| `onWrite`     | snapshot: Snap, context?: any | Promise<void>      | Handles the syncing of document changes (create, update and delete) in specified collection with FireSearch indexes.|
| `search<T>`     | text: string, limit?: number | Promise<T[]>      | Searches through created indexes for matches and returns the specified `resultantProperties` of the each document.|

### NB:
This package is an easy go-to solution to support simple text search queries in a typical firestore database. Following are some noted limitations of firesearch:
1. Does not support sorting, ordering in firestore queries
2. Only supports indexing of JavaScript values that can easily be converted to string. Examples, Date.toString(), Number.toString() etc
3. Search indexes are created and stored in the hosting/parent firestore database in the root collection, `__firesearch_`. Hence, resource usage, and billing are handled by the host.
