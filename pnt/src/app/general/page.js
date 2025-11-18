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
import { getAllArtists } from "@/app/api/spotify_token/services/ABMartistas";

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

  const fetchSongs = useCallback(async () => { //me da una funcion memorizada
    try {
      setLoading(true);

      const songsResponse = await obtenerCanciones();

      let artistsResponse = [];
      try {
        artistsResponse = await getAllArtists();
      } catch (artistsError) {
        console.log("No se pudieron obtener los artistas", artistsError);
      }

      const artistMap = new Map();

      (artistsResponse || []).forEach((artist) => {
        console.log("viendo artista", artist);
        if (artist?.id && artist?.name) {
          artistMap.set(String(artist.id), artist.name);
        }
      });


      const normalizedSongs = (songsResponse ?? []).map((song, index) => {
        const resolveSongArtistId = () => {
          const rawId =
            song?.artistaId ??
            song?.artistId ??
            song?.idArtista ??
            song?.artista?.id ??
            song?.artist?.id ??
            null;

          if (rawId === undefined || rawId === null) {
            return null;
          }
          return String(rawId);
        };

        const artistId = resolveSongArtistId();
        const directArtistName = typeof song?.artist === "string" && song.artist.length > 0 ? song.artist : null;

        const lookupArtistName = artistId ? artistMap.get(artistId) : null;

        const resolvedArtistName =
          (typeof directArtistName === "string" && directArtistName.length > 0
            ? directArtistName
            : null) ||
          (typeof lookupArtistName === "string" && lookupArtistName.length > 0
            ? lookupArtistName
            : null) ||
          "Artista desconocido";

        return {
          id: song?.id ?? `song-${index}`,
          name: song?.name ?? song?.title ?? song?.titulo ?? "Canción sin nombre",
          artist: resolvedArtistName,
          subtitle: song?.album ?? song?.genero ?? undefined,
          image: song?.image ?? song?.cover ?? song?.portada ?? null,
          popularity: song?.popularity ?? null,
          metric: song?.duration ? `${song.duration} min` : undefined,
          rank: index + 1,
          artistId,
        };
      });

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
  }, [fetchSongs]); //se ejecuta cuando cambia algo en el fecht

  const handleCreateSong = async (event) => {
    event?.preventDefault?.(); //chequea que exista el evento y la funcion

    const trimmedName = newSong.name.trim();
    if (!trimmedName) {
      alert("El nombre no puede estar vacio");
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
      await fetchSongs(); //llama por dentro a los sets de estado para actualizar la lista
      setNewSong({ name: "", artist: "", album: "", image: "" });
      alert("Canción creada correctamente");
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
    console.log("Eliminar canción con ID:", songId);
    if (!songId) {
      console.log("No se puede eliminar la canción sin un ID válido.");
      alert("Esta canción no tiene un ID valid.");
      return;
    }

    const artistId =
      song?.artistId ?? song?.artistaId ?? song?.idArtista ?? null;

    const songName = song?.name ?? "esta canción";

    if (!confirm(`¿Eliminar ${songName}?`)) {
      return;
    }

    (async () => {
      try {
        await eliminarCancion(songId, artistId || undefined);
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
                type ="track"
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
