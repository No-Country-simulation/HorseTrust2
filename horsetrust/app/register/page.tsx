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

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Error al registrar");
      router.push("/login");
    } catch (err: any) {
      setErrorMsg(err.message || "Error de red. Inténtalo de nuevo.");
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
          
          <h2 className="text-3xl font-bold text-[#3E6259] tracking-tight">Crear Cuenta</h2>
          <p className="text-[#764134] text-sm font-semibold mt-1">Bienvenido a la comunidad ecuestre</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
           
            <input {...register("first_name")} placeholder="Nombre" className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#B5BA72] text-slate-900 placeholder:text-slate-400 outline-none transition-all text-sm" />
            <input {...register("last_name")} placeholder="Apellido" className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#B5BA72] text-slate-900 placeholder:text-slate-400 outline-none transition-all text-sm" />
          </div>

          <input {...register("email")} type="email" placeholder="Correo electrónico" className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#B5BA72] text-slate-900 outline-none text-sm" />
          
          <input {...register("phone")} placeholder="Teléfono" className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#B5BA72] text-slate-900 outline-none text-sm" />

          <div className="grid grid-cols-2 gap-3">
            <input {...register("password")} type="password" placeholder="Contraseña" className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#B5BA72] text-slate-900 outline-none text-sm" />
            <input {...register("confirmPassword")} type="password" placeholder="Confirmar" className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#B5BA72] text-slate-900 outline-none text-sm" />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl text-white font-black text-sm tracking-widest transition-all shadow-lg active:scale-95 ${
              isLoading ? "bg-slate-400" : "bg-[#3E6259] hover:bg-[#2d4741]"
            }`}
          >
            {isLoading ? "CARGANDO..." : "REGISTRARSE"}
          </button>
        </form>

        <footer className="mt-8 text-center">
          <p className="text-xs text-slate-500 font-medium">
            ¿Ya eres miembro? <a href="/login" className="text-[#764134] font-bold hover:underline">Inicia sesión aquí</a>
          </p>
        </footer>
      </div>
    </div>
  );
}