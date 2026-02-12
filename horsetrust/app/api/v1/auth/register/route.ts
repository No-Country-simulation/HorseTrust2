import { User } from "@/lib/database/entities/User";
import bcrypt from "bcrypt";
import { withErrorHandler } from "@/lib/http/with-error-handler";
import { NextRequest } from "next/server";
import { successResponse } from "@/lib/http/response-handler";
import { getRepository } from "@/lib/database/get-repository";


export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();

  const repo = await getRepository(User);

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = repo.create({
    email: body.email,
    password: hashedPassword,
  });

  await repo.save(user);

  return successResponse(
    { id: user.id, email: user.email },
    "Usuario creado correctamente",
    201
  );
});
