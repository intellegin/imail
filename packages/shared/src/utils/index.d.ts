export declare const isValidEmail: (email: string) => boolean;
export declare const formatName: (firstName: string, lastName: string) => string;
export declare const createPaginationMeta: (page: number, limit: number, total: number) => {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};
export declare const calculateOffset: (page: number, limit: number) => number;
export declare const createApiResponse: <T>(success: boolean, data?: T, error?: string, message?: string) => {
    success: boolean;
    data: T | undefined;
    error: string | undefined;
    message: string | undefined;
};
export declare const handleAsyncRoute: (fn: Function) => (req: any, res: any, next: any) => void;
