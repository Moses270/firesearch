import { ObjectMap, FireSearchConfig, FireSearchDocument } from '../models/interface';
import { FireSearchIndexService } from './index.service';
import { collectionToDocumentName, collectionToFireSearchPath, firesearchBaseCollection } from './action.service';

import lSet = require('lodash.set');
import lGet = require('lodash.get');
import cloneDeep = require('lodash.clonedeep');

export class DocumentChangeHandler {
    private firestore: FirebaseFirestore.Firestore;
    private config: FireSearchConfig;
    private destinationDocName: string;
    private indexService: FireSearchIndexService;

    constructor(firestore: FirebaseFirestore.Firestore, config: FireSearchConfig) {
        this.firestore = firestore;
        this.config = config;
        this.destinationDocName = collectionToFireSearchPath(config.collectionName);
        this.indexService = new FireSearchIndexService();

        // updates parent doc
        this.updateParentDocument();
    }

    private updateParentDocument(): void {
        const doc: ObjectMap<any> = cloneDeep(this.config);
        doc.id = collectionToDocumentName(this.config.collectionName);

        this.firestore.doc(`${firesearchBaseCollection}/${doc.id}`).set(doc).catch();
    }

    public onUpsert(doc: ObjectMap<any>, docId: string): Promise<void> {
        return new Promise((resolve) => {
            const state: ObjectMap<any> = {id: docId};

            if (this.config.resultantProperties?.length > 0) {
                this.config.resultantProperties.forEach(k => {
                    const val = lGet(doc, k) || null;
                    lSet(state, k, val);
                });
            }

            const update: FireSearchDocument = {
                id: docId,
                state,
                index: this.indexService.createSearchIndexes(doc, this.config)
            };

            this.firestore.doc(`${this.destinationDocName}/${docId}`).set(update).catch();
            resolve();
        });
    }

    public async onDelete(docId: string): Promise<void> {
        return this.firestore.doc(`${this.destinationDocName}/${docId}`).delete().then();
    }
}
