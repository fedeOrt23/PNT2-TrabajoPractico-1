"use client";

import DashboardLayout from "@/components/DashboardLayout";
import styles from "../page.module.css";
import { useLibrary } from "@/app/contexts/LibraryContext";

export default function LibraryPage() {
  const { libraryItems, removeFromLibrary } = useLibrary();
  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.shell}>
          <main style={{ padding: "2rem" }}>
      <h1>Mi Biblioteca</h1>

      {libraryItems.length === 0 && (
        <p>No guardaste nada todavía.</p>
      )}

      <ul style={{ marginTop: "1.5rem" }}>
        {libraryItems.map((item) => (
          <li key={item.id} style={{ marginBottom: "0.5rem" }}>
            {item.name} — {item.artist}
            <button
              style={{ marginLeft: "1rem" }}
              onClick={() => removeFromLibrary(item.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
