"use client";

import { useState, useEffect } from "react";
import TopListSection from "@/components/TopListSection";
import { getArtistSongs } from "@/app/api/spotify_token/services/ABMartistas";
import styles from "@/app/page.module.css";

export default function ArtistCard({ artist, onEdit, onDelete }) {
  const description = `Con más de ${(artist.followers || 0).toLocaleString("es-ES")} seguidores.`;

  const [topSongs, setTopSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const songs = await getArtistSongs(artist.id);
        const sortedSongs = songs
          .sort((a, b) => (b.reproductions || 0) - (a.reproductions || 0))
          .slice(0, 3);
        setTopSongs(sortedSongs.map((song, index) => ({ ...song, rank: index + 1, title: song.name })));
      } catch (error) {
        console.error(`Error al cargar las canciones de ${artist.name}:`, error);
      }
    };

    fetchSongs();
  }, [artist.id, artist.name]);

  return (
    <div className={styles.hero}>
      <div className={styles.artistCardHeader}>
        {artist.image && (
          <img
            src={artist.image}
            alt={`Foto de ${artist.name}`}
            className={styles.artistImage}
          />
        )}
        <div>
          <h2 className={styles.artistName}>{artist.name}</h2>
          <p className={styles.artistDescription}>{description}</p>
          <div className={styles.buttonGroup}>
            <button onClick={() => onEdit(artist)} className={styles.editButton}>Editar</button>
            <button onClick={() => onDelete(artist.id)} className={styles.deleteButton}>Eliminar</button>
          </div>
        </div>
      </div>

      {topSongs.length > 0 && (
        <TopListSection
          title="Canciones más conocidas"
          items={topSongs}
          type="track"
        />
      )}
    </div>
  );
}
