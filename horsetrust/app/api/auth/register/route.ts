import { NextResponse } from "next/server";
import { AppDataSource } from "@/lib/database/data-source";
import { User } from "@/lib/database/entities/User";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("DB Connected");
    }

    const repo = AppDataSource.getRepository(User);

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = repo.create({
      email: body.email,
      password: hashedPassword,
    });

    await repo.save(user);

    return NextResponse.json({
      ok: true,
      message: "Usuario creado correctamente",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
