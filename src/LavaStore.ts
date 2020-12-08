import { LSDocument } from "./LSDocument";
import { IDictionary } from './IDictionary';
import { LSCollection } from './LSCollection';

class LavaStore extends LSDocument {
    public set parent(p: undefined) {
        throw new Error(`Cannot add LavaStore Document '${this.id}' as child to a Collection!`);
    }
    constructor(id: string, fields: object = {}, collections: IDictionary<LSCollection> = {}) {
        super(id, fields, collections);
        this.Load(); // Load cached data from localstorage
    }
}

export default LavaStore;

// Export all other types
export {
    IDictionary,
    LSDocument,
    LSCollection
}