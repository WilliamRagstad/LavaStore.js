import { LSDocument } from "./LSDocument";
import { IDictionary } from "./IDictionary";
export declare class LSCollection {
    id: string;
    parent: LSDocument | undefined;
    private documents;
    constructor(id: string, documents?: IDictionary<LSDocument>);
    Contains(id: string): boolean;
    Document(id: string): LSDocument | undefined;
    Add(document: LSDocument): void;
    Remove(id: string): void;
}
