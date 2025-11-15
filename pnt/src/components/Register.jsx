'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import styles from './Login.module.css';

export default function Register() {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name || !formData.lastname || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Por favor completa todos los campos');
      return false;
    }

    if (formData.name.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return false;
    }

    if (formData.lastname.length < 2) {
      setError('El apellido debe tener al menos 2 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Ingresa un email válido');
      return false;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }
debugger
    try {
      const result = await register({
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password
      });
      
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
        <h1 className={styles.title}>Crear Cuenta</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Juan Pérez"
              autoComplete="name"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="lastname" className={styles.label}>
              Apellido
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              value={formData.lastname}
              onChange={handleChange}
              className={styles.input}
              placeholder="Pérez"
              autoComplete="family-name"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
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
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <div className={styles.footer}>
          <span className={styles.span}>¿Ya tienes cuenta?</span>{' '}
          <button
            onClick={() => router.push('/login')}
            className={styles.link}
            type="button"
          >
            Inicia Sesión
          </button>
        </div>
      </div>
    </div>
  );
}