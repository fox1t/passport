declare function logIn(user: object, options: any, done: (err?: Error) => void): void;
declare function logOut(): void;
declare function isAuthenticated(): boolean;
declare function isUnauthenticated(): boolean;
declare const req: {
    login: typeof logIn;
    logIn: typeof logIn;
    logout: typeof logOut;
    logOut: typeof logOut;
    isAuthenticated: typeof isAuthenticated;
    isUnauthenticated: typeof isUnauthenticated;
};
export = req;
