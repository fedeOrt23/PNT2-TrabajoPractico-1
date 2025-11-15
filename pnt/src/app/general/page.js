"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import TopListSection from "@/components/TopListSection";
import styles from "../page.module.css";
import {
  obtenerCanciones,
  crearCancion,
  eliminarCancion,
  actualizarCancion,
} from "@/app/api/services/ABMcanciones";

export default function GeneralPage() {
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newSong, setNewSong] = useState({
    name: "",
    artist: "",
    album: "",
    image: "",
  });

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await obtenerCanciones();
      const normalizedSongs = (data ?? []).map((song, index) => ({
        id: song.id ?? `song-${index}`,
        name: song.name ?? song.title ?? song.titulo ?? "Canción sin nombre",
        artist: song.artist ?? song.autor ?? song.artistName ?? "Artista desconocido",
        subtitle: song.album ?? song.genero ?? undefined,
        image: song.image ?? song.cover ?? song.portada ?? null,
        popularity: song.popularity ?? null,
        metric: song.duration ? `${song.duration} min` : undefined,
        rank: index + 1,
      }));
      setSongs(normalizedSongs);
      setError(null);
    } catch (err) {
      console.error("Error al cargar canciones:", err);
      setError("No se pudieron cargar las canciones en este momento.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handleCreateSong = async (event) => {
    event?.preventDefault?.();

    const trimmedName = newSong.name.trim();
    if (!trimmedName) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    const trimmedArtist = newSong.artist.trim();
    const trimmedAlbum = newSong.album.trim();
    const trimmedCover = newSong.image.trim();

    try {
      await crearCancion({
        name: trimmedName,
        artist: trimmedArtist || undefined,
        album: trimmedAlbum || undefined,
        image: trimmedCover || undefined,
      });
      await fetchSongs();
      setNewSong({ name: "", artist: "", album: "", image: "" });
      alert("Canción creada correctamente.");
    } catch (err) {
      console.error("No se pudo crear la cancion", err);
      alert("No se pudo crear la canción. Prueba nuevamente más tarde.");
    }
  };

  const handleNewSongChange = (field) => (event) => {
    const value = event.target.value;
    setNewSong((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSong = (song) => {
    const songId = song?.id;
    if (!songId) {
      alert("Esta canción no tiene un ID válido para editarla.");
      return;
    }

    const newName = prompt("Nuevo nombre de la cancion", song?.name ?? "");
    if (newName === null) return;

    const trimmedName = newName.trim();
    if (!trimmedName) {
      alert("El nombre no puede quedar vacío.");
      return;
    }

    (async () => {
      try {
        await actualizarCancion(songId, { name: trimmedName });
        await fetchSongs();
        alert("Canción editada correctamente");
      } catch (err) {
        console.error("No se pudo editar la cancion", err);
        alert("No se pudo editar la cancion");
      }
    })();
  };

  const handleDeleteSong = (song) => {
    const songId = song?.id;
    if (!songId) {
      alert("Esta canción no tiene un ID valid.");
      return;
    }

    const songName = song?.name ?? "esta canción";

    if (!confirm(`¿Eliminar ${songName}?`)) {
      return;
    }

    (async () => {
      try {
        await eliminarCancion(songId);
        await fetchSongs();
        alert("Canción eliminada correctamente.");
      } catch (err) {
        console.error("No se pudo eliminar la canción:", err);
        alert("No se pudo eliminar la cancionn");
      }
    })();
  };

  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.shell}>
          <main className={styles.main}>
            <header className={styles.hero}>
              <p className={styles.eyebrow}>Kapelle</p>
              <h1>General</h1>
              <p className={styles.description}>
                Reúne y crea tus canciones favoritas usando el mismo estilo que en
                la página de inicio.
              </p>
              <form className={styles.songForm} onSubmit={handleCreateSong}>
                <input
                  type="text"
                  placeholder="Nombre de la canción"
                  value={newSong.name}
                  onChange={handleNewSongChange("name")}
                  required
                />
                <input
                  type="text"
                  placeholder="Artista"
                  value={newSong.artist}
                  onChange={handleNewSongChange("artist")}
                />
                <input
                  type="text"
                  placeholder="Álbum (opcional)"
                  value={newSong.album}
                  onChange={handleNewSongChange("album")}
                />
                <input
                  type="text"
                  placeholder="URL de portada (opcional)"
                  value={newSong.image}
                  onChange={handleNewSongChange("image")}
                />
                <button type="submit" className={styles.songFormButton}>
                  Crear canción
                </button>
              </form>
            </header>

            {loading && (
              <p style={{ padding: "1rem" }}>Cargando canciones...</p>
            )}

            {error && !loading && (
              <div className={styles.emptyState}>
                <h2>{error}</h2>
                <button className={styles.createButton} onClick={fetchSongs}>
                  Reintentar
                </button>
              </div>
            )}

            {!loading && !error && (
              <TopListSection
                title="Listado general de canciones"
                items={songs}
                accentColor="#2ecc71"
                onEdit={handleEditSong}
                onDelete={handleDeleteSong}
              />
            )}
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
