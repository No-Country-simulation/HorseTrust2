import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth/get-user-from-token';
import { getRepository } from '@/lib/database/get-repository';
import { User } from '@/lib/database/entities/User';
import { errorResponse } from '@/lib/http/response-handler';

export async function GET() {
    try {
        const authUser = await getAuthUser();
        if (!authUser) {
            return errorResponse({
                        message: "No autorizado",
                        code: "UNAUTHORIZED",
                        statusCode: 401,
                        name: ""
                    });
        }

        const userRepository = await getRepository(User);
        const user = await userRepository.findOne({ where: { id: authUser.userId } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { first_name, last_name, email, phone, avatar_url } = body;

        const userRepository = await getRepository(User);
        const fullUser = await userRepository.findOne({ where: { id: user.userId } });
        if (!fullUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await userRepository.update(user.userId, {
            first_name,
            last_name,
            email,
            phone,
            avatar_url,
        });

        const updatedUser = await userRepository.findOne({ where: { id: user.userId } });
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}