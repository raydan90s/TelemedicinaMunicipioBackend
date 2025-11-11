import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY;

export function generateToken(payload, expiresIn = '2h') {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}
