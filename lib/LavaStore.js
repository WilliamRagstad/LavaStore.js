import { LSDocument } from "./LSDocument";
import { LSCollection } from './LSCollection';
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
export { LSDocument, LSCollection };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF2YVN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0xhdmFTdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5QyxNQUFNLFNBQVUsU0FBUSxVQUFVO0lBQzlCLElBQVcsTUFBTSxDQUFDLENBQVk7UUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsSUFBSSxDQUFDLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztJQUM1RixDQUFDO0lBQ0QsWUFBWSxFQUFVLEVBQUUsU0FBaUIsRUFBRSxFQUFFLGNBQXlDLEVBQUU7UUFDcEYsS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjtBQUVELGVBQWUsU0FBUyxDQUFDO0FBR3pCLE9BQU8sRUFFSCxVQUFVLEVBQ1YsWUFBWSxFQUNmLENBQUEifQ==