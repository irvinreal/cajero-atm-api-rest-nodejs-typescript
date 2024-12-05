import jwt from 'jsonwebtoken';
import { User } from '../models/user.interface';

const JWT_SECRET = process.env.JWT_SECRET || 'Default-secret';

export const generateToken = (user: User): string => {
  return jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
    expiresIn: '1400'
  });
};
