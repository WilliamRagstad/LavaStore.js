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
        Object.values(this.collections).forEach((val) => val.parent = this);
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
        for (let i = 0; i < pathArray.length; i++) {
            const pathNode = pathArray[i];
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