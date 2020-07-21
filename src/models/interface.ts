export interface ObjectMap<T> {
    [key: string]: T;
}

export interface FireSearchConfig {
    collectionName: string;    
    indexProperties: string[];
    resultantProperties?: string[];
    caseSensitive?: boolean;
}

export interface FireSearchDocument {
    id: string; // same as document key/id
    index: ObjectMap<true>;
    state: ObjectMap<any>;
}
