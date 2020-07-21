import functions = require('firebase-functions');
import { FireSearchConfig } from '../models/interface';
import { DocumentChangeHandler } from './changes';

export class FireSearch {
    private firestore: FirebaseFirestore.Firestore;
    private config: FireSearchConfig;
    private changeHander: DocumentChangeHandler;

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
    }

    /**
     * Handles update search indexes whenever document write operations (create, update, delete) occurs
     * @param snap 
     * @param ctx 
     */
    public handler(snap: functions.Change<functions.firestore.DocumentSnapshot>, _ctx: functions.EventContext): Promise<void> {
        const before = snap.before.data();
        const after = snap.after.data();

        if (after) {
            // document upserted (created or updated)
            return this.changeHander.onUpsert(after, snap.after.id);
        } else if (before) {
            // document deleted
            return this.changeHander.onDelete(snap.before.id);
        } else {
            return Promise.resolve();
        }
    }
}
