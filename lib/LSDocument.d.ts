import { IDictionary } from "./IDictionary";
import { LSCollection } from "./LSCollection";
export declare class LSDocument {
    private fields;
    id: string;
    private _parent;
    get parent(): LSCollection | undefined;
    set parent(value: LSCollection | undefined);
    collections: IDictionary<LSCollection>;
    constructor(id: string, fields?: object, collections?: IDictionary<LSCollection>);
    Collection(id: string): LSCollection | undefined;
    Contains(id: string): boolean;
    Add(collection: LSCollection): void;
    Remove(id: string): void;
    InsurePath(path: string | string[]): void;
    Load(): void;
    private build;
    Save(): void;
    Set(data: object): void;
    Get(): object;
    HasData(): boolean;
    SetPath(path: string | string[], data: object): void;
    GetPath(path: string | string[]): object;
    private pathToArray;
    private pathTraverse;
    CollectionPath(path: string | string[]): LSCollection;
    DocumentPath(path: string | string[]): LSDocument;
    PassTo(callback: ((data: object) => any)): void;
}
