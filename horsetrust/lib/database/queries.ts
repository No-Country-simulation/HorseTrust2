/**
 * Ejemplos avanzados de consultas con TypeORM QueryBuilder
 * Estas son consultas complejas útiles para la plataforma HorseTrust
 */

import { getDataSource } from '@/lib/database';
import {
    User,
    Horse,
    Sale,
    Review,
    Chat,
    Message,
} from '@/lib/database/entities';
import { HorseSaleStatus, VerificationStatus } from '@/lib/database/enums';

interface TopSellersResult {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    average_rating: number | null;
    total_sales: number;
}

interface SearchHorsesResult {
    data: (Horse & { owner: User })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

interface MonthlySalesStatsResult {
    month: string;
    count: string;
    total: string;
}

interface ChatsWithLastMessage {
    id: string;
    buyer_id: string;
    seller_id: string;
    is_active: boolean;
    created_at: Date;
    messages: Message[];
    buyer: User;
    seller: User;
    lastMessage: Message | null;
}

interface SellerHorseWithRatings {
    id: string;
    name: string;
    age: number;
    breed: string;
    avgRating: number | null;
    reviewCount: number;
}

/**
 * Obtener vendedores top con rating promedio
 */
export async function getTopSellers(
    limit: number = 10
): Promise<TopSellersResult[]> {
    const dataSource = await getDataSource();

    const sellers = await dataSource
        .createQueryBuilder(User, 'user')
        .select('user.id', 'id')
        .addSelect('user.email', 'email')
        .addSelect('user.first_name', 'first_name')
        .addSelect('user.last_name', 'last_name')
        .addSelect('user.average_rating', 'average_rating')
        .addSelect('user.total_sales', 'total_sales')
        .where('user.average_rating IS NOT NULL')
        .orderBy('user.average_rating', 'DESC')
        .addOrderBy('user.total_sales', 'DESC')
        .limit(limit)
        .getRawMany();

    return sellers;
}

/**
 * Buscar caballos verificados con filtros
 */
export async function searchHorses(filters: {
    breed?: string;
    discipline?: string;
    minAge?: number;
    maxAge?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}): Promise<SearchHorsesResult> {
    const dataSource = await getDataSource();
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    let query = dataSource
        .createQueryBuilder(Horse, 'horse')
        .innerJoinAndSelect('horse.owner', 'owner')
        .where('horse.verification_status = :status', {
            status: VerificationStatus.verified,
        })
        .andWhere('horse.sale_status = :saleStatus', {
            saleStatus: HorseSaleStatus.for_sale,
        });

    if (filters.breed) {
        query = query.andWhere('horse.breed ILIKE :breed', {
            breed: `%${filters.breed}%`,
        });
    }

    if (filters.discipline) {
        query = query.andWhere('horse.discipline = :discipline', {
            discipline: filters.discipline,
        });
    }

    if (filters.minAge !== undefined) {
        query = query.andWhere('horse.age >= :minAge', {
            minAge: filters.minAge,
        });
    }

    if (filters.maxAge !== undefined) {
        query = query.andWhere('horse.age <= :maxAge', {
            maxAge: filters.maxAge,
        });
    }

    if (filters.maxPrice !== undefined) {
        query = query.andWhere('horse.price <= :maxPrice', {
            maxPrice: filters.maxPrice,
        });
    }

    const [horses, total] = await query
        .skip(skip)
        .take(limit)
        .getManyAndCount();

    return {
        data: horses,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
        },
    };
}

/**
 * Obtener historial de ventas de un vendedor
 */
export async function getSellerSalesHistory(
    sellerId: string
): Promise<(Sale & { horse: Horse; buyer: User; reviews: Review[] })[]> {
    const dataSource = await getDataSource();

    const sales = await dataSource
        .createQueryBuilder(Sale, 'sale')
        .innerJoinAndSelect('sale.horse', 'horse')
        .innerJoinAndSelect('sale.buyer', 'buyer')
        .leftJoinAndSelect('sale.reviews', 'review')
        .where('sale.seller_id = :sellerId', { sellerId })
        .orderBy('sale.completed_at', 'DESC')
        .getMany();

    return sales;
}

/**
 * Obtener chats activos de un usuario con último mensaje
 */
export async function getUserActiveChats(
    userId: string
): Promise<ChatsWithLastMessage[]> {
    const dataSource = await getDataSource();

    const chats = await dataSource
        .createQueryBuilder(Chat, 'chat')
        .leftJoinAndSelect('chat.messages', 'messages')
        .innerJoinAndSelect('chat.buyer', 'buyer')
        .innerJoinAndSelect('chat.seller', 'seller')
        .where('chat.is_active = true')
        .andWhere('(chat.buyer_id = :userId OR chat.seller_id = :userId)', {
            userId,
        })
        .orderBy('messages.created_at', 'DESC')
        .getMany();

    // Agrupar por chat y obtener solo el último mensaje
    return chats.map((chat) => ({
        ...chat,
        lastMessage: chat.messages?.[0] || null,
    }));
}

/**
 * Estadísticas de ventas por mes
 */
export async function getMonthlySalesStats(
    sellerId: string
): Promise<MonthlySalesStatsResult[]> {
    const dataSource = await getDataSource();

    const stats = await dataSource
        .createQueryBuilder(Sale, 'sale')
        .select("DATE_TRUNC('month', sale.completed_at)::DATE", 'month')
        .addSelect('COUNT(*)', 'count')
        .addSelect('SUM(sale.price)', 'total')
        .where('sale.seller_id = :sellerId', { sellerId })
        .groupBy("DATE_TRUNC('month', sale.completed_at)")
        .orderBy("DATE_TRUNC('month', sale.completed_at)", 'DESC')
        .getRawMany();

    return stats;
}

/**
 * Obtener caballos de un vendedor con promedio de rating
 */
export async function getSellerHorsesWithRatings(
    sellerId: string
): Promise<SellerHorseWithRatings[]> {
    const dataSource = await getDataSource();

    const horses = await dataSource
        .createQueryBuilder(Horse, 'horse')
        .leftJoinAndSelect('horse.sales', 'sales')
        .leftJoinAndSelect('sales.reviews', 'reviews')
        .where('horse.owner_id = :sellerId', { sellerId })
        .orderBy('horse.created_at', 'DESC')
        .getMany();

    // Calcular promedio de rating por caballo
    return horses.map((horse) => {
        const reviews = horse.sales.flatMap((sale) => sale.reviews);
        const avgRating =
            reviews.length > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                : null;

        return {
            id: horse.id,
            name: horse.name,
            age: horse.age,
            breed: horse.breed,
            avgRating,
            reviewCount: reviews.length,
        };
    });
}

/**
 * Buscar usuarios por texto (email, nombre)
 */
export async function searchUsers(
    searchTerm: string,
    limit: number = 20
): Promise<Partial<User>[]> {
    const dataSource = await getDataSource();

    return await dataSource
        .createQueryBuilder(User, 'user')
        .where('user.email ILIKE :search', { search: `%${searchTerm}%` })
        .orWhere('user.first_name ILIKE :search', { search: `%${searchTerm}%` })
        .orWhere('user.last_name ILIKE :search', { search: `%${searchTerm}%` })
        .select([
            'user.id',
            'user.email',
            'user.first_name',
            'user.last_name',
            'user.average_rating',
            'user.total_sales',
        ])
        .limit(limit)
        .getMany();
}

/**
 * Verificar si un usuario existe y obtener su perfil público
 */
export async function getUserPublicProfile(userId: string): Promise<User | null> {
    const dataSource = await getDataSource();

    const user = await dataSource
        .createQueryBuilder(User, 'user')
        .leftJoinAndSelect('user.owned_horses', 'horses')
        .leftJoinAndSelect('user.reviews_received', 'reviews')
        .where('user.id = :userId', { userId })
        .select([
            'user.id',
            'user.email',
            'user.first_name',
            'user.last_name',
            'user.avatar_url',
            'user.average_rating',
            'user.total_sales',
            'user.seller_level',
            'horses.id',
            'horses.name',
            'horses.breed',
            'reviews.rating',
            'reviews.comment',
        ])
        .getOne();

    return user ?? null;
}
