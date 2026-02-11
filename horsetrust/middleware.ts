import { getDataSource } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';


export async function middleware(request: NextRequest): Promise<NextResponse> {
  try {
    const dataSource = await getDataSource(); // aquí se inicializa la conexión
    // opcional: verificar conexión
    if (!dataSource.isInitialized) {
      console.error('Database not initialized');
    }
  } catch (error) {
    console.error('Database connection error:', error);
  }

  return NextResponse.next();
}


export const config = {
  runtime: 'nodejs', // necesario para usar TypeORM
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
