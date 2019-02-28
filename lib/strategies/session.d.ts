import { Strategy } from 'passport-strategy';
import { Request } from 'express';
declare class SessionStrategy extends Strategy {
    name: string;
    _deserializeUser: Function;
    constructor(options: Function | any, deserializeUser?: Function);
    authenticate(req: Request, options: {
        pauseStream?: boolean;
    }): void;
}
export = SessionStrategy;
