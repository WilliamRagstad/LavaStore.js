import { LSDocument } from "./LSDocument";
import { LSCollection } from './LSCollection';
import LSHelpers from './LSHelpers';
class LavaStore extends LSDocument {
    set parent(p) {
        throw new Error(`Cannot add LavaStore Document '${this.id}' as child to a Collection!`);
    }
    constructor(id, fields = {}, collections = {}) {
        super(id, fields, collections);
        this.Load();
    }
}
export default LavaStore;
export { LSDocument, LSCollection, LSHelpers };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF2YVN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0xhdmFTdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLFNBQVMsTUFBTSxhQUFhLENBQUM7QUFFcEMsTUFBTSxTQUFVLFNBQVEsVUFBVTtJQUM5QixJQUFXLE1BQU0sQ0FBQyxDQUFZO1FBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLElBQUksQ0FBQyxFQUFFLDZCQUE2QixDQUFDLENBQUM7SUFDNUYsQ0FBQztJQUNELFlBQVksRUFBVSxFQUFFLFNBQWlCLEVBQUUsRUFBRSxjQUF5QyxFQUFFO1FBQ3BGLEtBQUssQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUFFRCxlQUFlLFNBQVMsQ0FBQztBQUd6QixPQUFPLEVBRUgsVUFBVSxFQUNWLFlBQVksRUFDWixTQUFTLEVBQ1osQ0FBQSJ9