import { User } from "@/lib/database/entities/User";
import bcrypt from "bcrypt";
import { withErrorHandler } from "@/lib/http/with-error-handler";
import { NextRequest, NextResponse } from "next/server";
import { successResponse } from "@/lib/http/response-handler";
import { getRepository } from "@/lib/database/get-repository";


export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();

  const repo = await getRepository(User);

  const hashedPassword = await bcrypt.hash(body.password, 10);

  // Busca si el email ya existe
  const existingUser = await repo.findOne({ where: { email: body.email } });
  if (existingUser) {
    return NextResponse.json(
      { message: "El email ya está registrado" },
      { status: 400 }
    );
  }

  const user = repo.create({
    email: body.email,
    password: hashedPassword,
    first_name: body.first_name || null,
    last_name: body.last_name || null,
    phone: body.phone || null,
  });

  await repo.save(user);

  return successResponse(
    { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name },
    "Usuario creado correctamente",
    201
  );
});
