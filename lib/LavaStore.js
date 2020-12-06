import { LSDocument } from "./LSDocument";
import { LSCollection } from './LSCollection';
export class LavaStore extends LSDocument {
    set parent(p) {
        throw new Error(`Cannot add LavaStore Document '${this.id}' as child to a Collection!`);
    }
    constructor(id, fields = {}, collections = {}) {
        super(id, fields, collections);
        this.Load();
    }
}
export { LSDocument, LSCollection };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF2YVN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0xhdmFTdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRTFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5QyxNQUFNLE9BQU8sU0FBVSxTQUFRLFVBQVU7SUFDckMsSUFBVyxNQUFNLENBQUMsQ0FBWTtRQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxJQUFJLENBQUMsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFDRCxZQUFZLEVBQVUsRUFBRSxTQUFpQixFQUFFLEVBQUUsY0FBeUMsRUFBRTtRQUNwRixLQUFLLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztDQUNKO0FBR0QsT0FBTyxFQUVILFVBQVUsRUFDVixZQUFZLEVBQ2YsQ0FBQSJ9