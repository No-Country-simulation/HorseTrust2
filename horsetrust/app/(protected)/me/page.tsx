'use client';

import { useState, useEffect } from 'react';
import Profile from '@/app/components/profile/profile';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/v1/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[rgb(var(--color-terracota))] fontMontserrat">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[rgb(var(--color-terracota))] fontMontserrat">Usuario no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-16 flex items-center justify-center">
      <Profile user={user} onUpdate={handleUpdate} />
    </div>
  );
}
