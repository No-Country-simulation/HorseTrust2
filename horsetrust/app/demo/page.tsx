"use client";
import React, { useState } from 'react';
import { Sex, Discipline } from '@/lib/database/enums';

const HorseTrustDemo = () => {
  const [formData, setFormData] = useState({
    name: "Horser",
    age: 10,
    sex: Sex.male,
    discipline: Discipline.racing,
    breed: ""
  });

  return (
    <div className="flex items-center justify-center p-6 bg-[#F5F5F2]"> {/* Color Crema/Arena de fondo */}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-[#D4C7B0]">
        
        {/* Encabezado con Verde Bosque y borde Dorado */}
        <div className="bg-[#1B3022] p-8 border-b-4 border-[#C5A059]">
          <h2 className="text-3xl font-serif font-bold text-[#F5F5F2] tracking-wide">
            Horse<span className="text-[#C5A059]">Trust</span>
          </h2>
          <p className="text-gray-300 text-sm mt-1 italic">Registro de Ejemplares de Élite</p>
        </div>

        <form className="p-8 space-y-6">
          {/* Campo de Nombre */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#1B3022] mb-2">
              Nombre del Ejemplar
            </label>
            <input
              type="text"
              value={formData.name}
              className="w-full px-4 py-3 bg-[#F9F9F7] border border-[#D4C7B0] rounded focus:ring-2 focus:ring-[#1B3022] focus:border-transparent outline-none transition-all text-[#1B3022] font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Edad */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#1B3022] mb-2">
                Edad (Años)
              </label>
              <input
                type="number"
                value={formData.age}
                className="w-full px-4 py-3 bg-[#F9F9F7] border border-[#D4C7B0] rounded focus:ring-2 focus:ring-[#C5A059] outline-none transition-all"
              />
            </div>

            {/* Sexo */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#1B3022] mb-2">
                Sexo
              </label>
              <select
                value={formData.sex}
                className="w-full px-4 py-3 bg-[#F9F9F7] border border-[#D4C7B0] rounded focus:ring-2 focus:ring-[#C5A059] outline-none transition-all appearance-none cursor-pointer"
              >
                {Object.values(Sex).map(val => (
                  <option key={val} value={val}>{val.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Disciplina */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#1B3022] mb-2">
              Disciplina Principal
            </label>
            <select
              value={formData.discipline}
              className="w-full px-4 py-3 bg-[#F9F9F7] border border-[#D4C7B0] rounded focus:ring-2 focus:ring-[#C5A059] outline-none transition-all cursor-pointer"
            >
              {Object.values(Discipline).map(val => (
                <option key={val} value={val}>{val.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Botón de Acción con efecto Hover Dorado */}
          <button
            type="button"
            className="w-full bg-[#1B3022] hover:bg-[#264230] text-[#C5A059] py-4 rounded font-bold uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 border border-[#C5A059]/30"
          >
            Registrar en Marketplace
          </button>
        </form>

        <div className="bg-[#1B3022] p-3 text-center">
          <p className="text-[10px] text-[#C5A059]/60 font-medium tracking-widest uppercase">
            Sistema de Verificación HorseTrust v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default HorseTrustDemo;