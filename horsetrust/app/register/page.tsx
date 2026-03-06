/*"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      let data;

      try {
        data = await res.json();
      } catch {
        data = { error: "Respuesta inválida del servidor" };
      }

      if (!res.ok) {
        alert(data.error || "Error al registrar");
        return;
      }

      alert(data.message || "Usuario creado correctamente");

      // limpiar formulario una vez creado correctamente
      setForm({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        phone: "",
      });
    } catch (err) {
      console.error(err);
      alert("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Registro</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={form.first_name}
          onChange={(e) => handleChange("first_name", e.target.value)}
        />

        <input
          placeholder="Apellido"
          value={form.last_name}
          onChange={(e) => handleChange("last_name", e.target.value)}
        />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
        />

        <input
          placeholder="Teléfono"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
    </div>
  );
}
*/



"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ApiResponse } from "@/lib/http/ApiResponse";

const registerSchema = z.object({
  first_name: z.string().min(1, "El nombre es obligatorio"),
  last_name: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
  phone: z.string().min(1, "El teléfono es obligatorio"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[0-9]/, "Debe incluir al menos un número")
    .regex(/[^a-zA-Z0-9]/, "Debe incluir al menos un símbolo"),
  confirmPassword: z.string().min(1, "Debes confirmar tu contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

 
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Hubo un fallo en el registro");
      }

      router.push("/login");
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || "Error de red. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const styleLines = "h-[1px] w-16 from-transparent to-[rgb(var(--color-gold))]"
  const stylesInputs = "w-full px-4 py-4 bg-[rgb(var(--color-cream)/0.05)] border border-[rgb(var(--color-cream)/0.2)] text-[rgb(var(--color-cream))] placeholder-[rgb(var(--color-cream)/0.3)] font-light text-sm focus:outline-none focus:border-[rgb(var(--color-gold))] transition-all duration-300"
  const stylesError = "text-[rgb(var(--color-terracotta))] text-xs font-light mt-1"
  const stylesLabel = "block text-xs tracking-[0.125em] uppercase text-[rgb(var(--color-cream)/0.6)] font-medium"

  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[rgb(var(--color-gold)/0.5)] to-black p-4 fontMontserrat">

        <div className="relative w-full max-w-2xl">
            <div className="flex items-center justify-center gap-3 mb-8">
                <div className={`${styleLines} bg-gradient-to-r`}></div>
                <span className="text-[rgb(var(--color-gold))] text-2xl">◆</span>
                <div className={`${styleLines} bg-gradient-to-l`}></div>
            </div>

            <div className="bg-black/90 border border-[rgb(var(--color-gold)/0.3)] p-8 sm:p-12 shadow-2xl">
                
                <div className="flex justify-center mb-8">
                    <Image
                        src="/images/login.jpg"
                        alt="Horse Trust"
                        width={260}
                        height={90}
                        priority
                        className="object-contain"
                    />
                </div>

                <header className="mb-8 text-center">
                    <h1 className="fontCormorant text-4xl font-light tracking-wide text-[rgb(var(--color-gold))] uppercase mb-3">
                        Crear Cuenta
                    </h1>
                    <p className="text-sm font-light text-[rgb(var(--color-cream)/0.7)] tracking-wide">
                        Unite a la comunidad ecuestre
                    </p>
                </header>

                {errorMsg && (
                    <div className="mb-6 p-4 bg-[rgb(var(--color-terracotta)/0.1)] border border-[rgb(var(--color-terracotta)/0.3)] flex justify-between items-start gap-4">
                        <div className="flex-1">
                            <p className="text-xs font-medium text-[rgb(var(--color-terracotta))] uppercase tracking-wider mb-1">
                                Error de Registro
                            </p>
                            <p className="text-sm text-[rgb(var(--color-cream)/0.8)] font-light leading-relaxed">
                                {errorMsg}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onSubmit(getValues())}
                            className="px-4 py-2 bg-[rgb(var(--color-terracotta))] text-[rgb(var(--color-cream))] text-xs uppercase tracking-wider hover:bg-[rgb(var(--color-gold))] hover:text-black transition-all duration-300 whitespace-nowrap"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={stylesLabel}>
                                Nombre
                            </label>
                            <input
                                {...register("first_name")}
                                placeholder="Juan"
                                className={stylesInputs}
                            />
                            {errors.first_name && (
                                <p className={stylesError}>
                                    {errors.first_name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className={stylesLabel}>
                                Apellido
                            </label>
                            <input
                                {...register("last_name")}
                                placeholder="Pérez"
                                className={stylesInputs}
                            />
                            {errors.last_name && (
                                <p className={stylesError}>
                                    {errors.last_name.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={stylesLabel}>
                            Email
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="tu@email.com"
                            className={stylesInputs}
                        />
                        {errors.email && (
                            <p className={stylesError}>
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className={stylesLabel}>
                            Teléfono
                        </label>
                        <input
                            {...register("phone")}
                            placeholder="+54 9 11 1234-5678"
                            className={stylesInputs}
                        />
                        {errors.phone && (
                            <p className={stylesError}>
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className={stylesLabel}>
                                Contraseña
                            </label>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="••••••••"
                                className={stylesInputs}
                            />
                            {errors.password && (
                                <p className="text-[rgb(var(--color-terracotta))] text-xs font-light mt-1 leading-tight">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className={stylesLabel}>
                                Confirmar
                            </label>
                            <input
                                {...register("confirmPassword")}
                                type="password"
                                placeholder="••••••••"
                                className={stylesInputs}
                            />
                            {errors.confirmPassword && (
                                <p className={stylesError}>
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 text-xs tracking-[0.1875em] uppercase font-medium transition-all duration-300 ${
                            isLoading 
                                ? "bg-[rgb(var(--color-cream)/0.2)] text-[rgb(var(--color-cream)/0.5)] cursor-not-allowed" 
                                : "bg-[rgb(var(--color-gold))] text-black hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))]"
                        }`}
                    >
                        {isLoading ? "Cargando..." : "Crear Cuenta"}
                    </button>
                </form>

                <footer className="mt-8 pt-6 border-t border-[rgb(var(--color-cream)/0.1)] text-center">
                    <p className="text-sm text-[rgb(var(--color-cream)/0.6)] font-light">
                        ¿Ya tenés cuenta?{" "}
                        <a 
                            href="/login" 
                            className="text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-cream))] transition-colors duration-300 font-medium"
                        >
                            Iniciá sesión aquí
                        </a>
                    </p>
                </footer>
            </div>

            <div className="flex items-center justify-center gap-3 mt-8">
                <div className={`${styleLines} bg-gradient-to-r`}></div>
                <span className="text-[rgb(var(--color-gold))] text-2xl">◆</span>
                <div className={`${styleLines} bg-gradient-to-l`}></div>
            </div>
        </div>
    </div>
  );
}