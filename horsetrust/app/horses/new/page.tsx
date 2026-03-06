"use client"

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Sex, Discipline, Category, DocumentPurpose } from "@/lib/database/enums";
import { sexLabel, disciplineLabel, categoryLabel, documentPurposeLabel } from "@/lib/translations/enums";
import {RefreshCw, FileCheck, Check } from "lucide-react"

const horseSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    age: z.number().min(0, "Edad inválida"),
    breed: z.string().min(1, "La raza es obligatoria"),
    price: z.number().optional(),
    color: z.string().min(1, "El color es obligatorio"),
    height: z.number().min(0, "Altura inválida"),
    description: z.string().max(500, "Máximo 500 caracteres").optional(),
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

    const styleLines = "h-[1px] w-16 from-transparent to-[rgb(var(--color-gold))]"
    const styleInput = "w-full px-4 py-4 bg-[rgb(var(--color-cream)/0.05)] border border-[rgb(var(--color-cream)/0.2)] text-[rgb(var(--color-cream))] placeholder-[rgb(var(--color-cream)/0.3)] font-light text-sm focus:outline-none focus:border-[rgb(var(--color-gold))] transition-all duration-300"
    const styleError = "text-[rgb(var(--color-terracotta))] text-xs font-light mt-1"
    const styleLabel = "block text-xs tracking-[0.125em] uppercase text-[rgb(var(--color-gold))] font-medium"
    const styleSelect = "w-full px-4 py-4 bg-[rgb(var(--color-cream)/0.05)] border border-[rgb(var(--color-cream)/0.2)] text-[rgb(var(--color-cream))] font-light text-sm focus:outline-none focus:border-[rgb(var(--color-gold))] transition-all duration-300 cursor-pointer appearance-none"

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black/50 via-[rgb(var(--color-terracota)/0.7)] to-black/50 p-4 sm:p-6 fontMontserrat">

            <div className="relative w-full max-w-3xl">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className={`${styleLines} bg-gradient-to-r`}></div>
                    <span className="text-[rgb(var(--color-gold))] text-2xl">◆</span>
                    <div className={`${styleLines} bg-gradient-to-l`}></div>
                </div>

                <div className="bg-black/30 border border-[rgb(var(--color-gold)/0.3)] p-8 sm:p-12 shadow-2xl">
                    
                    <header className="mb-10 text-center">
                        <h1 className="fontCormorant text-4xl sm:text-5xl font-light tracking-wide text-[rgb(var(--color-gold))] uppercase mb-3">
                            Registrar Caballo
                        </h1>
                        <p className="text-sm font-light text-[rgb(var(--color-cream)/0.7)] tracking-wide">
                            Completá los datos de tu ejemplar
                        </p>
                    </header>

                    {!createdHorseId ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className={styleLabel}>
                                    Nombre del Caballo *
                                </label>
                                <input 
                                    {...register('name')} 
                                    placeholder="Ejemplo: Thunder"
                                    className={styleInput} 
                                />
                                {errors.name && <p className={styleError}>{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className={styleLabel}>
                                        Edad *
                                    </label>
                                    <input 
                                        {...register('age', { valueAsNumber: true })} 
                                        type="number" 
                                        placeholder="5"
                                        className={styleInput} 
                                    />
                                    {errors.age && <p className={styleError}>{errors.age.message}</p>}
                                </div>
                                
                                <div className="space-y-2">
                                    <label className={styleLabel}>
                                        Sexo *
                                    </label>
                                    <select 
                                        {...register('sex')} 
                                        className={styleSelect}
                                    >
                                        <option value="" className="bg-black">Seleccionar...</option>
                                        {Object.values(Sex).map(s => <option key={s} value={s} className="bg-black">{sexLabel[s]}</option>)}
                                    </select>
                                    {errors.sex && <p className={styleError}>{errors.sex.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={styleLabel}>
                                    Raza *
                                </label>
                                <select 
                                    {...register('breed')} 
                                    className={styleSelect}
                                >
                                    <option value="" className="bg-black">Seleccionar raza...</option>
                                    {['Pura Sangre','Cuarto de Milla','Árabe','Appaloosa','Paso Fino','Frisón','Andaluz','Lusitano','Hannoveriano','Holsteiner','Criollo','Percherón','Mustang','Morgan','Tennessee Walker','Thoroughbred','Paint Horse','Palomino','Pinto','Otra'].map(b => 
                                        <option key={b} value={b} className="bg-black">{b}</option>
                                    )}
                                </select>
                                {errors.breed && <p className={styleError}>{errors.breed.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                <div className="space-y-2">
                                    <label className={styleLabel}>
                                        Color *
                                    </label>
                                    <input
                                        {...register('color')}
                                        placeholder="Ejemplo: Alazán"
                                        className={styleInput}
                                    />
                                    {errors.color && <p className={styleError}>{errors.color.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className={styleLabel}>
                                        Altura (cm) *
                                    </label>
                                    <input
                                        {...register('height', { valueAsNumber: true })}
                                        type="number"
                                        placeholder="165"
                                        className={styleInput}
                                    />
                                    {errors.height && <p className={styleError}>{errors.height.message}</p>}
                                </div>

                            </div>


                            <div className="space-y-2">
                                <label className={styleLabel}>
                                    Disciplina *
                                </label>
                                <select 
                                    {...register('discipline')} 
                                    className={styleSelect}
                                >
                                    <option value="" className="bg-black">Seleccionar disciplina...</option>
                                    {Object.values(Discipline).map(d => <option key={d} value={d} className="bg-black">{disciplineLabel[d]}</option>)}
                                </select>
                                {errors.discipline && <p className={styleError}>{errors.discipline.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className={styleLabel}>
                                    Precio <span className="text-[rgb(var(--color-cream)/0.5)]">(Opcional)</span>
                                </label>
                                <input 
                                    {...register('price', { valueAsNumber: true })} 
                                    type="number" 
                                    placeholder="85000"
                                    className={styleInput} 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className={styleLabel}>
                                    Descripción
                                </label>

                                <textarea
                                    {...register('description')}
                                    rows={4}
                                    placeholder="Descripción del caballo, temperamento, entrenamiento, etc."
                                    className={`${styleInput} resize-none`}
                                />

                                {errors.description && (
                                    <p className={styleError}>{errors.description.message}</p>
                                )}
                            </div>

                            {errorMsg && (
                                <div className="p-4 bg-[rgb(var(--color-terracotta)/0.1)] border border-[rgb(var(--color-terracotta)/0.3)]">
                                    <p className="text-sm text-[rgb(var(--color-cream)/0.8)] font-light">{errorMsg}</p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button 
                                    type="submit" 
                                    disabled={isLoading} 
                                    className={`flex-1 px-8 py-4 text-xs tracking-[0.125em] uppercase font-medium transition-all duration-300 ${
                                        isLoading 
                                            ? 'bg-[rgb(var(--color-cream)/0.2)] text-[rgb(var(--color-cream)/0.5)] cursor-not-allowed' 
                                            : 'bg-[rgb(var(--color-gold))] text-black hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))]'
                                    }`}
                                >
                                    {isLoading ? 'Creando...' : 'Crear Caballo'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => router.push('/me')} 
                                    className="flex-1 px-8 py-4 bg-transparent border border-[rgb(var(--color-cream)/0.3)] text-[rgb(var(--color-cream))] text-xs tracking-[0.125em] uppercase hover:border-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold))] transition-all duration-300 font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="fotnMontserrat space-y-8">
                            <div className="fontMontserrat p-6 flex flex-col items-center justify-center bg-[rgb(var(--color-teal)/0.2)] border border-[rgb(var(--color-teal)/0.4)] text-center">
                                <Check width={70} height={70} className="text-10xl mb-3 text-[rgb(var(--color-gold))]" />
                                <p className="text-[rgb(var(--color-cream))] font-medium mb-2">Caballo creado exitosamente</p>
                                <p className="text-[rgb(var(--color-cream)/0.6)] text-xs">ID: {createdHorseId}</p>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-6">
                                <div className="text-center mb-6">
                                    <h3 className="fontCormorant text-2xl text-[rgb(var(--color-gold))] uppercase tracking-wide mb-2">
                                        Subir Documentación
                                    </h3>
                                    <p className="text-sm text-[rgb(var(--color-cream)/0.6)] font-light">
                                        Agregá certificados y documentos del caballo
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <label className={styleLabel}>
                                        Archivo
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        name="file"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center justify-center gap-6 w-full px-6 py-4 bg-[rgb(var(--color-cream)/0.05)] border-2 border-dashed border-[rgb(var(--color-gold)/0.4)] text-[rgb(var(--color-gold))] text-sm uppercase tracking-wide hover:border-[rgb(var(--color-gold))] hover:bg-[rgb(var(--color-gold)/0.1)] transition-all duration-300 font-medium"
                                    >
                                        {selectedFileName ? (
                                            <>
                                                <RefreshCw width={60} height={60} className="w-6 h-6 " />
                                                Cambiar archivo
                                            </>
                                            ) : (
                                            <>
                                                <FileCheck width={60} height={60}  className="w-6 h-6 " />
                                                Seleccionar archivo
                                            </>
                                        )}

                                    </button>
                                    {selectedFileName && (
                                        <p className="text-sm text-[rgb(var(--color-cream)/0.8)] font-light">
                                            Seleccionado: <span className="text-[rgb(var(--color-gold))]">{selectedFileName}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className={styleLabel}>
                                        Categoría
                                    </label>
                                    <select 
                                        name="category" 
                                        className={styleSelect} 
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="" className="bg-black">Seleccionar categoría...</option>
                                        {Object.values(Category).map(c => <option key={c} value={c} className="bg-black">{categoryLabel[c]}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className={styleLabel}>
                                        Propósito
                                    </label>
                                    <select 
                                        name="role" 
                                        className={styleSelect}
                                    >
                                        <option value="" className="bg-black">Seleccionar propósito...</option>
                                        {Object.values(DocumentPurpose).map(p => <option key={p} value={p} className="bg-black">{documentPurposeLabel[p]}</option>)}
                                    </select>
                                </div>

                                {selectedCategory === Category.veterinary && (
                                    <div className="space-y-4 p-6 bg-[rgb(var(--color-teal)/0.1)] border border-[rgb(var(--color-teal)/0.3)]">
                                        <h4 className="text-sm uppercase tracking-wider text-[rgb(var(--color-teal))] font-medium mb-4">
                                            Detalles Veterinarios
                                        </h4>
                                        
                                        <div className="space-y-2">
                                            <label className="block text-xs tracking-[0.125em] uppercase text-[rgb(var(--color-cream)/0.7)] font-medium">
                                                Fecha del Examen
                                            </label>
                                            <input 
                                                type="date" 
                                                name="issuedAt" 
                                                className="w-full px-4 py-3 bg-[rgb(var(--color-cream)/0.05)] border border-[rgb(var(--color-cream)/0.2)] text-[rgb(var(--color-cream))] font-light text-sm focus:outline-none focus:border-[rgb(var(--color-gold))] transition-all duration-300" 
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="block text-xs tracking-[0.125em] uppercase text-[rgb(var(--color-cream)/0.7)] font-medium">
                                                Nombre del Veterinario
                                            </label>
                                            <input 
                                                type="text" 
                                                name="vetName" 
                                                placeholder="Dr. Juan Pérez"
                                                className="w-full px-4 py-3 bg-[rgb(var(--color-cream)/0.05)] border border-[rgb(var(--color-cream)/0.2)] text-[rgb(var(--color-cream))] placeholder-[rgb(var(--color-cream)/0.3)] font-light text-sm focus:outline-none focus:border-[rgb(var(--color-gold))] transition-all duration-300" 
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="block text-xs tracking-[0.125em] uppercase text-[rgb(var(--color-cream)/0.7)] font-medium">
                                                    Tipo de Examen
                                                </label>
                                                <select 
                                                    name="examType" 
                                                    className="w-full px-4 py-3 bg-[rgb(var(--color-cream)/0.05)] border border-[rgb(var(--color-cream)/0.2)] text-[rgb(var(--color-cream))] font-light text-sm focus:outline-none focus:border-[rgb(var(--color-gold))] transition-all duration-300 cursor-pointer appearance-none"
                                                >
                                                    <option value="basic" className="bg-black">Básico</option>
                                                    <option value="advanced" className="bg-black">Avanzado</option>
                                                </select>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="block text-xs tracking-[0.125em] uppercase text-[rgb(var(--color-cream)/0.7)] font-medium">
                                                    Resultado
                                                </label>
                                                <select 
                                                    name="examResult" 
                                                    className="w-full px-4 py-3 bg-[rgb(var(--color-cream)/0.05)] border border-[rgb(var(--color-cream)/0.2)] text-[rgb(var(--color-cream))] font-light text-sm focus:outline-none focus:border-[rgb(var(--color-gold))] transition-all duration-300 cursor-pointer appearance-none"
                                                >
                                                    <option value="apt" className="bg-black">Apto</option>
                                                    <option value="with_observations" className="bg-black">Con Observaciones</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {uploadMsg && (
                                    <div className="p-4 bg-[rgb(var(--color-cream)/0.05)] border border-[rgb(var(--color-cream)/0.2)]">
                                        <p className="text-sm text-[rgb(var(--color-cream)/0.8)] font-light">{uploadMsg}</p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button 
                                        type="submit" 
                                        disabled={uploading} 
                                        className={`flex-1 px-8 py-4 text-xs tracking-[0.125em] uppercase font-medium transition-all duration-300 ${
                                            uploading 
                                                ? 'bg-[rgb(var(--color-cream)/0.2)] text-[rgb(var(--color-cream)/0.5)] cursor-not-allowed' 
                                                : 'bg-[rgb(var(--color-gold))] text-black hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))]'
                                        }`}
                                    >
                                        {uploading ? 'Subiendo...' : 'Subir Documento'}
                                    </button>

                                    <button 
                                        type="button" 
                                        onClick={() => router.push('/me')} 
                                        className="flex-1 px-8 py-4 bg-transparent border border-[rgb(var(--color-cream)/0.3)] text-[rgb(var(--color-cream))] text-xs tracking-[0.125em] uppercase hover:border-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold))] transition-all duration-300 font-medium"
                                    >
                                        Volver al Perfil
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
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
