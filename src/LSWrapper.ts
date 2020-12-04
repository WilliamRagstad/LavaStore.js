/**
 * LocalStorage Wrapper class
 */
abstract class LSWrapper {
    private static serialize = (data: any) => JSON.stringify(data);
    private static deserialize = (json: string) => JSON.parse(json);
    public static Save = (label: string, data: any) => localStorage.setItem(label, LSWrapper.serialize(data))
    public static Load = (label: string) => LSWrapper.deserialize(localStorage.getItem(label) ?? '');
    public static Contains = (label: string) => !!localStorage.getItem(label);
}