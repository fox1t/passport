import { Handler } from 'express';
declare type FlashObject = {
    type?: string;
    message?: string;
};
interface AuthenticateFactoryOptions {
    failureFlash?: boolean | string | FlashObject;
    failureMessage?: boolean | string;
    successRedirect?: string;
    failureRedirect?: string;
    failWithError?: boolean;
    successFlash?: string | FlashObject;
    successMessage?: boolean | string;
    assignProperty?: string;
    successReturnToOrRedirect?: string;
    authInfo?: boolean;
}
declare const _default: (passport: any, name: string | string[], options: AuthenticateFactoryOptions, callback: Function) => Handler;
export = _default;
