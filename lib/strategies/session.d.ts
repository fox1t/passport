import { ExtendedRequest } from '../types/incoming-message';
import { BasicStrategy } from '.';
import Authenticator from '../authenticator';
declare class SessionStrategy extends BasicStrategy {
    name: string;
    _deserializeUser: Function;
    constructor(deserializeUser?: Authenticator['deserializeUser']);
    constructor(options: any, deserializeUser?: Authenticator['deserializeUser']);
    authenticate(req: ExtendedRequest, options: {
        pauseStream?: boolean;
    }): void;
}
export default SessionStrategy;
