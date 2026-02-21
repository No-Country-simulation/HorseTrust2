
'use client'
import { useSession } from '@/store/authSession'
import Image from 'next/image'

export default function CardExample() {
  const { user, isAuthenticated } = useSession()

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 rounded-2xl shadow-md bg-white border">
        <p className="text-gray-500 text-sm">No hay sesión activa</p>
      </div>
    )
  }

  return (
    <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-6 border border-gray-200">

      <div className="flex items-center gap-4">
        <Image
          width={100}
          height={100}
          src={user.avatar_url ?? '/images/logo.png'}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover border"
        />

        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
          Rol: {user.role}
        </span>
      </div>

    </div>
  )
}