export const collectionToDocumentName = (col: string): string => {
    if (col.startsWith('/')) {
        col = col.substr(1);
    }

    if (col.endsWith('/')) {
        col = col.substr(0, col.length - 1);
    }

    return col.replace(new RegExp('/', 'g'), '_');
}
