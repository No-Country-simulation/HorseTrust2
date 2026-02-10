import { DataSource } from 'typeorm';
import { AppDataSource } from './data-source';

let isInitialized = false;

export async function initializeDataSource(): Promise<DataSource> {
    if (isInitialized) {
        return AppDataSource;
    }

    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        isInitialized = true;
    }

    return AppDataSource;
}

export async function getDataSource(): Promise<DataSource> {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    return AppDataSource;
}
