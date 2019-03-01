import { ExtendedRequest } from './types/incoming-message';
declare class SessionManager {
    _key: string;
    _serializeUser: Function;
    constructor(options: Function | any, serializeUser: Function);
    logIn(req: ExtendedRequest, user: any, cb: (err?: Error) => void): void;
    logOut(req: ExtendedRequest, cb?: () => void): void;
}
export default SessionManager;
