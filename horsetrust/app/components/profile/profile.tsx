'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ContainerCardGallery from "../gallery/ContainerCardGallery";

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

    return (
        <>
            <div className="flex flex-col gap-8 w-full">
                <div className="max-w-5xl mx-auto px-4 py-6 sm:p-10 bg-gradient-to-br from-[rgb(var(--color-cream))] to-white rounded-2xl shadow-2xl border border-[rgb(var(--color-gold))/20]">
                    <h2 className="text-3xl fontCormorant text-[rgb(var(--color-terracota))] mb-8 text-center">
                        Mi Perfil
                    </h2>

                    <div className="flex flex-col items-center mb-8">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-6">
                            <Image
                                src={formData.avatar_url || '/images/logo.png'}
                                alt="Avatar"
                                fill
                                className={`rounded-full object-cover border-4 border-[rgb(var(--color-gold))] shadow-lg ${isEditing ? 'cursor-pointer' : ''}`}
                                onClick={isEditing ? () => fileInputRef.current?.click() : undefined}
                            />
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

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-lg fontMontserrat text-[rgb(var(--color-terracota))] mb-2">
                                    Nombre
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-[rgb(var(--color-teal))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-gold))] text-lg bg-white shadow-sm"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-white rounded-lg text-lg text-[rgb(var(--color-terracota))] shadow-sm border border-gray-200">
                                        {formData.first_name || 'No especificado'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-lg fontMontserrat text-[rgb(var(--color-terracota))] mb-2">
                                    Apellido
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-[rgb(var(--color-teal))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-gold))] text-lg bg-white shadow-sm"
                                    />
                                ) : (
                                    <p className="px-4 py-3 bg-white rounded-lg text-lg text-[rgb(var(--color-terracota))] shadow-sm border border-gray-200">
                                        {formData.last_name || 'No especificado'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg fontMontserrat text-[rgb(var(--color-terracota))] mb-2">
                                Email
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-[rgb(var(--color-teal))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-gold))] text-lg bg-white shadow-sm"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-white rounded-lg text-lg text-[rgb(var(--color-terracota))] shadow-sm border border-gray-200">
                                    {formData.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-lg fontMontserrat text-[rgb(var(--color-terracota))] mb-2">
                                Teléfono
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-[rgb(var(--color-teal))] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-gold))] text-lg bg-white shadow-sm"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-white rounded-lg text-lg text-[rgb(var(--color-terracota))] shadow-sm border border-gray-200">
                                    {formData.phone || 'No especificado'}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col items-center mt-10 pt-6">
                        {isEditing ? (
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full">
                                <button
                                    onClick={handleSave}
                                    className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[rgb(var(--color-teal))] text-[rgb(var(--color-teal))] fontMontserrat text-lg uppercase tracking-wide rounded-xl hover:bg-[rgb(var(--color-teal))] hover:text-white transition-all duration-300"
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="w-full sm:w-auto px-8 py-4 bg-[rgb(var(--color-gold))] text-black fontMontserrat text-lg uppercase tracking-wide rounded-xl hover:bg-[rgb(var(--color-terracota))] hover:text-white transition-all duration-300"
                                >
                                    Cancelar
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full sm:w-auto px-8 py-4 bg-[rgb(var(--color-teal))] text-white fontMontserrat text-lg uppercase tracking-wide rounded-xl hover:bg-[rgb(var(--color-gold))] hover:text-black transition-all duration-300"
                                >
                                    Editar Perfil
                                </button>

                                <Link href="/horses/new">
                                    <button className="w-full sm:w-auto px-8 py-4 bg-[rgb(var(--color-gold))] text-black fontMontserrat text-lg uppercase tracking-wide rounded-xl hover:bg-[rgb(var(--color-terracota))] hover:text-white transition-all duration-300 mt-3 sm:mt-0">
                                        Registrar Caballo
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mis caballos - usar componente de galería */}
                <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6">
                    <h3 className="fontCormorant text-4xl sm:text-5xl font-light tracking-[0.125em] text-[rgb(var(--color-terracota))] mb-6 text-center leading-tight uppercase">
                        Mis Caballos
                    </h3>

                    {loadingHorses ? (
                        <p className="text-center text-[rgb(var(--color-terracota))]">Cargando caballos...</p>
                    ) : myHorses.length === 0 ? (
                        <div className="text-center text-[rgb(var(--color-terracota))]">
                            No tenés caballos registrados. <Link href="/horses/new" className="text-[rgb(var(--color-teal))] font-semibold">Registrá uno</Link>
                        </div>
                    ) : (
                        <ContainerCardGallery horses={myHorses} />
                    )}
                </div>
            </div>
        </>
    );
}