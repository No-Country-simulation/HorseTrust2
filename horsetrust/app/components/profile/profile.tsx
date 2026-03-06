'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContainerCardGallery from "../gallery/ContainerCardGallery";
import { LiaHorseHeadSolid } from "react-icons/lia";

interface User {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    avatar_url?: string;
}

interface FormDataType {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    avatar_url: string;
}

interface ProfileProps {
    user: User;
    onUpdate: (updatedUser: User) => void;
}

export default function Profile({ user, onUpdate }: ProfileProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<FormDataType>({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email,
        phone: user.phone || '',
        avatar_url: user.avatar_url || '',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [myHorses, setMyHorses] = useState<any[]>([]);
    const [loadingHorses, setLoadingHorses] = useState(true);

    useEffect(() => {
        const fetchHorses = async () => {
            try {
                const res = await fetch('/api/v1/me/horses');
                if (res.ok) {
                    const json = await res.json();
                    setMyHorses(json.data || []);
                } else {
                    setMyHorses([]);
                }
            } catch (err) {
                console.error('Error fetching my horses:', err);
                setMyHorses([]);
            } finally {
                setLoadingHorses(false);
            }
        };

        fetchHorses();
    }, []);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name as keyof FormDataType]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch('/api/v1/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                onUpdate(updatedUser);
                setIsEditing(false);
            } else {
                console.error('Error updating profile');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCancel = () => {
        setFormData({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email,
            phone: user.phone || '',
            avatar_url: user.avatar_url || '',
        });
        setIsEditing(false);
    };

    const styleLines = "h-[1px] w-16 from-transparent to-[rgb(var(--color-gold))]"
    const styleLabel = "block text-xs tracking-[0.125em] uppercase text-[rgb(var(--color-gold))] mb-3 font-medium"
    const styleInput = "w-full px-4 py-4 bg-[rgb(var(--color-cream)/0.05)] border border-[rgb(var(--color-cream)/0.2)] text-[rgb(var(--color-cream))] placeholder-[rgb(var(--color-cream)/0.3)] font-light text-sm focus:outline-none focus:border-[rgb(var(--color-gold))] transition-all duration-300"
    const styleDivError = "px-4 py-4 bg-black/40 border border-[rgb(var(--color-cream)/0.1)] text-[rgb(var(--color-cream))] font-light text-sm"
    const styleBtn = "px-10 py-4 bg-[rgb(var(--color-gold))] text-black fontMontserrat text-xs uppercase tracking-[0.125em] hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))] transition-all duration-300 font-medium"
    

    return (
    <>
        <div className="flex flex-col w-full min-h-screen bg-black pb-12">

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 w-full">
                
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className={`${styleLines} bg-gradient-to-r`}></div>
                    <span className="text-[rgb(var(--color-gold))] text-2xl">◆</span>
                    <div className={`${styleLines} bg-gradient-to-l`}></div>
                </div>

                <div className="bg-gradient-to-br from-[rgb(var(--color-teal)/0.2)] via-[rgb(var(--color-terracota)/0.5)] to-[rgb(var(--color-teal)/0.2)] border border-[rgb(var(--color-gold)/0.3)] p-8 sm:p-12 mb-8">
                    <h1 className="fontCormorant text-4xl sm:text-5xl font-light tracking-wide text-[rgb(var(--color-gold))] uppercase text-center mb-12">
                        Mi Perfil
                    </h1>

                    <div className="flex flex-col items-center mb-10">
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6 group">
                            <Image
                                src={formData.avatar_url || '/images/logoh.png'}
                                alt="Avatar"
                                fill
                                className={`object-cover border-4 border-[rgb(var(--color-gold))] ${isEditing ? 'cursor-pointer hover:border-[rgb(var(--color-cream))] transition-all duration-300' : ''}`}
                                onClick={isEditing ? () => fileInputRef.current?.click() : undefined}
                            />
                            {isEditing && (
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="text-[rgb(var(--color-cream))] text-xs uppercase tracking-wider">Cambiar</span>
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                            />
                        )}
                    </div>

                    <div className="fontMontserrat space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={styleLabel}>
                                    Nombre
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className={styleInput}
                                    />
                                ) : (
                                    <div className={styleDivError}>
                                        {formData.first_name || 'No especificado'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className={styleLabel}>
                                    Apellido
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className={styleInput}
                                    />
                                ) : (
                                    <div className={styleDivError}>
                                        {formData.last_name || 'No especificado'}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className={styleLabel}>
                                Email
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={styleInput}
                                />
                            ) : (
                                <div className={styleDivError}>
                                    {formData.email}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className={styleLabel}>
                                Teléfono
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={styleInput}
                                />
                            ) : (
                                <div className={styleDivError}>
                                    {formData.phone || 'No especificado'}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-[rgb(var(--color-cream)/0.1)]">
                        {isEditing ? (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleSave}
                                    className={styleBtn}
                                >
                                    Guardar Cambios
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-10 py-4 bg-transparent border border-[rgb(var(--color-cream)/0.3)] text-[rgb(var(--color-cream))] fontMontserrat text-xs uppercase tracking-[0.125em] hover:border-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold))] transition-all duration-300 font-medium"
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-10 py-4 bg-transparent border border-[rgb(var(--color-gold))] text-[rgb(var(--color-gold))] fontMontserrat text-xs uppercase tracking-[0.125em] hover:bg-[rgb(var(--color-gold))] hover:text-black transition-all duration-300 font-medium"
                                >
                                    Editar Perfil
                                </button>

                                <Link href="/horses/new">
                                    <button className={styleBtn}>
                                        Registrar Caballo
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-3 my-12">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[rgb(var(--color-gold))] to-transparent"></div>
                </div>

                <div className="mt-16">
                    <div className="text-center mb-12">
                        <div className="text-xs tracking-[0.25em] text-[rgb(var(--color-gold))] mb-4 uppercase font-medium">
                            Mi Colección
                        </div>
                        <h2 className="fontCormorant text-4xl sm:text-5xl font-light tracking-wide text-[rgb(var(--color-cream))] uppercase">
                            Mis Caballos
                        </h2>
                    </div>

                    {loadingHorses ? (
                        <div className="text-center py-20">
                            <div className="inline-block w-12 h-12 border-4 border-[rgb(var(--color-gold)/0.3)] border-t-[rgb(var(--color-gold))] rounded-full animate-spin"></div>
                            <p className="text-[rgb(var(--color-cream)/0.7)] mt-4 text-sm uppercase tracking-wider">Cargando caballos...</p>
                        </div>
                    ) : myHorses.length === 0 ? (
                        <div className="fontMontserrat text-center py-20 bg-[rgb(var(--color-terracota)/0.2)] border border-[rgb(var(--color-teal)/0.3)] p-12">
                            <div className="mb-4 flex items-center justify-center">
                                <LiaHorseHeadSolid className="text-8xl text-[rgb(var(--color-gold)/0.9)]">🐴</LiaHorseHeadSolid>
                            </div>
                            <p className="text-[rgb(var(--color-cream))] text-lg mb-2 font-light">
                                No tenés caballos registrados
                            </p>
                            <p className="text-[rgb(var(--color-cream)/0.6)] text-sm mb-6">
                                Comenzá a construir tu colección ecuestre
                            </p>
                            <Link href="/horses/new">
                                <button className="px-8 py-3 bg-[rgb(var(--color-gold))] text-black text-xs uppercase tracking-[0.125em] hover:bg-[rgb(var(--color-teal))] hover:text-[rgb(var(--color-cream))] transition-all duration-300 font-medium">
                                    Registrar mi Primer Caballo
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <ContainerCardGallery horses={myHorses} />
                    )}
                </div>
            </div>
        </div>
    </>
);
}