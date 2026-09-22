import { registerAs } from '@nestjs/config';

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(`Missing ${name} in .env`);
  }
  return value;
}

export default registerAs('jwt', () => ({
  secret: requireEnv('JWT_SECRET'),
  expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
}));
