import { ObjectMap } from '../models';

export const firesearchBaseCollection = '__firesearch_';

export const collectionToDocumentName = (col: string): string => {
    if (col.startsWith('/')) {
        col = col.substr(1);
    }

    if (col.endsWith('/')) {
        col = col.substr(0, col.length - 1);
    }

    return col.replace(new RegExp('/', 'g'), '_');
}

export const collectionToFireSearchPath = (col: string): string => {
    return `${firesearchBaseCollection}/${collectionToDocumentName(col)}/indexes`;
}

export const transformDoc = (snapshot: any): ObjectMap<any> => {
    const data: ObjectMap<any> = snapshot.data();

    if (data) {
        data.id = snapshot.id;
    }

    return data;
}

export const transformCollection = (snapshots: any): ObjectMap<any>[] => {
    const results: any[] = [];
    snapshots.forEach((snap: any) => results.push(transformDoc(snap)));

    return results;
}
