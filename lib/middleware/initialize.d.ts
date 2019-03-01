import { Response, NextFunction } from 'express';
import Authenticator from '../authenticator';
import { ExtendedRequest } from '../types/incoming-message';
export default function initializeFactory(passport?: Authenticator): (req: ExtendedRequest, res: Response, next: NextFunction) => void;
