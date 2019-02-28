import SessionManager from './sessionmanager';
import { Strategy } from 'passport';
import { Handler, Request } from 'express';
declare class Authenticator {
    _key: string;
    _strategies: {
        [k: string]: Strategy;
    };
    _serializers: Function[];
    _deserializers: Function[];
    _infoTransformers: Function[];
    _framework: any;
    _userProperty: string;
    _sm: SessionManager;
    constructor();
    init(): void;
    use(name: string | Strategy, strategy?: Strategy): this;
    unuse(name: string): this;
    framework(fw: any): this;
    initialize(options: {
        userProperty: string;
    }): Handler;
    authenticate(strategy: string, options?: Function | any, callback?: Function): Handler;
    authorize(strategy: string, options?: any, callback?: Function): Handler;
    session(options: {
        pauseStream: boolean;
    }): Handler;
    serializeUser(fn: Function | any, req: Request | Function | undefined, done?: Function): number | undefined;
    deserializeUser(fn: Function | any, req: Request | Function | undefined, done?: Function): number | undefined;
    transformAuthInfo(fn: Function | any, req: Request | Function | undefined, done?: Function): number | undefined;
    _strategy(name: string): Strategy;
}
export = Authenticator;
