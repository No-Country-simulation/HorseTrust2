import { initializeDataSource } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
    try {
        // Inicializar la conexión a la base de datos
        await initializeDataSource();
    } catch (error) {
        console.error('Database connection error:', error);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
