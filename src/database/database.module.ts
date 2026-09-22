import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import { migrateOfficeCompanyFk } from './migrate-office-company-fk.js';

function isLocalHost(host: string) {
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host.endsWith('-db')
  );
}

function sslOption(host: string, sslMode?: string) {
  const mode = (sslMode ?? (isLocalHost(host) ? 'disable' : 'require')).toLowerCase();
  if (mode === 'disable' || mode === 'false') {
    return false;
  }

  return { rejectUnauthorized: mode !== 'no-verify' };
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const synchronize =
          (configService.get<string>('DATABASE_SYNC') ?? 'true') !== 'false';
        const sslMode = configService.get<string>('DB_SSL');
        const url = configService.get<string>('DATABASE_URL');

        if (url) {
          const withSsl =
            url.includes('sslmode=') || sslMode === 'disable'
              ? url
              : `${url}${url.includes('?') ? '&' : '?'}sslmode=require`;

          return {
            type: 'postgres' as const,
            url: withSsl,
            ssl: sslOption('remote', sslMode ?? 'require'),
            autoLoadEntities: true,
            synchronize,
          };
        }

        const host = configService.get<string>('DB_HOST') ?? '127.0.0.1';
        const ssl = sslOption(host, sslMode);

        return {
          type: 'postgres' as const,
          host,
          port: Number(configService.get<string>('DB_PORT') ?? 5432),
          username: configService.get<string>('DB_USERNAME') ?? 'postgres',
          password: configService.get<string>('DB_PASSWORD') ?? '',
          database: configService.get<string>('DB_NAME') ?? 'bnv_core',
          ssl,
          extra: ssl ? { ssl } : undefined,
          autoLoadEntities: true,
          synchronize,
        };
      },
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('TypeORM options are required.');
        }

        const synchronize = Boolean(options.synchronize);
        const dataSource = new DataSource({
          ...options,
          synchronize: false,
        } as DataSourceOptions);
        await dataSource.initialize();
        await migrateOfficeCompanyFk(dataSource);
        if (synchronize) {
          await dataSource.synchronize();
        }
        return dataSource;
      },
    }),
  ],
})
export class DatabaseModule {}
