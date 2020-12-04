"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LSCollection = void 0;
class LSCollection {
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
}
exports.LSCollection = LSCollection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTFNDb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0xTQ29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSxNQUFhLFlBQVk7SUFLckIsWUFBWSxFQUFVLEVBQUUsWUFBcUMsRUFBRTtRQUZ4RCxjQUFTLEdBQTRCLEVBQUUsQ0FBQztRQVF4QyxhQUFRLEdBQUcsQ0FBQyxFQUFVLEVBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEtBQUssU0FBUyxDQUFDO1FBQ3JFLGFBQVEsR0FBRyxDQUFDLEVBQVUsRUFBMEIsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7UUFOekUsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFlLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUlNLEdBQUcsQ0FBQyxHQUFlO1FBQ3RCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUM3QixJQUFJLElBQUksQ0FBQyxNQUFNO1lBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBQ00sTUFBTSxDQUFDLEVBQVU7UUFDcEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLENBQUM7Q0FDSjtBQXJCRCxvQ0FxQkMifQ==