"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LSDocument = void 0;
const LSCollection_1 = require("./LSCollection");
class LSWrapper {
}
LSWrapper.Save = (label, data) => localStorage.setItem(label, JSON.stringify(data));
LSWrapper.Load = (label) => JSON.parse(localStorage.getItem(label) ?? '');
LSWrapper.Contains = (label) => !!localStorage.getItem(label);
class LSDocument {
    constructor(id, fields = {}, collections = {}) {
        this.fields = {};
        this.id = '';
        this.collections = {};
        this.Collection = (id) => this.collections[id];
        this.Contains = (id) => this.collections[id] !== undefined;
        this.Load = () => {
            if (this.parent)
                throw new Error("Cannot load child document, please load root.");
            if (!LSWrapper.Contains(this.id))
                return;
            const document = LSWrapper.Load(this.id);
            this.fields = document.fields;
            function loadCollections(collections) {
                return Object.entries(collections).reduce((cols, [colkey, col]) => {
                    return {
                        ...cols,
                        [colkey]: new LSCollection_1.LSCollection(colkey, Object.entries(col).reduce((docs, [dockey, doc]) => {
                            return {
                                ...docs,
                                [dockey]: new LSDocument(dockey, doc.fields, loadCollections(doc.collections))
                            };
                        }, {}))
                    };
                }, {});
            }
            this.collections = loadCollections(document.collections);
        };
        this.build = () => {
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
        };
        this.Save = () => {
            if (this.parent)
                this.parent.parent?.Save();
            else
                LSWrapper.Save(this.id, this.build());
        };
        this.Set = (data) => {
            this.fields = { ...data };
            this.Save();
        };
        this.Get = () => this.fields;
        this.GetPath = (path) => this.DocumentPath(path).Get();
        this.pathToArray = (path) => Array.isArray(path) ? path : path.split('/');
        this.PassTo = (callback) => callback(this.fields);
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
    Add(collection) {
        collection.parent = this;
        this.collections[collection.id] = collection;
        this.Save();
    }
    Remove(id) {
        delete this.collections[id];
    }
    InsurePath(path) {
        const arr = Array.isArray(path) ? path : path.split('/');
        if (arr.length === 0)
            throw new Error("Path must have entries. Please follow the format: ([COLLECTION]/[DOCUMENT])+");
        if (arr.length % 2 !== 0)
            throw new Error("Path must follow ([COLLECTION]/[DOCUMENT])+ format! Eg. 'users/Bob/tweets/7GA1J4V'.");
        let prev = new LSDocument(arr[arr.length - 1]);
        for (let i = arr.length - 2; i >= 0; i--) {
            if (prev instanceof LSDocument)
                prev = new LSCollection_1.LSCollection(arr[i], { [prev.id]: prev });
            else if (prev instanceof LSCollection_1.LSCollection)
                prev = new LSDocument(arr[i], undefined, { [prev.id]: prev });
        }
        this.Add(prev);
    }
    SetPath(path, data) {
        this.InsurePath(path);
        this.DocumentPath(path).Set(data);
    }
    pathTraverse(arr, minLen) {
        if (arr.length <= minLen)
            throw new Error(`Path must have more than ${minLen} entries.`);
        let tmp = this;
        for (const node of arr) {
            if (tmp instanceof LSCollection_1.LSCollection) {
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
        if (result !== undefined && !(result instanceof LSCollection_1.LSCollection))
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
}
exports.LSDocument = LSDocument;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTFNEb2N1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9MU0RvY3VtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlEQUE4QztBQUs5QyxNQUFlLFNBQVM7O0FBQ04sY0FBSSxHQUFHLENBQUMsS0FBYSxFQUFFLElBQVMsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0FBQ3RGLGNBQUksR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3hFLGtCQUFRLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBSTlFLE1BQWEsVUFBVTtJQVluQixZQUFZLEVBQVUsRUFBRSxTQUFpQixFQUFFLEVBQUUsY0FBeUMsRUFBRTtRQVhoRixXQUFNLEdBQVcsRUFBRSxDQUFDO1FBQ3JCLE9BQUUsR0FBVyxFQUFFLENBQUM7UUFRaEIsZ0JBQVcsR0FBOEIsRUFBRSxDQUFDO1FBUzVDLGVBQVUsR0FBRyxDQUFDLEVBQVUsRUFBNEIsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUUsYUFBUSxHQUFHLENBQUMsRUFBVSxFQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxLQUFLLFNBQVMsQ0FBQztRQTBCdkUsU0FBSSxHQUFHLEdBQUcsRUFBRTtZQUNmLElBQUksSUFBSSxDQUFDLE1BQU07Z0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1lBQ2xGLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElB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