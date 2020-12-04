"use strict";
System.register("IDictionary", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("LSDocument", ["LSCollection"], function (exports_2, context_2) {
    "use strict";
    var LSCollection_1, LSDocument;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (LSCollection_1_1) {
                LSCollection_1 = LSCollection_1_1;
            }
        ],
        execute: function () {
            LSDocument = class LSDocument {
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
            };
            exports_2("LSDocument", LSDocument);
        }
    };
});
System.register("LavaStore", ["LSDocument"], function (exports_3, context_3) {
    "use strict";
    var LSDocument_1, LavaStore;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (LSDocument_1_1) {
                LSDocument_1 = LSDocument_1_1;
            }
        ],
        execute: function () {
            LavaStore = class LavaStore extends LSDocument_1.LSDocument {
                set parent(p) {
                    throw new Error(`Cannot add LavaStore Document '${this.id}' as child to a Collection!`);
                }
            };
            exports_3("LavaStore", LavaStore);
        }
    };
});
System.register("LSCollection", [], function (exports_4, context_4) {
    "use strict";
    var LSCollection;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
            LSCollection = class LSCollection {
                constructor(id, documents = {}) {
                    this.documents = {};
                    this.Contains = (id) => this.documents[id] !== undefined;
                    this.Document = (id) => this.documents[id];
                    this.id = id;
                    this.documents = documents;
                    Object.values(this.documents).forEach((val) => val.parent = this);
                }
                Add(doc) {
                    doc.parent = this;
                    this.documents[doc.id] = doc;
                    if (this.parent)
                        this.parent.Save();
                }
                Remove(id) {
                    delete this.documents[id];
                }
            };
            exports_4("LSCollection", LSCollection);
        }
    };
});
class LSWrapper {
}
LSWrapper.serialize = (data) => JSON.stringify(data);
LSWrapper.deserialize = (json) => JSON.parse(json);
LSWrapper.Save = (label, data) => localStorage.setItem(label, LSWrapper.serialize(data));
LSWrapper.Load = (label) => LSWrapper.deserialize(localStorage.getItem(label) ?? '');
LSWrapper.Contains = (label) => !!localStorage.getItem(label);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF2YVN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0xTV3JhcHBlci50cyIsIi4uL3NyYy9JRGljdGlvbmFyeS50cyIsIi4uL3NyYy9MU0RvY3VtZW50LnRzIiwiLi4vc3JjL0xhdmFTdG9yZS50cyIsIi4uL3NyYy9MU0NvbGxlY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lFR0EsYUFBQSxNQUFhLFVBQVU7Z0JBWW5CLFlBQVksRUFBVSxFQUFFLFNBQWlCLEVBQUUsRUFBRSxjQUF5QyxFQUFFO29CQVhoRixXQUFNLEdBQVcsRUFBRSxDQUFDO29CQUNyQixPQUFFLEdBQVcsRUFBRSxDQUFDO29CQVFoQixnQkFBVyxHQUE4QixFQUFFLENBQUM7b0JBUzVDLGVBQVUsR0FBRyxDQUFDLEVBQVUsRUFBNEIsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQzVFLGFBQVEsR0FBRyxDQUFDLEVBQVUsRUFBVyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsS0FBSyxTQUFTLENBQUM7b0JBMEJ2RSxTQUFJLEdBQUcsR0FBRyxFQUFFO3dCQUNmLElBQUksSUFBSSxDQUFDLE1BQU07NEJBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO3dCQUNsRixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDOzRCQUFFLE9BQU87d0JBQ3pDLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBRTlCLFNBQVMsZUFBZSxDQUFDLFdBQW1COzRCQUN4QyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxD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