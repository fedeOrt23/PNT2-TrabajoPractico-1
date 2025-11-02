"use client";

import styles from "./ProfilePanel.module.css";

const quickSettings = [
  { label: "Cuenta", description: "Gestiona tu plan y preferencias" },
  { label: "Notificaciones", description: "Configura alertas y avisos" },
  { label: "Privacidad", description: "Controla lo que compartes" },
];

export default function ProfilePanel() {
  return (
    <aside className={styles.panel}>
      <header className={styles.header}>
        <div className={styles.avatar} aria-hidden>
          MP
        </div>
        <div>
          <p className={styles.label}>Mi Perfil</p>
          <p className={styles.name}>Maria Perez</p>
        </div>
      </header>

      <p className={styles.tagline}>Configura tu cuenta y personaliza tu experiencia.</p>

      <ul className={styles.settingsList}>
        {quickSettings.map((item) => (
          <li key={item.label} className={styles.setting}>
            <div>
              <p className={styles.settingLabel}>{item.label}</p>
              <p className={styles.settingDescription}>{item.description}</p>
            </div>
            <button className={styles.settingButton} type="button">
              Abrir
            </button>
          </li>
        ))}
      </ul>

      <button className={styles.mainButton} type="button">
        Abrir panel completo
      </button>
    </aside>
  );
}
