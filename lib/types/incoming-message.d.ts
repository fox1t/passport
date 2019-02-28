import IncomingMessageExt from '../http/request';
declare module 'http' {
    interface IncomingMessage {
        login: typeof IncomingMessageExt.logIn;
        logIn: typeof IncomingMessageExt.logIn;
        logout: typeof IncomingMessageExt.logOut;
        logOut: typeof IncomingMessageExt.logOut;
        isAuthenticated: typeof IncomingMessageExt.isAuthenticated;
        isUnauthenticated: typeof IncomingMessageExt.isUnauthenticated;
        session: any;
        _passport: {
            instance: any;
            session?: any;
        };
        flash(key: string, message: string): void;
        [k: string]: any;
    }
}
