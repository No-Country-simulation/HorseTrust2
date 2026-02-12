import { AppDataSource } from "@/lib/database/data-source";
import { User } from "@/lib/database/entities/User";
import bcrypt from "bcrypt";
import { parseDatabaseError } from "@/lib/database/utils";
import { errorResponse, handleUnexpectedError, successResponse } from "@/lib/http/response-handler";
import { mapDatabaseErrorToAppError } from "@/lib/errors/error-mapper";
import { QueryFailedError } from "typeorm";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const repo = AppDataSource.getRepository(User);

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

  } catch (error: unknown) {

    // 🎯 Si viene error de PostgreSQL
    if (error instanceof QueryFailedError) {
      const dbError = parseDatabaseError(error);
      const appError = mapDatabaseErrorToAppError(dbError);
      return errorResponse(appError);
    }

    return handleUnexpectedError(error);
  }
}