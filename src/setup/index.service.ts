import { ObjectMap, FireSearchConfig } from '../models';

export class FireSearchIndexService {
    constructor() { }

    /**
     * Generates dynamic token keys for search indexing values like array elements at each position
     * @param prop 
     * @param index 
     * @param props 
     * @param scan 
     * @param generatedValues 
     */
    private getDynamicTokens(prop: string, index: number, props: string[], scan: any, generatedValues: any[]) {
        if (prop) {
            if (prop.indexOf('{') >= 0) {
                Object.keys(scan).forEach(key => {
                    this.getDynamicTokens(props[index + 1], index + 1, props, scan[key], generatedValues);
                });
            } else {
                this.getDynamicTokens(props[index + 1], index + 1, props, scan[prop] || {}, generatedValues);
            }
        } else if (typeof scan === 'string') {
            generatedValues.push(scan);
        }
    }

    private getTokenValues(data: any, property: string): string[] {
        if (property.indexOf('{') >= 0) {
            const generatedValues = [];

            const props = property.split('.');
            this.getDynamicTokens(props[0], 0, props, Object.assign(data), generatedValues);
            return generatedValues;
        } else {
            let values: string = property.split('.').reduce((accumulator, currentProperty) => {
                return accumulator[currentProperty] || {};
            }, data) || '';

            values = values.toString();

            if (typeof values === 'string') {
                return values.includes(' ') ? [values].concat(values.split(' ')) : [values];
            } else {
                return [];
            }
        }
    }

    public createSearchIndexes(data: ObjectMap<any>, opt: FireSearchConfig): ObjectMap<true> {
        const index: ObjectMap<true> = {};

        if (data) {
            const properties = opt.indexProperties;

            properties.forEach((property) => {
                this.getTokenValues(data, property).forEach((res: string) => {
                    try {
                        if (!opt.caseSensitive) {
                            res = res.toLowerCase();
                        }

                        const tokens = res.split('');
                        let searchSpace = '';

                        for (const token of tokens) {
                            searchSpace += token;

                            const invalid = searchSpace.startsWith('.') || searchSpace.endsWith('.') || searchSpace.indexOf('..') >= 0;
                            if (invalid) {
                                break;
                            } else {
                                index[searchSpace] = true;
                            }
                        }
                    } catch (e) { }
                });
            });
        }

        return index;
    }
}
