abstract class LSHelpers {
    public static HasFields(data: object): boolean { return Object.keys(data).length > 0; }
    public static is<T>(data: object, guard: (t: any) => t is T): boolean {
        return guard(data);
    }
}

export default LSHelpers;