declare module "IDictionary" {
    export interface IDictionary<TValue> {
        [id: string]: TValue;
    }
}
declare module "LSDocument" {
    import { IDictionary } from "IDictionary";
    import { LSCollection } from "LSCollection";
    export class LSDocument {
        private fields;
        id: string;
        private _parent;
        get parent(): LSCollection | undefined;
        set parent(value: LSCollection | undefined);
        collections: IDictionary<LSCollection>;
        constructor(id: string, fields?: object, collections?: IDictionary<LSCollection>);
        Collection: (id: string) => LSCollection | undefined;
        Contains: (id: string) => boolean;
        Add(collection: LSCollection): void;
        Remove(id: string): void;
        InsurePath(path: string | string[]): void;
        Load: () => void;
        private build;
        Save: () => void;
        Set: (data: object) => void;
        Get: () => object;
        SetPath(path: string | string[], data: object): void;
        GetPath: (path: string | string[]) => object;
        private pathToArray;
        private pathTraverse;
        CollectionPath(path: string | string[]): LSCollection;
        DocumentPath(path: string | string[]): LSDocument;
        PassTo: (callback: (data: object) => any) => any;
    }
}
declare module "LavaStore" {
    import { LSDocument } from "LSDocument";
    export class LavaStore extends LSDocument {
        set parent(p: undefined);
    }
}
declare module "LSCollection" {
    import { LSDocument } from "LSDocument";
    import { IDictionary } from "IDictionary";
    export class LSCollection {
        id: string;
        parent: LSDocument | undefined;
        documents: IDictionary<LSDocument>;
        constructor(id: string, documents?: IDictionary<LSDocument>);
        Contains: (id: string) => boolean;
        Document: (id: string) => LSDocument | undefined;
        Add(doc: LSDocument): void;
        Remove(id: string): void;
    }
}
declare abstract class LSWrapper {
    private static serialize;
    private static deserialize;
    static Save: (label: string, data: any) => void;
    static Load: (label: string) => any;
    static Contains: (label: string) => boolean;
}
