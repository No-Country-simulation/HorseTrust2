import "reflect-metadata";

export async function register() {
  // Solo ejecutar en el runtime de Node.js (no en Edge)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getRepository } = await import("@/lib/database/get-repository");
    const { User } = await import("@/lib/database/entities/User");
    const { Role } = await import("@/lib/database/enums");
    const bcrypt = (await import("bcrypt")).default;

    try {
      const repo = await getRepository(User);

      const existing = await repo.findOne({
        where: { email: "admin@admin.com" },
      });

      if (!existing) {
        const hashedPassword = await bcrypt.hash("admin", 10);

        const admin = repo.create({
          first_name: "Admin",
          last_name: "",
          phone: "0000000000",
          avatar_url: "/images/logo.png",
          email: "admin@admin.com",
          password: hashedPassword,
          role: Role.admin,
        });

        await repo.save(admin);
        console.log(
          "✅ Admin seed: usuario admin@admin.com creado con rol admin",
        );
      } else {
        console.log("ℹ️ Admin seed: usuario admin@admin ya existe, omitiendo");
      }
    } catch (error) {
      console.error("❌ Admin seed: error al crear el admin:", error);
    }
  }
}
