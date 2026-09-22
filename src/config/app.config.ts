import { registerAs } from '@nestjs/config';

function resolvePort(value: string | undefined) {
  if (value === undefined || value.trim() === '') {
    throw new Error(
      'Missing PORT in .env. The service only runs on the port defined there.',
    );
  }

  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      `Invalid PORT in .env: "${value}". Use a single integer from 1 to 65535.`,
    );
  }

  return port;
}

function resolveOrigins(value: string | undefined) {
  return (value ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export default registerAs('app', () => ({
  name: 'core-service',
  port: resolvePort(process.env.PORT),
  corsOrigins: resolveOrigins(process.env.CORS_ORIGIN),
}));
