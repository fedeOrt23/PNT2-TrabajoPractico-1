"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SidebarNav.module.css";

const navItems = [
  { label: "Inicio", href: "/", icon: "♪" },
  { label: "Mi Biblioteca", href: "/library", icon: "♫" },
  { label: "Artistas", href: "/artists", icon: "♬" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar}>
      <div className={styles.logo}>MusicHub</div>
      <ul className={styles.list}>
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                className={`${styles.link} ${isActive ? styles.active : ""}`}
                href={item.href}
              >
                <span aria-hidden className={styles.icon}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
