import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { AppDataSource } from './data-source'

declare global {
  var __dataSource: DataSource | undefined
}

export async function getDataSource(): Promise<DataSource> {
  if (!global.__dataSource) {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
      console.log('✅ Database connected')
    }
    global.__dataSource = AppDataSource
  }
  return global.__dataSource
}

// import { DataSource } from 'typeorm';
// import { AppDataSource } from './data-source';

// let isInitialized = false;

// export async function initializeDataSource(): Promise<DataSource> {
//     if (isInitialized) {
//         return AppDataSource;
//     }

//     if (!AppDataSource.isInitialized) {
//         await AppDataSource.initialize();
//         isInitialized = true;
//     }

//     return AppDataSource;
// }

// export async function getDataSource(): Promise<DataSource> {
//     if (!AppDataSource.isInitialized) {
//         await AppDataSource.initialize();
//     }
//     return AppDataSource;
// }
