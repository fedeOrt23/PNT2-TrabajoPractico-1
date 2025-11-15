'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthProvider';
import styles from './ProfileSettings.module.css';

export default function ProfileSettings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Actualizar información básica
      const response = await fetch(`https://690160fdff8d792314bd3f83.mockapi.io/api/v1/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          lastname: formData.lastname,
          email: formData.email
        })
      });

      if (!response.ok) throw new Error('Error al actualizar');

      const updatedUser = await response.json();
      
      // Actualizar localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validaciones
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Completa todos los campos de contraseña' });
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      setLoading(false);
      return;
    }

    try {
      // Verificar contraseña actual
      const verifyResponse = await fetch(`https://690160fdff8d792314bd3f83.mockapi.io/api/v1/users/${user.id}`);
      const userData = await verifyResponse.json();

      if (userData.password !== formData.currentPassword) {
        setMessage({ type: 'error', text: 'Contraseña actual incorrecta' });
        setLoading(false);
        return;
      }

      // Actualizar contraseña
      const updateResponse = await fetch(`https://690160fdff8d792314bd3f83.mockapi.io/api/v1/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: formData.newPassword
        })
      });

      if (!updateResponse.ok) throw new Error('Error al cambiar contraseña');

      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' });
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cambiar la contraseña' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Configuración de Cuenta</h1>

      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {/* Información del perfil */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Información Personal</h2>
        <form onSubmit={handleUpdateProfile} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="lastname" className={styles.label}>Apellido</label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Usuario</label>
            <input
              type="text"
              value={user?.username || `${user?.name?.toLowerCase()}.${user?.lastname?.toLowerCase()}`}
              disabled
              className={`${styles.input} ${styles.disabled}`}
            />
            <small className={styles.hint}>El usuario no puede modificarse</small>
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </section>

      {/* Cambiar contraseña */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Cambiar Contraseña</h2>
        <form onSubmit={handleChangePassword} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="currentPassword" className={styles.label}>Contraseña Actual</label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="newPassword" className={styles.label}>Nueva Contraseña</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirmar Nueva Contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      </section>

      {/* Información adicional */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Información de Cuenta</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Fecha de Registro</span>
            <span className={styles.infoValue}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              }) : 'No disponible'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>ID de Usuario</span>
            <span className={styles.infoValue}>{user?.id || 'No disponible'}</span>
          </div>
        </div>
      </section>
    </div>
  );
}