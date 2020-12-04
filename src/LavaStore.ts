import { LSDocument } from "./LSDocument";

export class LavaStore extends LSDocument {
    public set parent(p: undefined) {
        throw new Error(`Cannot add LavaStore Document '${this.id}' as child to a Collection!`);
    }
}