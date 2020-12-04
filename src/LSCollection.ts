import { LSDocument } from "./LSDocument";
import { LavaStore } from './LavaStore';
import { IDictionary } from "./IDictionary";

export class LSCollection {
    public id: string;
    public parent: LSDocument | undefined;
    public documents: IDictionary<LSDocument> = {};

    constructor(id: string, documents: IDictionary<LSDocument> = {}) {
        this.id = id;
        this.documents = documents;
        Object.values(this.documents).forEach((val: LSDocument) => val.parent = this);
    }

    public Contains = (id: string): boolean => this.documents[id] !== undefined;
    public Document = (id: string): LSDocument | undefined => this.documents[id];
    public Add(doc: LSDocument) {
        doc.parent = this;
        this.documents[doc.id] = doc;
        if (this.parent) this.parent.Save();
    }
    public Remove(id: string) {
        delete this.documents[id];
    }
}