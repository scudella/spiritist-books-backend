import crypto from 'crypto';

const hashString = (token) =>
  crypto.createHash('md5').update(token).digest('hex');

export default hashString;
