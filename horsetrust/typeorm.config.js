require('dotenv').config({ path: '.env.local' });
require('reflect-metadata');

const { DataSource } = require('typeorm');
const path = require('path');

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'horsetrust',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    entities: [
        'lib/database/entities/*.ts',
        'dist/lib/database/entities/*.js',
    ],
    migrations: [
        'lib/database/migrations/*.ts',
        'dist/lib/database/migrations/*.js',
    ],
    subscribers: [
        'lib/database/subscribers/*.ts',
        'dist/lib/database/subscribers/*.js',
    ],
});

module.exports = AppDataSource;
