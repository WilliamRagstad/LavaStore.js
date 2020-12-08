import { LSDocument } from "./LSDocument";
import { IDictionary } from './IDictionary';
import { LSCollection } from './LSCollection';
declare class LavaStore extends LSDocument {
    set parent(p: undefined);
    constructor(id: string, fields?: object, collections?: IDictionary<LSCollection>);
}
export default LavaStore;
export { IDictionary, LSDocument, LSCollection };
