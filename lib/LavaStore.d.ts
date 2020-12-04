import { LSDocument } from "./LSDocument";
import { IDictionary } from './IDictionary';
import { LSCollection } from './LSCollection';
export declare class LavaStore extends LSDocument {
    set parent(p: undefined);
    constructor(id: string, fields?: object, collections?: IDictionary<LSCollection>);
}
export { IDictionary, LSDocument, LSCollection };
