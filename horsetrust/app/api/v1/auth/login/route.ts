import { signToken } from '@/lib/auth/jwt';
import { User } from '@/lib/database/entities/User';
import { getRepository } from '@/lib/database/get-repository';
import { successResponse } from '@/lib/http/response-handler';
import { withErrorHandler } from '@/lib/http/with-error-handler';
import bcrypt from "bcrypt";
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();

  const repo = await getRepository(User);

  const user = await repo.findOneBy({ email: body.email });

  if (!user) {
    return successResponse(
      { message: 'Usuario no encontrado', code: 'USER_NOT_FOUND' , statusCode: 404},
    );
  }

  const isValid = await bcrypt.compare(body.password, user.password);

  if (!isValid) {
    return successResponse(
      { message: 'Contraseña incorrecta', code: 'INVALID_PASSWORD' , statusCode: 401},
    );
  }

  const token = signToken( {
    userId: user.id,
    email: user.email,
  })

  ;(await cookies()).set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path:"/",
  });

  return successResponse(
    { id: user.id, email: user.email },
    'Login correcto',
    200
  );
});
