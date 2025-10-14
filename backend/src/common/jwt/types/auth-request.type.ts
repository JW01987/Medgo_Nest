import { Request } from 'express';
import { JwtPayload } from './jwt-payload.type';

export interface AuthRequest extends Request {
  user: JwtPayload;
}
