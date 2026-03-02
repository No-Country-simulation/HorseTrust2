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
      if (response.ok) setDocuments(result.data || []);
    } catch (error) {
      console.error("Error cargando documentos:", error);
    } finally {
      setIsLoadingDocs(false);
    }
  }, [horseId]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const onSubmit = async (data: any) => {
    setIsUploading(true);
    const file = data.file[0];
    const formData = new FormData();
    
    formData.append("file", file);
    formData.append("category", "veterinary");
    formData.append("role", data.role);
    formData.append("issuedAt", data.issuedAt); 
    formData.append("vetName", data.vetName);
    formData.append("examType", data.examType);     
    formData.append("examResult", data.examResult); 

    let fileType = "document"; 
    if (file.type.startsWith("image/")) fileType = "image";
    else if (file.type.startsWith("video/")) fileType = "video";
    formData.append("type", fileType); 

    try {
      const response = await fetch(`/api/v1/horses/${horseId}/documents`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Fallo al subir archivo");
      
      alert("¡Documento guardado con éxito!");
      reset();
      fetchDocuments();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl space-y-6">
      <div className="bg-white rounded-[32px] shadow-xl p-8 border border-slate-200">
        <h2 className="text-xl font-bold text-[#3E6259] mb-6 tracking-tight">Gestión Veterinaria Multimedia</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <input {...register("vetName")} placeholder="Veterinario" className="w-full p-3 bg-slate-50 rounded-xl border text-sm" />
              {errors.vetName && <p className="text-red-500 text-[10px] ml-1">{errors.vetName.message as string}</p>}
            </div>
            <div className="space-y-1">
              <input {...register("issuedAt")} type="date" className="w-full p-3 bg-slate-50 rounded-xl border text-sm" />
              {errors.issuedAt && <p className="text-red-500 text-[10px] ml-1">{errors.issuedAt.message as string}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <select {...register("role")} className="w-full p-3 bg-slate-50 rounded-xl border text-sm outline-none">
              <option value="certificate">Certificado Médico</option>
              <option value="xray">Rayos X / Placas</option>
              <option value="vaccine_card">Tarjeta de Vacunación</option>
              <option value="passport">Pasaporte</option>
            </select>
            {errors.role && <p className="text-red-500 text-[10px] ml-1">{errors.role.message as string}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select {...register("examType")} className="p-3 bg-slate-50 rounded-xl border text-sm">
              <option value="basic">Examen Básico</option>
              <option value="advanced">Examen Avanzado</option>
            </select>
            <select {...register("examResult")} className="p-3 bg-slate-50 rounded-xl border text-sm">
              <option value="apt">Caballo Apto</option>
              <option value="with_observations">Con Observaciones</option>
            </select>
          </div>

          <div className="p-4 border-2 border-dashed rounded-xl bg-slate-50/50 text-center group hover:bg-slate-50 transition-colors">
            <input {...register("file")} type="file" accept="image/*,video/*,.pdf,.doc,.docx" className="text-xs cursor-pointer" />
            {errors.file && <p className="text-red-500 text-[10px] mt-2 font-bold">{errors.file.message as string}</p>}
          </div>

          <button 
            disabled={isUploading} 
            className="w-full py-4 bg-[#3E6259] text-white rounded-2xl font-black text-xs tracking-widest shadow-lg hover:bg-[#2d4741] active:scale-95 transition-all disabled:bg-slate-300"
          >
            {isUploading ? "PROCESANDO..." : "GUARDAR EN EXPEDIENTE"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[32px] shadow-md p-6 border border-slate-100">
        <h3 className="font-bold text-[#764134] mb-4 flex items-center gap-2">
          <span>Expediente de Salud</span>
          <span className="text-[10px] bg-slate-100 px-2 rounded text-slate-400">{documents.length}</span>
        </h3>
        
        <div className="space-y-2">
          {isLoadingDocs ? (
            <p className="text-xs text-slate-400 text-center py-4">Sincronizando...</p>
          ) : documents.length > 0 ? (
            documents.map((doc) => (
              <div key={doc.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-[#3E6259] uppercase tracking-tighter">{doc.type} - {doc.purpose}</span>
                  <span className="text-sm font-bold text-slate-700">{doc.vet_name}</span>
                  {/* [SOLUCIÓN] Convertimos Date a string para evitar el error de ReactNode */}
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    {new Date(doc.issued_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${doc.verified ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {doc.verified ? 'OK' : 'PND'}
                  </span>
                  <a href={doc.url} target="_blank" className="p-2 bg-white rounded-lg border text-xs shadow-sm">👁️</a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-slate-300 text-center py-2 italic">Sin documentos registrados aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}