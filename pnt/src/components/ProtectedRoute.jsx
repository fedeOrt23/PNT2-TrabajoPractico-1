'use client'

import { useAuth } from '@/app/contexts/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, loading, router])

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <p>Cargando...</p>
      </div>
    )
  }

  // No mostrar nada si no está autenticado (evita flash de contenido)
  if (!isAuthenticated) {
    return null
  }

  return children
}
