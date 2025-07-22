import crypto from 'crypto';

const generateSecret = () => {
  return crypto.randomBytes(32).toString('base64');
};

const accessSecret = generateSecret();
const refreshSecret = generateSecret();

console.log('JWT_ACCESS_SECRET:', accessSecret);
console.log('JWT_REFRESH_SECRET:', refreshSecret); 