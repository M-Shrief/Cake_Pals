import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(); // default 10
  return bcrypt.hashSync(password, salt);
}

export const comparePassword = (raw: string, hash: string) =>
  bcrypt.compareSync(raw, hash);

const privateKEY = process.env.JWT_PRIVATE as string;

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
