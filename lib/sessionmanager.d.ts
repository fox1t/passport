import { Request } from 'express';
declare class SessionManager {
    _key: string;
    _serializeUser: Function;
    constructor(options: Function | any, serializeUser: Function);
    logIn(req: Request, user: any, cb: (err?: Error) => void): void;
    logOut(req: Request, cb?: () => void): void;
}
export = SessionManager;
