import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
    User,
    Address,
    Horse,
    Document,
    Chat,
    Message,
    Sale,
    Review,
} from './entities';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'horsetrust',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [User, Address, Horse, Document, Chat, Message, Sale, Review],
    migrations: ['lib/database/migrations/*.ts'],
    subscribers: ['lib/database/subscribers/*.ts'],
});
