require('dotenv').config();
require('reflect-metadata');

const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5433'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'horsetrust',
    synchronize: true,
    logging: true,
    entities: [
        'lib/database/entities/*.ts',
        'dist/lib/database/entities/*.js',
    ],
    migrations: [
        'lib/database/migrations/*.ts',
        'dist/lib/database/migrations/*.js',
    ],
});

module.exports = AppDataSource;
