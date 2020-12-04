"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LavaStore = void 0;
const LSDocument_1 = require("./LSDocument");
const LSCollection_1 = require("./LSCollection");
class LavaStore extends LSDocument_1.LSDocument {
    set parent(p) {
        throw new Error(`Cannot add LavaStore Document '${this.id}' as child to a Collection!`);
    }
}
exports.LavaStore = LavaStore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGF2YVN0b3JlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0xhdmFTdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBMEM7QUFFMUMsaURBQThDO0FBRTlDLE1BQWEsU0FBVSxTQUFRLHVCQUFVO0lBQ3JDLElBQVcsTUFBTSxDQUFDLENBQVk7UUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsSUFBSSxDQUFDLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztJQUM1RixDQUFDO0NBQ0o7QUFKRCw4QkFJQyJ9