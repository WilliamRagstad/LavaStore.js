declare abstract class LSHelpers {
    static HasFields(data: object): boolean;
    static is<T>(data: object, guard: (t: any) => t is T): boolean;
}
export default LSHelpers;
