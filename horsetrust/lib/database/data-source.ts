import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Address } from './entities/Address';
import { Horse } from './entities/Horse';
import { Document } from './entities/Document';
import { Chat } from './entities/Chat';
import { Message } from './entities/Message';
import { Sale } from './entities/Sale';
import { Review } from './entities/Review';

export const entities = {
  User,
  Address,
  Horse,
  Document,
  Chat,
  Message,
  Sale,
  Review,
};

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'horsetrust',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: Object.values(entities),
    migrations: ['dist/lib/database/migrations/*.js'],
    subscribers: ['lib/database/subscribers/*.ts'],
});
