import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const dbType = process.env.DB_TYPE || 'sqlite';

// Use absolute path outside of dist directory
const projectRoot = path.resolve(__dirname, '../../../');

export const databaseConfig: TypeOrmModuleOptions = {
  type: dbType as any,
  ...(dbType === 'sqlite'
    ? {
        database: path.join(projectRoot, 'data', 'dev.db'),
        synchronize: true,
        logging: false,
      }
    : dbType === 'postgres'
    ? {
        url: process.env.DATABASE_URL,
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'secret',
        database: process.env.DB_DATABASE || 'blog_cms',
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
      }),
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
};
