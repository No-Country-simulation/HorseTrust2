/**
 * Utilidades comunes para operaciones de base de datos
 */

import {
    DataSource,
    Repository,
    FindOneOptions,
    FindOptionsWhere,
    ObjectLiteral,
    UpdateResult,
} from 'typeorm';
import { getDataSource } from '@/lib/database';

/**
 * Manejo de errores de base de datos
 */
export class DatabaseError extends Error {
    constructor(
        public code: string,
        message: string,
        public details?: unknown
    ) {
        super(message);
        this.name = 'DatabaseError';
    }
}

/**
 * Errores específicos de integridad de datos
 */
export const DB_ERROR_CODES = {
    UNIQUE_VIOLATION: '23505',
    NOT_NULL_VIOLATION: '23502',
    FOREIGN_KEY_VIOLATION: '23503',
    INVALID_TEXT_REPRESENTATION: '22P02',
};

/**
 * Parsear errores de PostgreSQL
 */
export function parseDatabaseError(
    error: unknown
): DatabaseError {
    const err = error as {
        code?: string;
        column?: string;
        message?: string;
    };

    if (err.code === DB_ERROR_CODES.UNIQUE_VIOLATION) {
        return new DatabaseError(
            'DUPLICATE_ENTRY',
            'This entry already exists',
            error
        );
    }

    if (err.code === DB_ERROR_CODES.FOREIGN_KEY_VIOLATION) {
        return new DatabaseError(
            'INVALID_REFERENCE',
            'Referenced record does not exist',
            error
        );
    }

    if (err.code === DB_ERROR_CODES.NOT_NULL_VIOLATION) {
        return new DatabaseError(
            'MISSING_REQUIRED_FIELD',
            `Required field is missing: ${err.column}`,
            error
        );
    }

    if (err.code === DB_ERROR_CODES.INVALID_TEXT_REPRESENTATION) {
        return new DatabaseError(
            'INVALID_FORMAT',
            'Invalid data format provided',
            error
        );
    }

    return new DatabaseError(
        'UNKNOWN_ERROR',
        err.message || 'An unknown database error occurred',
        error
    );
}

/**
 * Validar UUID
 */
export function isValidUUID(uuid: string): boolean {
    const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

/**
 * Validar email
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Pagination helper
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export function getPaginationParams(
    query?: { page?: string; limit?: string }
): { skip: number; take: number; page: number; limit: number } {
    const page = Math.max(1, parseInt(query?.page || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(query?.limit || '10')));
    const skip = (page - 1) * limit;

    return { skip, take: limit, page, limit };
}

export function formatPaginationResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
): PaginatedResponse<T> {
    return {
        data,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
}

/**
 * Helpers para transacciones
 */
export async function runInTransaction<T>(
    callback: (manager: DataSource['manager']) => Promise<T>
): Promise<T> {
    const dataSource = await getDataSource();
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const result = await callback(queryRunner.manager);
        await queryRunner.commitTransaction();
        return result;
    } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
}

/**
 * Helper para obtener entidad o lanzar error
 */
export async function findOrFail<T extends ObjectLiteral>(
    repository: Repository<T>,
    id: string,
    options?: FindOneOptions<T>
): Promise<T> {
    const entity = await repository.findOne({
        where: { id } as unknown as FindOptionsWhere<T>,
        ...options,
    });

    if (!entity) {
        throw new DatabaseError('NOT_FOUND', `Record not found with id: ${id}`);
    }

    return entity;
}

/**
 * Helper para contar registros
 */
export async function countRecords<T extends ObjectLiteral>(
    repository: Repository<T>,
    criteria: FindOptionsWhere<T>
): Promise<number> {
    return await repository.count({ where: criteria });
}

/**
 * Validaciones comunes de negocio
 */
export async function validateUserExists(userId: string): Promise<boolean> {
    const dataSource = await getDataSource();
    const count = await countRecords(
        dataSource.getRepository('User'),
        { id: userId }
    );
    return count > 0;
}

export async function validateHorseExists(horseId: string): Promise<boolean> {
    const dataSource = await getDataSource();
    const count = await countRecords(
        dataSource.getRepository('Horse'),
        { id: horseId }
    );
    return count > 0;
}

/**
 * Soft delete helper (si lo necesitas después)
 */
export interface SoftDeleteEntity extends ObjectLiteral {
    deleted_at: Date | null;
    id: string;
}

export async function softDelete<T extends SoftDeleteEntity>(
    repository: Repository<T>,
    id: string
): Promise<UpdateResult> {
    return await repository.update(
        { id } as unknown as FindOptionsWhere<T>,
        { deleted_at: new Date() } as unknown as Partial<T>
    );
}
