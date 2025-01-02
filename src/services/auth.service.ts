import jwt from 'jsonwebtoken';

interface UserToken {
  id: string;
  name: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'Default-secret';

export const generateToken = (user: UserToken): string => {
  return jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
    expiresIn: '1400'
  });
};
