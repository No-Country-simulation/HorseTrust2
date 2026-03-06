"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ApiResponse } from "@/lib/http/ApiResponse";
import { SessionUser, useSession } from "@/store/authSession";

const loginSchema = z.object({
    email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
    password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const router = useRouter();
    const setUser = useSession((state) => state.setUser);

    const { register, handleSubmit, formState: { errors }, getValues } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
    });


    const onSubmit = async (data: LoginValues) => {
        setIsLoading(true);
        setErrorMsg(null);

        try {
            const res = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result: ApiResponse<SessionUser> = await res.json();

            if (!res.ok || !result.ok) {
                throw new Error(result.message);
            }
            setUser(result.data!);
            router.push("/");
            router.refresh(); // actualiza el estado del servidor
        } catch (err: unknown) {
            setErrorMsg((err as Error).message || "Error de red. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const styleLines = "h-[1px] w-16 from-transparent to-[rgb(var(--color-gold))]"

    return (
         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[rgb(var(--color-teal)/0.5)] to-black p-4 fontMontserrat">
            

            <div className="relative w-full max-w-md">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className={`${styleLines} bg-gradient-to-r`}></div>
                    <span className="text-[rgb(var(--color-gold))] text-2xl">◆</span>
                    <div className={`${styleLines} bg-gradient-to-l`}></div>
                </div>

                <div className="bg-black/90 border border-[rgb(var(--color-gold)/0.3)] p-8 sm:p-12 shadow-2xl">
                    
                    <div className="flex justify-center mb-8">
                        <Image
                            src="/images/login.jpg"
                            alt="Elite Equestrian"
                            width={240}
                            height={100}
                            priority
                            className="object-contain"
                        />
                    </div>

                    <header className="mb-8 text-center">
                        <h1 className="fontCormorant text-4xl font-light tracking-wide text-[rgb(var(--color-gold))] uppercase mb-3">
                            Bienvenido
                        </h1>
                        <p className="text-sm font-light text-[rgb(var(--color-cream)/0.7)] tracking-wide">
                            Ingresá a tu cuenta para continuar
                        </p>
                    </header>

                    {errorMsg && (
                        <div className="mb-6 p-4 bg-[rgb(var(--color-terracotta)/0.1)] border border-[rgb(var(--color-terracotta)/0.3)] flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <p className="text-xs font-medium text-[rgb(var(--color-terracotta))] uppercase tracking-wider mb-1">
                                    Error de Acceso
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
                        
                        <div className="space-y-2">
                            <label className="block text-xs tracking-[0.125em] uppercase text-[rgb(var(--color-cream)/0.6)] font-medium">
                                Email
                            </label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="tu@email.com"
                                className="w-full px-4 py-4 bg-[rgb(var(--color-cream)/0.05)] border border-[rgb(var(--color-cream)/0.2)] text-[rgb(var(--color-cream))] placeholder-[rgb(var(--color-cream)/0.3)] font-light text-sm focus:outline-none focus:border-[rgb(var(--color-gold))] transition-all duration-300"
                            />
                            {errors.email && (
                                <p className="text-[rgb(var(--color-terracotta))] text-xs font-light mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs tracking-[0.125em] uppercase text-[rgb(var(--color-cream)/0.6)] font-medium">
                                Contraseña
                            </label>
                            <input
                                {...register("password")}
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-4 bg-[rgb(var(--color-cream)/0.05)] border border-[rgb(var(--color-cream)/0.2)] text-[rgb(var(--color-cream))] placeholder-[rgb(var(--color-cream)/0.3)] font-light text-sm focus:outline-none focus:border-[rgb(var(--color-gold))] transition-all duration-300"
                            />
                            {errors.password && (
                                <p className="text-[rgb(var(--color-terracotta))] text-xs font-light mt-1">
                                    {errors.password.message}
                                </p>
                            )}
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
                            {isLoading ? "Conectando..." : "Iniciar Sesión"}
                        </button>
                    </form>

                    <section className="mt-8 pt-6 border-t border-[rgb(var(--color-cream)/0.1)] text-center">
                        <p className="text-sm text-[rgb(var(--color-cream)/0.6)] font-light">
                            ¿No tenés cuenta?{" "}
                            <a 
                                href="/register" 
                                className="text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-cream))] transition-colors duration-300 font-medium"
                            >
                                Registrate aquí
                            </a>
                        </p>
                    </section>
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