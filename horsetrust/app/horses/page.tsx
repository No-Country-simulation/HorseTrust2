"use client";

import VetExamForm from "@/app/components/horses/VetExamForm";

export default function HorsesPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado de la página */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-[#764134] tracking-tight">
            Gestión de Ejemplares
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Completa la información técnica para aumentar la confianza de los compradores.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna de información (puedes añadir más contenido aquí luego) */}
          <div className="lg:col-span-1">
            <div className="bg-[#3E6259] p-6 rounded-[32px] text-white shadow-lg">
              <h2 className="text-xl font-bold mb-4">Importancia del PPE</h2>
              <p className="text-sm opacity-90 leading-relaxed">
                El Pre-Purchase Exam (PPE) es el documento más solicitado por compradores serios. 
                Asegúrate de que el PDF sea legible y esté firmado por un veterinario colegiado.
              </p>
            </div>
          </div>

          {/* Columna del Formulario */}
          <div className="lg:col-span-2">
            <VetExamForm horseId="b3f18e4e-5af2-4ab5-8d87-c8233cdd554c" />
          </div>
        </div>
      </div>
    </main>
  );
}