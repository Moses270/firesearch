import functions = require('firebase-functions');
import { FireSearchConfig } from '../models/interface';
import { DocumentChangeHandler } from './changes';
import { FireSearchClient } from '../client';

export class FireSearch {
    private firestore: FirebaseFirestore.Firestore;
    private config: FireSearchConfig;
    private changeHander: DocumentChangeHandler;
    private client: FireSearchClient;

    constructor(firestore: FirebaseFirestore.Firestore, config: FireSearchConfig) {
        if (config.indexProperties.length === 0) {
            throw Error('indexProperties cannot be empty!');
        }

        this.firestore = firestore;
        this.config = Object.assign({}, {
            maxCharsPerWord: 20,
            maxWords: 10,
            caseSensitive: false
        }, config);

        this.changeHander = new DocumentChangeHandler(this.firestore, this.config);
        this.client = new FireSearchClient({
            collectionName: this.config.collectionName,
            caseSensitive: this.config.caseSensitive
        }, this.firestore);
    }

    /**
     * Handles update search indexes whenever document write operations (create, update, delete) occurs
     * @param snapshot 
     * @param ctx 
     */
    public onWrite(snapshot: functions.Change<functions.firestore.DocumentSnapshot>, _ctx?: functions.EventContext): Promise<void> {
        const before = snapshot.before.data();
        const after = snapshot.after.data();

        if (after) {
            // document upserted (created or updated)
            return this.changeHander.onUpsert(after, snapshot.after.id);
        } else if (before) {
            // document deleted
            return this.changeHander.onDelete(snapshot.before.id);
        } else {
            return Promise.resolve();
        }
    }

    public search<T>(text: string): Promise<T[]> {
        return this.client.search(text);
    }
}
