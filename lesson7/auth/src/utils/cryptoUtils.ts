import crypto = require('crypto');

const genRandomString = (length: number): string => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length);   /** return required number of characters */
};

const sha512 = (password: string, salt: string): string => {
  const hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('hex');
};

export const cryptoUtils = {
  genRandomString,
  sha512
};
