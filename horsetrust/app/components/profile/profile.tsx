'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

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
        <div className="max-w-5xl mx-auto p-10 bg-gradient-to-br from-[rgb(var(--color-cream))] to-white rounded-2xl shadow-2xl border border-[rgb(var(--color-gold))/20]">
            <h2 className="text-3xl fontCormorant text-[rgb(var(--color-terracota))] mb-8 text-center">
                Mi Perfil
            </h2>

            <div className="flex flex-col items-center mb-8">
                <div className="relative w-32 h-32 mb-6">
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
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                        <button
                            onClick={handleSave}
                            className="px-8 py-4 bg-transparent border-2 border-[rgb(var(--color-teal))] text-[rgb(var(--color-teal))] fontMontserrat text-lg uppercase tracking-wide rounded-xl hover:bg-[rgb(var(--color-teal))] hover:text-white transition-all duration-300"
                        >
                            Guardar
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-8 py-4 bg-[rgb(var(--color-gold))] text-black fontMontserrat text-lg uppercase tracking-wide rounded-xl hover:bg-[rgb(var(--color-terracota))] hover:text-white transition-all duration-300"
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-8">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-8 py-4 bg-[rgb(var(--color-teal))] text-white fontMontserrat text-lg uppercase tracking-wide rounded-xl hover:bg-[rgb(var(--color-gold))] hover:text-black transition-all duration-300"
                        >
                            Editar Perfil
                        </button>

                        <button className="px-8 py-4 bg-[rgb(var(--color-gold))] text-black fontMontserrat text-lg uppercase tracking-wide rounded-xl hover:bg-[rgb(var(--color-terracota))] hover:text-white transition-all duration-300">
                            Mis Caballos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}