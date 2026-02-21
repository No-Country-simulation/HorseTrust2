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

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#764134] p-6">
            <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 border border-slate-300">

                <header className="mb-8 text-center">
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/logo.jpg"
                            alt="HorseTrust Logo"
                            width={200}
                            height={100}
                            priority
                            className="object-contain"
                        />
                    </div>
                    <h2 className="text-3xl font-bold text-[#3E6259] tracking-tight">Iniciar Sesión</h2>
                    <p className="text-[#764134] text-sm font-semibold mt-1">Gestiona tus ejemplares de HorseTrust</p>
                </header>

                {errorMsg && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex justify-between items-center animate-in fade-in duration-300">
                        <div>
                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Error de Acceso</p>
                            <p className="text-xs text-red-800 font-medium leading-tight">{errorMsg}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onSubmit(getValues())}
                            className="ml-4 bg-[#764134] text-white text-[10px] font-black px-3 py-2 rounded-lg hover:bg-[#5a3128] transition-all"
                        >
                            REINTENTAR
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div className="space-y-1">
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Correo electrónico"
                            className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#B5BA72] text-slate-900 outline-none text-sm"
                        />
                        {errors.email && <p className="text-red-500 text-[10px] ml-1">{errors.email.message}</p>}
                    </div>


                    <div className="space-y-1">
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="Contraseña"
                            className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#B5BA72] text-slate-900 outline-none text-sm"
                        />
                        {errors.password && <p className="text-red-500 text-[10px] ml-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-2xl text-white font-black text-sm tracking-widest transition-all shadow-lg active:scale-95 ${isLoading ? "bg-slate-400" : "bg-[#3E6259] hover:bg-[#2d4741]"
                            }`}
                    >
                        {isLoading ? "CONECTANDO..." : "ENTRAR"}
                    </button>
                </form>

                <footer className="mt-8 text-center">
                    <p className="text-xs text-slate-500 font-medium">
                        ¿Aún no tienes cuenta? <a href="/register" className="text-[#764134] font-bold hover:underline">Regístrate aquí</a>
                    </p>
                </footer>
            </div>
        </div>
    );
}