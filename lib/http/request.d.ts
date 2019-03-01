export declare function logIn(user: object, options: any, done: (err?: Error) => void): void;
export declare function logOut(): void;
export declare function isAuthenticated(): boolean;
export declare function isUnauthenticated(): boolean;
declare const req: {
    login: typeof logIn;
    logIn: typeof logIn;
    logout: typeof logOut;
    logOut: typeof logOut;
    isAuthenticated: typeof isAuthenticated;
    isUnauthenticated: typeof isUnauthenticated;
};
export default req;
