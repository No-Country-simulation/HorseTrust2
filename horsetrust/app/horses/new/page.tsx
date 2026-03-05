"use client"

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Sex, Discipline, Category, DocumentPurpose } from "@/lib/database/enums";
import { sexLabel, disciplineLabel, categoryLabel, documentPurposeLabel } from "@/lib/translations/enums";

const horseSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    age: z.number().min(0, "Edad inválida"),
    breed: z.string().min(1, "La raza es obligatoria"),
    price: z.number().optional(),
    sex: z.nativeEnum(Sex),
    discipline: z.nativeEnum(Discipline),
});

type HorseValues = z.infer<typeof horseSchema>;

export default function NewHorsePage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [createdHorseId, setCreatedHorseId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState<string | null>(null);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const { register, handleSubmit, formState: { errors }, reset } = useForm<HorseValues>({
        resolver: zodResolver(horseSchema),
    });

    const onSubmit = async (data: HorseValues) => {
        setIsLoading(true);
        setErrorMsg(null);
        try {
            const res = await fetch('/api/v1/horses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (!res.ok || !json.ok) {
                throw new Error(json.message || 'Error al crear caballo');
            }
            setCreatedHorseId(json.data.id);
            reset();
        } catch (err: unknown) {
            setErrorMsg((err as Error).message || 'Error de red');
        } finally {
            setIsLoading(false);
        }
    };

    // Document upload handler
    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!createdHorseId) return;
        const form = e.currentTarget;
        const fd = new FormData(form);
        const file = fd.get('file') as File | null;
        if (file) {
            const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
            const videoExts = ['mp4', 'avi', 'mov', 'webm', 'mkv'];
            const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
            const detectedType = videoExts.includes(ext) ? 'video' : imageExts.includes(ext) ? 'image' : 'document';
            fd.append('type', detectedType);
        }
        setUploading(true);
        setUploadMsg(null);
        try {
            const res = await fetch(`/api/v1/horses/${createdHorseId}/documents`, {
                method: 'POST',
                body: fd,
                credentials: 'include',
            });
            const json = await res.json();
            if (!res.ok || !json.ok) {
                throw new Error(json.message || 'Error subiendo documento');
            }
            setUploadMsg('Documento subido. Pendiente de verificación.');
            // reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
                setSelectedFileName(null);
            }
        } catch (err: unknown) {
            setUploadMsg((err as Error).message || 'Error de red al subir');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = () => {
        if (fileInputRef.current && fileInputRef.current.files?.[0]) {
            setSelectedFileName(fileInputRef.current.files[0].name);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#000000] p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                <h2 className="text-3xl fontCormorant text-[rgb(var(--color-terracota))] mb-6 text-center">Registrar Caballo</h2>

                {!createdHorseId ? (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <input {...register('name')} placeholder="Nombre" className="w-full p-4 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#B5BA72] outline-none text-sm" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <input {...register('age', { valueAsNumber: true })} type="number" placeholder="Edad" className="w-full p-4 bg-white border border-slate-300 rounded-2xl" />
                                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
                            </div>
                            <div>
                                <select {...register('sex')} className="w-full p-4 bg-white border border-slate-300 rounded-2xl">
                                    <option value="">Sexo</option>
                                    {Object.values(Sex).map(s => <option key={s} value={s}>{sexLabel[s]}</option>)}
                                </select>
                                {errors.sex && <p className="text-red-500 text-xs mt-1">{errors.sex.message}</p>}
                            </div>
                        </div>

                        <div>
                            <select {...register('breed')} className="w-full p-4 bg-white border border-slate-300 rounded-2xl">
                                <option value="">Seleccionar raza...</option>
                                {['Pura Sangre','Cuarto de Milla','Árabe','Appaloosa','Paso Fino','Frisón','Andaluz','Lusitano','Hannoveriano','Holsteiner','Criollo','Percherón','Mustang','Morgan','Tennessee Walker','Thoroughbred','Paint Horse','Palomino','Pinto','Otra'].map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            {errors.breed && <p className="text-red-500 text-xs mt-1">{errors.breed.message}</p>}
                        </div>

                        <div>
                            <select {...register('discipline')} className="w-full p-4 bg-white border border-slate-300 rounded-2xl">
                                <option value="">Disciplina</option>
                                {Object.values(Discipline).map(d => <option key={d} value={d}>{disciplineLabel[d]}</option>)}
                            </select>
                            {errors.discipline && <p className="text-red-500 text-xs mt-1">{errors.discipline.message}</p>}
                        </div>

                        <div>
                            <input {...register('price', { valueAsNumber: true })} type="number" placeholder="Precio (opcional)" className="w-full p-4 bg-white border border-slate-300 rounded-2xl" />
                        </div>

                        {errorMsg && <div className="p-3 bg-red-50 text-red-700 rounded-md">{errorMsg}</div>}

                        <div className="flex gap-4">
                            <button type="submit" disabled={isLoading} className={`px-6 py-3 rounded-2xl text-white font-black ${isLoading ? 'bg-slate-400' : 'bg-[rgb(var(--color-teal))] hover:bg-[rgb(var(--color-gold))]'}`}>
                                {isLoading ? 'Creando...' : 'Crear Caballo'}
                            </button>
                            <button type="button" onClick={() => router.push('/me')} className="px-6 py-3 rounded-2xl border">Cancelar</button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 text-green-800 rounded-md">Caballo creado exitosamente. ID: {createdHorseId}</div>

                        <form onSubmit={handleUpload} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-3 text-[rgb(var(--color-terracota))]">Seleccionar Archivo</label>
                                <input
                                    ref={fileInputRef}
                                    name="file"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <div className="flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full px-6 py-3 bg-[rgb(var(--color-gold))] text-black fontMontserrat text-sm uppercase tracking-wide rounded-2xl hover:bg-[rgb(var(--color-terracota))] hover:text-white transition-all duration-300 font-black"
                                    >
                                        Elegir Archivo
                                    </button>
                                    {selectedFileName && (
                                        <p className="text-sm text-[rgb(var(--color-teal))] font-medium">
                                            Archivo: <span className="font-semibold">{selectedFileName}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <select name="category" className="w-full p-3 border rounded-2xl" onChange={(e) => setSelectedCategory(e.target.value)}>
                                    <option value="">Categoría</option>
                                    {Object.values(Category).map(c => <option key={c} value={c}>{categoryLabel[c]}</option>)}
                                </select>
                            </div>

                            <div>
                                <select name="role" className="p-3 border rounded-2xl">
                                    <option value="">Rol (purpose)</option>
                                    {Object.values(DocumentPurpose).map(p => <option key={p} value={p}>{documentPurposeLabel[p]}</option>)}
                                </select>
                            </div>

                            {selectedCategory === Category.veterinary && (
                                <div className="space-y-3 p-4 border border-slate-300 rounded-2xl">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Fecha del examen</label>
                                        <input type="date" name="issuedAt" className="w-full p-3 border border-slate-300 rounded-2xl" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Nombre del veterinario</label>
                                        <input type="text" name="vetName" className="w-full p-3 border border-slate-300 rounded-2xl" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Tipo de examen</label>
                                            <select name="examType" className="w-full p-3 border border-slate-300 rounded-2xl">
                                                <option value="basic">Básico</option>
                                                <option value="advanced">Avanzado</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Resultado</label>
                                            <select name="examResult" className="w-full p-3 border border-slate-300 rounded-2xl">
                                                <option value="apt">Apto</option>
                                                <option value="with_observations">Con Observaciones</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {uploadMsg && <div className="p-3 rounded-md bg-slate-50">{uploadMsg}</div>}

                            <div className="flex gap-3">
                                <button type="submit" disabled={uploading} className={`px-6 py-3 rounded-2xl text-white font-black ${uploading ? 'bg-slate-400' : 'bg-[rgb(var(--color-teal))]'}`}>
                                    {uploading ? 'Subiendo...' : 'Subir Documento'}
                                </button>

                                <button type="button" onClick={() => router.push('/me')} className="px-6 py-3 rounded-2xl border">Volver al Perfil</button>
                            </div>
                        </form>

                    </div>
                )}
            </div>
        </div>
    );
}
