"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";

// Esquema de validación para Login
const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

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

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Credenciales incorrectas");
      }

      // Éxito: Redirigir al Dashboard principal
      router.push("/dashboard"); 
    } catch (err: any) {
      setErrorMsg(err.message || "Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#764134] p-6">
      
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl p-10 border border-white/20">
        
        <header className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo.jpg" 
              alt="HorseTrust Logo"
              width={180}
              height={90}
              priority
              className="object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-[#3E6259] tracking-tight">Iniciar Sesión</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Accede a tu panel de HorseTrust</p>
        </header>

        {/* Alerta de Error con botón Reintentar */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex justify-between items-center animate-in fade-in duration-300">
            <div className="flex-1">
              <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Fallo de acceso</p>
              <p className="text-sm text-red-800 font-medium">{errorMsg}</p>
            </div>
            <button 
              type="button"
              onClick={() => onSubmit(getValues())} 
              className="ml-4 bg-[#764134] text-white text-[10px] font-black px-3 py-2 rounded-lg hover:opacity-90 transition-all active:scale-95"
            >
              REINTENTAR
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Correo electrónico</label>
            <div className="relative">
              <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
              <input 
                {...register("email")} 
                type="email" 
                placeholder="usuario@email.com" 
                className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#B5BA72] outline-none text-slate-900 text-sm transition-all" 
              />
            </div>
            {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 ml-1">Contraseña</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
              <input 
                {...register("password")} 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-12 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#B5BA72] outline-none text-slate-900 text-sm transition-all" 
              />
            </div>
            {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl text-white font-black text-sm tracking-widest shadow-lg transition-all active:scale-95 ${
              isLoading ? "bg-slate-300 cursor-not-allowed" : "bg-[#3E6259] hover:bg-[#2d4741]"
            }`}
          >
            {isLoading ? "CARGANDO..." : "INGRESAR"}
          </button>
        </form>

        <footer className="mt-8 text-center">
          <p className="text-xs text-slate-400 font-medium">
            ¿No tienes una cuenta? <Link href="/register" className="text-[#764134] font-black hover:underline">Regístrate aquí</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}