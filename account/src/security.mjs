import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env['JWT_SECRET'];
if (secret === undefined || secret.length === 0) {
  console.error('ERROR: Missing JWT_SECRET environment variable.');
  process.exit(2);
}

export function signToken(claims) {
  if (!Number.isInteger(claims.exp)) {
    claims.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
  }
  console.log(claims);
  const token =  jwt.sign(claims, secret);
  console.log(jwt.decode(token, secret));
  return token;
}
