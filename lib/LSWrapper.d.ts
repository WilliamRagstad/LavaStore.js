declare abstract class LSWrapper {
    private static serialize;
    private static deserialize;
    static Save: (label: string, data: any) => void;
    static Load: (label: string) => any;
    static Contains: (label: string) => boolean;
}
