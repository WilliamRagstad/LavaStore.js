import { LSCollection } from './LSCollection';
class LSWrapper {
}
LSWrapper.Save = (label, data) => localStorage.setItem('lavastore:' + label, JSON.stringify(data));
LSWrapper.Load = (label) => JSON.parse(localStorage.getItem('lavastore:' + label) || '');
LSWrapper.Contains = (label) => !!localStorage.getItem('lavastore:' + label);
export class LSDocument {
    constructor(id, fields = {}, collections = {}) {
        this.fields = {};
        this.id = '';
        this.collections = {};
        this.pathToArray = (path) => Array.isArray(path) ? path : path.split('/');
        this.id = id;
        this.fields = fields;
        this.collections = collections;
        Object.values(this.collections).forEach((collection) => collection.parent = this);
    }
    get parent() {
        return this._parent;
    }
    set parent(value) {
        this._parent = value;
    }
    Collection(id) { return this.collections[id]; }
    Contains(id) { return this.collections[id] !== undefined; }
    Add(collection) {
        collection.parent = this;
        this.collections[collection.id] = collection;
        this.Save();
        return this.collections[collection.id];
    }
    Remove(id) {
        delete this.collections[id];
    }
    InsurePath(path) {
        const pathArray = Array.isArray(path) ? path : (path.includes('/') ? path.split('/') : path.split('\\'));
        if (pathArray.length === 0)
            throw new Error("Path must have entries. Please follow the format: ([COLLECTION]/[DOCUMENT])+");
        if (pathArray.length % 2 !== 0)
            throw new Error("Path must follow ([COLLECTION]/[DOCUMENT])+ format! Eg. 'users/Bob/tweets/7GA1J4V'.");
        let currentNode = this;
        for (const pathNode of pathArray) {
            if (currentNode.Contains(pathNode)) {
                if (currentNode instanceof LSDocument)
                    currentNode = currentNode.Collection(pathNode);
                else if (currentNode instanceof LSCollection)
                    currentNode = currentNode.Document(pathNode);
            }
            else {
                if (currentNode instanceof LSDocument)
                    currentNode = currentNode.Add(new LSCollection(pathNode));
                else if (currentNode instanceof LSCollection)
                    currentNode = currentNode.Add(new LSDocument(pathNode));
            }
        }
        this.Save();
    }
    Load() {
        if (this.parent)
            throw new Error("Cannot load child document, please load root.");
        if (!LSWrapper.Contains(this.id))
            return;
        const document = LSWrapper.Load(this.id);
        this.fields = document.fields;
        function loadCollections(collections) {
            return Object.entries(collections).reduce((collectionValues, [collectionKey, collectionValue]) => {
                return {
                    ...collectionValues,
                    [collectionKey]: new LSCollection(collectionKey, Object.entries(collectionValue).reduce((documentValues, [documentKey, documentValue]) => {
                        return {
                            ...documentValues,
                            [documentKey]: new LSDocument(documentKey, documentValue.fields, loadCollections(documentValue.collections))
                        };
                    }, {}))
                };
            }, {});
        }
        this.collections = loadCollections(document.collections);
        Object.values(this.collections).forEach((collection) => collection.parent = this);
    }
    build() {
        return {
            fields: this.fields,
            collections: Object.values(this.collections).reduce((cols, col) => {
                return {
                    ...cols,
                    [col.id]: Object.values(col.documents).reduce((docs, doc) => {
                        return {
                            ...docs,
                            [doc.id]: doc.build()
                        };
                    }, {})
                };
            }, {})
        };
    }
    Save() {
        if (this.parent) {
            if (this.parent.parent)
                this.parent.parent.Save();
            else
                throw new Error(`Parent collection '${this.parent.id}' must not be root of store. Please append collection to a valid root document.`);
        }
        else
            LSWrapper.Save(this.id, this.build());
    }
    Set(data) {
        this.fields = { ...data };
        this.Save();
    }
    Get() { return this.fields; }
    HasData() { return this.fields !== undefined && this.fields !== {}; }
    SetPath(path, data) {
        this.InsurePath(path);
        this.DocumentPath(path).Set(data);
    }
    GetPath(path) {
        return this.DocumentPath(path).Get();
    }
    pathTraverse(arr, minLen) {
        if (arr.length <= minLen)
            throw new Error(`Path must have more than ${minLen} entries.`);
        let tmp = this;
        for (const node of arr) {
            if (tmp instanceof LSCollection) {
                if (!tmp.Contains(node))
                    console.warn(`Path does not contain document '${node}'!`);
                tmp = tmp.Document(node);
            }
            else if (tmp instanceof LSDocument) {
                if (!this.Contains(node))
                    console.warn(`Path does not contain collection '${node}'!`);
                tmp = tmp.Collection(node);
            }
        }
        return tmp;
    }
    CollectionPath(path) {
        const arr = this.pathToArray(path);
        if (arr.length % 2 !== 1)
            throw new Error("Path must follow [COLLECTION]/([DOCUMENT]/[COLLECTION])* format! Eg. 'users/Bob/tweets'.");
        const result = this.pathTraverse(arr, 1);
        if (result !== undefined && !(result instanceof LSCollection))
            throw new Error("Failed unexpectedly, return value was not of type LSCollection!");
        return result;
    }
    DocumentPath(path) {
        const arr = this.pathToArray(path);
        if (arr.length % 2 !== 0)
            throw new Error("Path must follow ([COLLECTION]/[DOCUMENT])+ format! Eg. 'users/Bob/tweets/7GA1J4V'.");
        const result = this.pathTraverse(arr, 0);
        if (result !== undefined && !(result instanceof LSDocument))
            throw new Error("Failed unexpectedly, return value was not of type LSDocument!");
        return result;
    }
    PassTo(callback) { callback(this.fields); }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTFNEb2N1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9MU0RvY3VtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUs5QyxNQUFlLFNBQVM7O0FBQ04sY0FBSSxHQUFHLENBQUMsS0FBYSxFQUFFLElBQVMsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtBQUNyRyxjQUFJLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDdkYsa0JBQVEsR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBSTdGLE1BQU0sT0FBTyxVQUFVO0lBWW5CLFlBQVksRUFBVSxFQUFFLFNBQWlCLEVBQUUsRUFBRSxjQUF5QyxFQUFFO1FBWGhGLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFDckIsT0FBRSxHQUFXLEVBQUUsQ0FBQztRQVFoQixnQkFBVyxHQUE4QixFQUFFLENBQUM7UUFxSDNDLGdCQUFXLEdBQUcsQ0FBQyxJQUF1QixFQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFFLElBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFsSGxILElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFdB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