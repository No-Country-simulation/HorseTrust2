"use client";

import React, { useState } from 'react';
import { Sex, Discipline } from '@/lib/database/enums';
import { sexLabel, disciplineLabel } from '@/lib/translations/enums';

const HorseForm = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: '' });

  const [formData, setFormData] = useState({
    name: "Horser",
    age: 10,
    sex: Sex.male,
    discipline: Discipline.racing,
    breed: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'number' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, msg: '' });

    try {
      const response = await fetch('/api/v1/horses/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', msg: '¡Caballo registrado exitosamente en el sistema!' });
      } else {
        throw new Error(data.message || 'Error al procesar el registro');
      }
    } catch (error: any) {
      setStatus({ type: 'error', msg: error.message || 'Fallo en la conexión con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-6 bg-[#F5F5F2] min-h-screen">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-[#D4C7B0]">
        
        {/* Encabezado HorseTrust */}
        <div className="bg-[#1B3022] p-8 border-b-4 border-[#C5A059]">
          <h2 className="text-3xl font-serif font-bold text-[#F5F5F2] tracking-wide">
            Horse<span className="text-[#C5A059]">Trust</span>
          </h2>
          <p className="text-gray-300 text-sm mt-1 italic">Registro Oficial de Ejemplares</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#1B3022] mb-2">
              Nombre del Caballo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#F9F9F7] border border-[#D4C7B0] rounded focus:ring-2 focus:ring-[#1B3022] outline-none transition-all text-[#1B3022]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Edad */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#1B3022] mb-2">
                Edad
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F9F9F7] border border-[#D4C7B0] rounded focus:ring-2 focus:ring-[#C5A059] outline-none transition-all"
                required
              />
            </div>

            {/* Sexo */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#1B3022] mb-2">
                Sexo
              </label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#F9F9F7] border border-[#D4C7B0] rounded focus:ring-2 focus:ring-[#C5A059] outline-none transition-all cursor-pointer"
              >
                {Object.values(Sex).map(val => (
                  <option key={val} value={val}>{sexLabel[val]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Disciplina */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#1B3022] mb-2">
              Disciplina
            </label>
            <select
              name="discipline"
              value={formData.discipline}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#F9F9F7] border border-[#D4C7B0] rounded focus:ring-2 focus:ring-[#C5A059] outline-none transition-all cursor-pointer"
            >
              {Object.values(Discipline).map(val => (
                <option key={val} value={val}>{disciplineLabel[val]}</option>
              ))}
            </select>
          </div>

          {/* Raza */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#1B3022] mb-2">
              Raza (Opcional)
            </label>
            <select
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#F9F9F7] border border-[#D4C7B0] rounded focus:ring-2 focus:ring-[#C5A059] outline-none transition-all cursor-pointer"
            >
              <option value="">Seleccionar raza...</option>
              {['Pura Sangre','Cuarto de Milla','Árabe','Appaloosa','Paso Fino','Frisón','Andaluz','Lusitano','Hannoveriano','Holsteiner','Criollo','Percherón','Mustang','Morgan','Tennessee Walker','Thoroughbred','Paint Horse','Palomino','Pinto','Otra'].map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Feedback */}
          {status.msg && (
            <div className={`p-4 rounded text-sm font-bold text-center ${
              status.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {status.msg}
            </div>
          )}

          {/* Botón Registrar */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded font-bold uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 border border-[#C5A059]/30 ${
              loading 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-[#1B3022] hover:bg-[#264230] text-[#C5A059]'
            }`}
          >
            {loading ? 'Procesando...' : 'Registrar Caballo'}
          </button>
        </form>

        <div className="bg-[#1B3022] p-3 text-center">
          <p className="text-[10px] text-[#C5A059]/50 font-medium tracking-widest uppercase">
            Conexión Segura a api/v1/horses/
          </p>
        </div>
      </div>
    </div>
  );
};

export default HorseForm;