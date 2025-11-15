"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { usePlaylists } from "@/app/contexts/PlaylistContext";
import styles from "../page.module.css";
import Link from "next/link";


export default function PlaylistsPage() {
  const { playlists, deletePlaylist, createPlaylist } = usePlaylists();

  function handleCreate() {
    const name = prompt("Nombre de la playlist:");
    if (!name) return;
    createPlaylist(name);
  }

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.shell}>
          <main style={{ padding: "2rem" }}>
            <h1>Playlists</h1>

            <button
              onClick={handleCreate}
              style={{
                marginTop: "1rem",
                marginBottom: "1.5rem",
                padding: "0.5rem 1rem",
                cursor: "pointer"
              }}
            >
              Crear playlist
            </button>

            {playlists.length === 0 && <p>No creaste ninguna playlist.</p>}

            <ul style={{ marginTop: "1rem" }}>
              {playlists.map((p) => (
                <li key={p.id} style={{ marginBottom: "0.8rem" }}>
                    {/* Linkeo a la página individual de la playlist */}
                  <Link
                    href={`/playlist/${p.id}`}     
                    style={{ fontWeight: "bold", marginRight: "1rem" }}
                  >
                    {p.name}
                  </Link>

                  ({p.songs.length} canciones)

                  <button
                    onClick={() => deletePlaylist(p.id)}
                    style={{ marginLeft: "1rem" }}
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
