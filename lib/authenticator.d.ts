import SessionManager from './sessionmanager';
import { Handler } from 'express';
import { BasicStrategy } from './strategies';
import { ExtendedRequest } from './types/incoming-message';
declare type DoneFunction = (err: null | Error | 'pass', user?: any) => void;
declare class Authenticator {
    _key: string;
    _strategies: {
        [k: string]: BasicStrategy;
    };
    _serializers: Function[];
    _deserializers: Function[];
    _infoTransformers: Function[];
    _framework: any;
    _userProperty: string;
    _sm: SessionManager;
    constructor();
    use(name: BasicStrategy): this;
    use(name: string, strategy: BasicStrategy): this;
    unuse(name: string): this;
    framework(fw: any): this;
    initialize(options?: {
        userProperty?: string;
    }): Handler;
    authenticate(strategy: string, options?: Function | any, callback?: Function): Handler;
    authorize(strategy: string, options?: any, callback?: Function): any;
    session(options?: {
        pauseStream?: boolean;
    }): Handler;
    serializeUser(fn: ((user: any, done: DoneFunction) => void) | ((req: ExtendedRequest, user: any, done: DoneFunction) => void)): void;
    serializeUser(user: any, done: DoneFunction): void;
    serializeUser(user: any, req: ExtendedRequest, done: Function): void;
    deserializeUser(fn: ((user: any, done: DoneFunction) => void) | ((req: ExtendedRequest, user: any, done: DoneFunction) => void)): void;
    deserializeUser(obj: any, done: DoneFunction): void;
    deserializeUser(obj: any, req: ExtendedRequest, done: DoneFunction): void;
    transformAuthInfo(fn: ((info: any, done: DoneFunction) => void) | ((req: ExtendedRequest, info: any, done: DoneFunction) => void)): void;
    transformAuthInfo(obj: any, done: DoneFunction): void;
    transformAuthInfo(obj: any, req: ExtendedRequest, done: DoneFunction): void;
    _strategy(name: string): BasicStrategy;
}
export default Authenticator;
