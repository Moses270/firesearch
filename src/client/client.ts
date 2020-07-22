import { collectionToFireSearchPath, transformCollection } from '../setup/action.service';
import { FireSearchDocument, ObjectMap } from '../models';

export interface FireSearchClientConfig {
    collectionName: string;
    caseSensitive?: boolean;
}

export class FireSearchClient {
    private config: FireSearchClientConfig;
    private firestore: FirebaseFirestore.Firestore;

    constructor(cfg: FireSearchClientConfig, firestore: FirebaseFirestore.Firestore) {
        this.firestore = firestore;
        this.config = Object.assign({}, {
            caseSensitive: false
        }, cfg);
    }

    private isValidSearchText(text: string): boolean {
        const invalid = !text || text.startsWith('.') || text.endsWith('.') || text.indexOf('..') >= 0;

        return !invalid;
    }

    public search<T>(text: string, limit: number = 50): Promise<T[]> {
        return new Promise((resolve) => {
            if (!this.isValidSearchText(text)) {
                text = '';
            }

            if (!this.config.caseSensitive) {
                text = text.toLowerCase();
            }

            this.firestore.collection(collectionToFireSearchPath(this.config.collectionName))
                .where(`index.${text}`, '==', true).limit(limit).get()
                .then(transformCollection).then((docs: FireSearchDocument[]) => {
                    if (docs?.length > 0) {
                        resolve(docs.map(d => {
                            const doc: ObjectMap<any> = d.state;
                            doc.id = d.id;

                            return doc;
                        }) as T[]);
                    } else {
                        resolve([] as T[]);
                    }
                });
        });
    }
}
