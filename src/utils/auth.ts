import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(); // default 10
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(raw: string, hash: string) {
  return bcrypt.compareSync(raw, hash);
}

const privateKEY = process.env.JWT_PRIVATE as string;
// const privateKEY = fs.readFileSync('/jwtRS256.key', 'utf8');
// const publicKEY = fs.readFileSync('./jwtRS256.key.pub', 'utf8');

export const createToken = async (user: any) => {
  const accessToken = jwt.sign(user, privateKEY, {
    expiresIn: '2h',
    algorithm: 'RS256',
    // issuer: Domain,
  });
  return accessToken;
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(
    token,
    privateKEY,
    { algorithms: ['RS256'] }
    // function (err, payload) {
    // if token alg != RS256,  return err == invalid signature
    // }
  );
  return decoded;
};
