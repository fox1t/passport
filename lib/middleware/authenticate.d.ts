import { ExtendedRequest } from '../types/incoming-message';
import { Response, NextFunction } from 'express';
import Authenticator from '../authenticator';
declare type FlashObject = {
    type?: string;
    message?: string;
};
interface AuthenticateFactoryOptions {
    scope?: string;
    failureFlash?: boolean | string | FlashObject;
    failureMessage?: boolean | string;
    successRedirect?: string;
    failureRedirect?: string;
    failWithError?: boolean;
    successFlash?: boolean | string | FlashObject;
    successMessage?: boolean | string;
    assignProperty?: string;
    successReturnToOrRedirect?: string;
    authInfo?: boolean;
}
declare type AuthenticateFactoryCallback = (err: null | Error, user?: any, info?: any, statuses?: any | any[]) => void;
export default function authenticateFactory(passport: Authenticator, name: string | string[], options?: AuthenticateFactoryOptions | AuthenticateFactoryCallback, callback?: AuthenticateFactoryCallback): (req: ExtendedRequest, res: Response, next: NextFunction) => void;
export {};
