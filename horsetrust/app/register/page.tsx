"use client";

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
