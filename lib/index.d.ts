import Passport from './authenticator';
import SessionStrategy from './strategies/session';
import Strategy from 'passport-strategy';
declare const passportWithConstructors: Passport & {
    Passport: typeof Passport;
    Authenticator: typeof Passport;
    Strategy: typeof Strategy;
    strategies: {
        SessionStrategy: typeof SessionStrategy;
    };
};
export = passportWithConstructors;
