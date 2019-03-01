import { logIn, logOut, isAuthenticated, isUnauthenticated } from '../http/request'
import { IncomingMessage } from 'http'
import Authenticator from '../authenticator'

export interface ExtendedRequest extends IncomingMessage {
  login: typeof logIn
  logIn: typeof logIn
  logout: typeof logOut
  logOut: typeof logOut
  isAuthenticated: typeof isAuthenticated
  isUnauthenticated: typeof isUnauthenticated
  session: any
  _passport: {
    instance: Authenticator
    session?: any
  }
  flash(key: string, message: string): void
  [k: string]: any
}
