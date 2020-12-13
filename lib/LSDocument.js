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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTFNEb2N1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9MU0RvY3VtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUs5QyxNQUFlLFNBQVM7O0FBQ04sY0FBSSxHQUFHLENBQUMsS0FBYSxFQUFFLElBQVMsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtBQUNyRyxjQUFJLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDdkYsa0JBQVEsR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyxDQUFDO0FBSTdGLE1BQU0sT0FBTyxVQUFVO0lBWW5CLFlBQVksRUFBVSxFQUFFLFNBQWlCLEVBQUUsRUFBRSxjQUF5QyxFQUFFO1FBWGhGLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFDckIsT0FBRSxHQUFXLEVBQUUsQ0FBQztRQVFoQixnQkFBVyxHQUE4QixFQUFFLENBQUM7UUFvSDNDLGdCQUFXLEdBQUcsQ0FBQyxJQUF1QixFQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFFLElBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFqSGxILElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBaUIsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBYkQsSUFBVyxNQUFNO1FBQ2IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxJQUFXLE1BQU0sQ0FBQyxLQUErQjtRQUM3QyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztJQUN6QixDQUFDO0lBVU0sVUFBVSxDQUFDLEVBQVUsSUFBOEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRixRQUFRLENBQUMsRUFBVSxJQUFhLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzVFLEdBQUcsQ0FBQyxVQUF3QjtRQUMvQixVQUFVLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDN0MsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1osT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBQ00sTUFBTSxDQUFDLEVBQVU7UUFDcEIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFLTSxVQUFVLENBQUMsSUFBdUI7UUFDckMsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFFLElBQWUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFFLElBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFFLElBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3SSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEVBQThFLENBQUMsQ0FBQztRQUM1SCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHFGQUFxRixDQUFDLENBQUM7UUFFdkksSUFBSSxXQUFXLEdBQThCLElBQUksQ0FBQztRQUNsRCxLQUFLLE1BQU0sUUFBUSxJQUFJLFNBQVMsRUFBRTtZQUM5QixJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBRWhDLElBQUksV0FBVyxZQUFZLFVBQVU7b0JBQUUsV0FBVyxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFpQixDQUFDO3FCQUNqRyxJQUFJLFdBQVcsWUFBWSxZQUFZO29CQUFFLFdBQVcsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBZSxDQUFDO2FBQzVHO2lCQUNJO2dCQUVELElBQUksV0FBVyxZQUFZLFVBQVU7b0JBQUUsV0FBVyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztxQkFDNUYsSUFBSSxXQUFXLFlBQVksWUFBWTtvQkFBRSxXQUFXLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2FBQ3pHO1NBQ0o7UUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVNLElBQUk7UUFDUCxJQUFJLElBQUksQ0FBQyxNQUFNO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFBRSxPQUFPO1FBQ3pDLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUU5QixTQUFTLGVBQWUsQ0FBQyxXQUFtQjtZQUN4QyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsZ0JBQXFCLEVBQUUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUF5QixFQUFFLEVBQUU7Z0JBQzFILE9BQU87b0JBQ0gsR0FBRyxnQkFBZ0I7b0JBQ25CLENBQUMsYUFBYSxDQUFDLEVBQUUsSUFBSSxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBbUIsRUFBRSxDQUFDLFdBQVcsRUFBRSxhQUFhLENBQWdCLEVBQUUsRUFBRTt3QkFDekosT0FBTzs0QkFDSCxHQUFHLGNBQWM7NEJBQ2pCLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxVQUFVLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQzt5QkFDL0csQ0FBQTtvQkFDTCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7aUJBQ1YsQ0FBQTtZQUNMLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNYLENBQUM7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVPLEtBQUs7UUFDVCxPQUFPO1lBQ0gsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLFdBQVcsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBaUIsRUFBRSxFQUFFO2dCQUM1RSxPQUFPO29CQUNILEdBQUcsSUFBSTtvQkFDUCxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBZSxFQUFFLEVBQUU7d0JBQ3BFLE9BQU87NEJBQ0gsR0FBRyxJQUFJOzRCQUNQLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUU7eUJBQ3hCLENBQUE7b0JBQ0wsQ0FBQyxFQUFFLEVBQUUsQ0FBQztpQkFDVCxDQUFBO1lBQ0wsQ0FBQyxFQUFFLEVBQUUsQ0FBQztTQUNULENBQUE7SUFDTCxDQUFDO0lBRU0sSUFBSTtRQUNQLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNO2dCQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDOztnQkFDN0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLGlGQUFpRixDQUFDLENBQUM7U0FDL0k7O1lBQ0ksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFDTSxHQUFHLENBQUMsSUFBWTtRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxJQUFJLEVBQUUsQ0FBQztRQUMxQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUNNLEdBQUcsS0FBSyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzdCLE9BQU8sS0FBSyxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztJQU9yRSxPQUFPLENBQUMsSUFBdUIsRUFBRSxJQUFZO1FBQ2hELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUtNLE9BQU8sQ0FBQyxJQUF1QjtRQUNsQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQUlPLFlBQVksQ0FBQyxHQUFhLEVBQUUsTUFBYztRQUM5QyxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksTUFBTTtZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLE1BQU0sV0FBVyxDQUFDLENBQUM7UUFDekYsSUFBSSxHQUFHLEdBQTBDLElBQUksQ0FBQztRQUN0RCxLQUFLLE1BQU0sSUFBSSxJQUFJLEdBQUcsRUFBRTtZQUNwQixJQUFJLEdBQUcsWUFBWSxZQUFZLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxJQUFJLElBQUksQ0FBQyxDQUFDO2dCQUNuRixHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM1QjtpQkFDSSxJQUFJLEdBQUcsWUFBWSxVQUFVLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztvQkFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxJQUFJLElBQUksQ0FBQyxDQUFDO2dCQUN0RixHQUFHLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM5QjtTQUNKO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBTU0sY0FBYyxDQUFDLElBQXVCO1FBQ3pDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywwRkFBMEYsQ0FBQyxDQUFDO1FBQ3RJLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLElBQUksTUFBTSxLQUFLLFNBQVMsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLFlBQVksQ0FBQztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsaUVBQWlFLENBQUMsQ0FBQztRQUNsSixPQUFPLE1BQXNCLENBQUM7SUFDbEMsQ0FBQztJQUtNLFlBQVksQ0FBQyxJQUF1QjtRQUN2QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLElBQUksR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMscUZBQXFGLENBQUMsQ0FBQztRQUNqSSxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6QyxJQUFJLE1BQU0sS0FBSyxTQUFTLElBQUksQ0FBQyxDQUFDLE1BQU0sWUFBWSxVQUFVLENBQUM7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLCtEQUErRCxDQUFDLENBQUM7UUFDOUksT0FBTyxNQUFvQixDQUFDO0lBQ2hDLENBQUM7SUFDTSxNQUFNLENBQUMsUUFBaUMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUM5RSJ9