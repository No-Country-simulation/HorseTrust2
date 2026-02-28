"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vetExamSchema } from "@/app/horsetrust/types/horse-validator";

export default function VetExamForm({ horseId }: { horseId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(vetExamSchema),
  });

  const fetchDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    try {
      const response = await fetch(`/api/v1/horses/${horseId}/documents?category=veterinary`);
      const result = await response.json();
      if (response.ok) {
        setDocuments(result.data || []);
      }
    } catch (error) {
      console.error("Error al cargar documentos:", error);
    } finally {
      setIsLoadingDocs(false);
    }
  }, [horseId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const onSubmit = async (data: any) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", data.file[0]);
    formData.append("type", "document");      // TypeDocument.document
    formData.append("category", "veterinary"); // Category.veterinary
    
    // Ahora el Rol (propósito) es dinámico basado en la selección del usuario
    formData.append("role", data.role);        // DocumentPurpose
    
    formData.append("issuedAt", data.issuedAt); 
    formData.append("vetName", data.vetName);
    formData.append("examType", data.examType);     // ExamType
    formData.append("examResult", data.examResult); // ExamResult

    try {
      const response = await fetch(`/api/v1/horses/${horseId}/documents`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Fallo al subir");

      alert("¡Documento guardado exitosamente!");
      reset();
      fetchDocuments();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl space-y-8">
      <div className="bg-white rounded-[40px] shadow-xl p-8 border border-slate-200">
        <h2 className="text-2xl font-bold text-[#3E6259] mb-6">Gestión Veterinaria</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Información del Veterinario */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Veterinario</label>
              <input {...register("vetName")} placeholder="Dr. Nombre" className="w-full p-4 bg-slate-50 rounded-2xl border text-sm" />
              {errors.vetName && <p className="text-red-500 text-[10px] ml-2">{errors.vetName.message as string}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Fecha</label>
              <input {...register("issuedAt")} type="date" className="w-full p-4 bg-slate-50 rounded-2xl border text-sm" />
              {errors.issuedAt && <p className="text-red-500 text-[10px] ml-2">{errors.issuedAt.message as string}</p>}
            </div>
          </div>

          {/* Propósito del Documento (Enum DocumentPurpose) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Tipo de Documento</label>
            <select {...register("role")} className="w-full p-4 bg-slate-50 rounded-2xl border text-sm outline-none">
              <option value="certificate">Certificado Médico</option>
              <option value="xray">Rayos X (X-Ray)</option>
              <option value="vaccine_card">Tarjeta de Vacunación</option>
              <option value="passport">Pasaporte</option>
            </select>
          </div>

          {/* Tipo de Examen y Resultado (Enums ExamType y ExamResult) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Nivel de Examen</label>
              <select {...register("examType")} className="w-full p-4 bg-slate-50 rounded-2xl border text-sm outline-none">
                <option value="basic">Básico</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Resultado</label>
              <select {...register("examResult")} className="w-full p-4 bg-slate-50 rounded-2xl border text-sm outline-none">
                <option value="apt">Apto (Apt)</option>
                <option value="with_observations">Con Observaciones</option>
              </select>
            </div>
          </div>

          {/* Archivo */}
          <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center">
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Adjuntar PDF (Max 5MB)</p>
            <input {...register("file")} type="file" accept=".pdf" className="text-xs mx-auto" />
            {errors.file && <p className="text-red-500 text-[10px] mt-2">{errors.file.message as string}</p>}
          </div>

          <button 
            disabled={isUploading}
            className="w-full py-4 bg-[#3E6259] text-white rounded-2xl font-black text-sm tracking-widest hover:bg-[#2d4741] transition-all"
          >
            {isUploading ? "CARGANDO..." : "GUARDAR DOCUMENTO"}
          </button>
        </form>
      </div>

      {/* Historial con Badges Dinámicos */}
      <div className="bg-white rounded-[40px] shadow-lg p-8 border border-slate-100">
        <h3 className="text-lg font-bold text-[#764134] mb-4">Documentación Subida</h3>
        {isLoadingDocs ? (
          <p className="text-sm text-slate-400 text-center py-4">Cargando historial...</p>
        ) : documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-[#764134] uppercase tracking-tighter">{doc.purpose}</span>
                  <span className="text-sm font-bold text-[#3E6259]">{doc.vet_name}</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(doc.issued_at).toLocaleDateString()} • {doc.exam_type}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    doc.verified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {doc.verified ? "Verificado" : "Pendiente"}
                  </span>
                  <a href={doc.url} target="_blank" className="p-2 bg-white rounded-xl border hover:shadow-md transition-shadow">📄</a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-4">No hay documentos registrados.</p>
        )}
      </div>
    </div>
  );
}