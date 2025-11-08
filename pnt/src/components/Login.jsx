'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthProvider.jsx';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
        setError('Por favor completa todos los campos');
        return;
      }

    try {
      const result = await login({ email, password });
      
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado. Intenta nuevamente.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Iniciar Sesión</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="tu@email.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className={styles.footer}>
          <a href="/forgot-password" className={styles.link}>
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}