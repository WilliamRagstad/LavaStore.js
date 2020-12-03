abstract class LocalStorageWrapper {
    private static serialize = (data: any) => JSON.stringify(data);
    private static deserialize = (json: string) => JSON.parse(json);
    public static Save = (label: string, data: any) => localStorage.setItem(label, LocalStorageWrapper.serialize(data))
    public static Load = (label: string) => LocalStorageWrapper.deserialize(localStorage.getItem(label));
    public static Contains = (label: string) => !!localStorage.getItem(label);
}

export class StorageDocument {
    private fields: object = {};
    public id: string = '';
    public parent: StorageCollection;
    public collections: object = {};

    constructor(id: string, fields?: object, collections: object = {}) {
        this.id = id;
        this.fields = fields;
        this.collections = collections;
        Object.values(this.collections).forEach((val: StorageCollection) => val.parent = this);
    }

    public Collection = (id: string): StorageCollection => this.collections[id];
    public Contains = (id: string): boolean => this.collections[id] !== undefined;
    public Add(collection: StorageCollection) {
        collection.parent = this;
        this.collections[collection.id] = collection;
        this.Save();
    }
    public Remove(id: string) {
        delete this.collections[id];
    }
    /**
     * Insure that the path exists. If not, create all collections and documents specified.
     * @param path the path to insure
     */
    public InsurePath(path: string | string[]) {
        const arr = Array.isArray(path) ? path : (path as string).split('/');
        if (arr.length === 0) throw new Error("Path must have entries. Please follow the format: ([COLLECTION]/[DOCUMENT])+");
        if (arr.length % 2 !== 0) throw new Error("Path must follow ([COLLECTION]/[DOCUMENT])+ format! Eg. 'users/Bob/tweets/7GA1J4V'.");

        let prev: StorageDocument | StorageCollection = new StorageDocument(arr[arr.length - 1]);
        for (let i = arr.length - 2; i >= 0; i--) {
            if (prev instanceof StorageDocument) prev = new StorageCollection(arr[i], { [prev.id]: prev });
            else if (prev instanceof StorageCollection) prev = new StorageDocument(arr[i], null, { [prev.id]: prev });
        }
        this.Add(prev as StorageCollection);
    }

    public Load = () => {
        if (this.parent) throw new Error("Cannot load child document, please load root.");
        if (!LocalStorageWrapper.Contains(this.id)) return;
        let document = LocalStorageWrapper.Load(this.id);
        this.fields = document.fields;

        function loadCollections(collections: object): StorageCollection[] {
            return Object.entries(collections).reduce((cols: any, [key, col]: [string, StorageCollection]) => {
                return {
                    ...cols,
                    [key]: new StorageCollection(key, Object.entries(col).reduce((docs: any, [key, doc]: [string, any]) => {
                        return {
                            ...docs,
                            [key]: new StorageDocument(key, doc.fields, loadCollections(doc.collections))
                        }
                    }, {}))
                }
            }, {});
        }
        this.collections = loadCollections(document.collections);
    }

    private build = () => {
        return {
            fields: this.fields,
            collections: Object.values(this.collections).reduce((cols, col: StorageCollection) => {
                return {
                    ...cols,
                    [col.id]: Object.values(col.documents).reduce((docs, doc: StorageDocument) => {
                        return {
                            ...docs,
                            [doc.id]: doc.build()
                        }
                    }, {})
                }
            }, {})
        }
    }

    public Save = () => {
        if (this.parent) this.parent.parent.Save();
        else LocalStorageWrapper.Save(this.id, this.build()); // This is root, store all containing data in one big object.
    }
    public Set = (data: object) => {
        this.fields = { ...data };
        this.Save();
    }
    public Get = () => this.fields;

    /**
     * Set data of a nested document. Path is insured before data is set.
     * @param path path to document. Must follow ([COLLECTION]/[DOCUMENT])+ format! Eg. 'users/Bob/tweets/7GA1J4V'. Path can also be array like ['users', 'Bob', 'tweets', '7GA1J4V'].
     * @param data data to set document fields to
     */
    public SetPath(path: string | string[], data: object) {
        this.InsurePath(path);
        this.DocumentPath(path).Set(data);
    }
    /**
     * Get data from a nested document
     * @param path path to document. Must follow ([COLLECTION]/[DOCUMENT])+ format! Eg. 'users/Bob/tweets/7GA1J4V'. Path can also be array like ['users', 'Bob', 'tweets', '7GA1J4V'].
     */
    public GetPath = (path: string | string[]): object => this.DocumentPath(path).Get();

    /* Path helper functions */
    private pathToArray = (path: string | string[]): string[] => Array.isArray(path) ? path : (path as string).split('/');
    private pathTraverse(arr: string[], minLen: number) {
        if (arr.length <= minLen) throw new Error(`Path must have more than ${minLen} entries.`);
        let tmp: StorageDocument | StorageCollection = this;
        for (let i = 0; i < arr.length; i++) {
            if (tmp instanceof StorageCollection) {
                if (!tmp.Contains(arr[i])) console.warn(`Path does not contain document '${arr[i]}'!`);
                tmp = tmp.Document(arr[i]);
            }
            else if (tmp instanceof StorageDocument) {
                if (!this.Contains(arr[i])) console.warn(`Path does not contain collection '${arr[i]}'!`);
                tmp = tmp.Collection(arr[i]);
            }
        }
        return tmp;
    }

    /**
     * Return a nested collection
     * @param path path to collection. Must follow [COLLECTION]/([DOCUMENT]/[COLLECTION])* format! Eg. 'users/Bob/tweets'. Path can also be array like ['users', 'Bob', 'tweets'].
     */
    public CollectionPath(path: string | string[]): StorageCollection {
        const arr = this.pathToArray(path);
        if (arr.length % 2 !== 1) throw new Error("Path must follow [COLLECTION]/([DOCUMENT]/[COLLECTION])* format! Eg. 'users/Bob/tweets'.");
        const result = this.pathTraverse(arr, 1);
        if (result !== undefined && !(result instanceof StorageCollection)) throw new Error("Failed unexpectedly, return value was not of type StorageCollection!");
        return result as StorageCollection;
    }
    /**
     * Returns a document nested in collections
     * @param path path to document. Must follow ([COLLECTION]/[DOCUMENT])+ format! Eg. 'users/Bob/tweets/7GA1J4V'. Path can also be array like ['users', 'Bob', 'tweets', '7GA1J4V'].
     */
    public DocumentPath(path: string | string[]): StorageDocument {
        const arr = this.pathToArray(path);
        if (arr.length % 2 !== 0) throw new Error("Path must follow ([COLLECTION]/[DOCUMENT])+ format! Eg. 'users/Bob/tweets/7GA1J4V'.");
        const result = this.pathTraverse(arr, 0);
        if (result !== undefined && !(result instanceof StorageDocument)) throw new Error("Failed unexpectedly, return value was not of type StorageDocument!");
        return result as StorageDocument;
    }
    public PassTo = (callback: ((data: object) => any)) => callback(this.fields);
}

export class StorageCollection {
    public id: string;
    public parent: StorageDocument;
    public documents: object = {};

    constructor(id: string, documents: object = {}) {
        this.id = id;
        this.documents = documents;
        Object.values(this.documents).forEach((val: StorageDocument) => val.parent = this);
    }

    public Contains = (id: string): boolean => this.documents[id] !== undefined;
    public Document = (id: string): StorageDocument => this.documents[id];
    public Add(doc: StorageDocument) {
        doc.parent = this;
        this.documents[doc.id] = doc;
        if (this.parent) this.parent.Save();
    }
    public Remove(id: string) {
        delete this.documents[id];
    }
}