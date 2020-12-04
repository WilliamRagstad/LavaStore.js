"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LSDocument = void 0;
const LSCollection_1 = require("./LSCollection");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTFNEb2N1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9MU0RvY3VtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlEQUE4QztBQUU5QyxNQUFhLFVBQVU7SUFZbkIsWUFBWSxFQUFVLEVBQUUsU0FBaUIsRUFBRSxFQUFFLGNBQXlDLEVBQUU7UUFYaEYsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUNyQixPQUFFLEdBQVcsRUFBRSxDQUFDO1FBUWhCLGdCQUFXLEdBQThCLEVBQUUsQ0FBQztRQVM1QyxlQUFVLEdBQUcsQ0FBQyxFQUFVLEVBQTRCLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzVFLGFBQVEsR0FBRyxDQUFDLEVBQVUsRUFBVyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsS0FBSyxTQUFTLENBQUM7UUEwQnZFLFNBQUksR0FBRyxHQUFHLEVBQUU7WUFDZixJQUFJLElBQUksQ0FBQyxNQUFNO2dCQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztZQUNsRixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO2dCQUFFLE9BQU87WUFDekMsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBRTlCLFNBQVMsZUFBZSxDQUFDLFdBQW1CO2dCQUN4QyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBUyxFQUFFLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBeUIsRUFBRSxFQUFFO29CQUMzRixPQUFPO3dCQUNILEdBQUcsSUFBSTt3QkFDUCxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUks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