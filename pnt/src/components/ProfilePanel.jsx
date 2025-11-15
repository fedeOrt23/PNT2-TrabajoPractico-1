"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./ProfilePanel.module.css";
import { useAuth } from "@/app/contexts/AuthProvider.jsx";
import { useRouter } from "next/navigation";

const menuOptions = [
  { label: "Cuenta", description: "Gestiona tu cuenta", icon: "⚙️", action: "profile" },
  { label: "Notificaciones", description: "Configura alertas y avisos", icon: "🔔" },
  { label: "Cerrar sesión", description: "Salir de tu cuenta", icon: "🚪", action: "logout" },
];

export default function ProfilePanel() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    console.log("Usuario actual:", user);
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleOptionClick = (option) => {
    console.log(option.action);
    if (option.action === "logout") {
      logout();
    } else if (option.action === "profile") {
      router.push("/profile");
    } else {
      console.log(`Abriendo ${option.label}`);
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={menuRef}>
      <button 
        className={styles.profileButton} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menú de perfil"
        aria-expanded={isOpen}
      >
        <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <div className={styles.avatarLarge}>{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <p className={styles.name}>{user?.name}</p>
              <p className={styles.email}>{user?.email}</p>
            </div>
          </div>

          <div className={styles.divider} />

          <ul className={styles.menuList}>
            {menuOptions.map((option) => (
              <li key={option.label}>
                <button
                  className={`${styles.menuItem} ${option.action === "logout" ? styles.logoutItem : ""}`}
                  onClick={() => handleOptionClick(option)}
                  type="button"
                >
                  <span className={styles.menuIcon}>{option.icon}</span>
                  <div className={styles.menuContent}>
                    <p className={styles.menuLabel}>{option.label}</p>
                    <p className={styles.menuDescription}>{option.description}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
