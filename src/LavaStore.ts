import { LSDocument } from "./LSDocument";
import { IDictionary } from './IDictionary';
import { LSCollection } from './LSCollection';

export class LavaStore extends LSDocument {
    public set parent(p: undefined) {
        throw new Error(`Cannot add LavaStore Document '${this.id}' as child to a Collection!`);
    }
}

// Export all other types
export type {
    IDictionary,
    LSDocument,
    LSCollection
}