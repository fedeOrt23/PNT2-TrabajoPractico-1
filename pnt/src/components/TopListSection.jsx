"use client";
import { useLibrary } from "@/app/contexts/LibraryContext";
import { usePlaylists } from "@/app/contexts/PlaylistContext";
import { useState } from "react";


import Image from "next/image";
import styles from "./TopListSection.module.css";

import AddToPlaylistModal from "./AddToPlaylistModal";

export default function TopListSection({
  title,
  items = [],
  accentColor = "#e74c3c",
  type, //Agregué para identificar el tipo de item (cancion, artista o álbum)
}) {
  const { addToLibrary } = useLibrary();
  const { playlists, addToPlaylist, createPlaylist } = usePlaylists();
  const [selectedTrack, setSelectedTrack] = useState(null); // Estado para identificar el item seleccionado

  // Validación temprana
  if (!items || items.length === 0) {
    return (
      <section
        className={styles.section}
        style={{ "--accent-color": accentColor }}
      >
        <header className={styles.header}>
          <h2>{title}</h2>
        </header>
        <p style={{ textAlign: "center", padding: "1rem", color: "#666" }}>
          No hay datos disponibles
        </p>
      </section>
    );
  }

  return (
    <section
      className={styles.section}
      style={{ "--accent-color": accentColor }}
    >
      <header className={styles.header}>
        <h2>{title}</h2>
      </header>
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={item.id ?? `${item.name}-${index}`} className={styles.item}>
            <div className={styles.itemInfo}>
              <span className={styles.rank}>#{item.rank ?? index + 1}</span>
              {item.image ? (
                <div className={styles.thumbnail}>
                  <Image
                    src={item.image}
                    alt={item.name || item.title || "Item"}
                    width={56}
                    height={56}
                    sizes="56px"
                    className={styles.thumbnailImage}
                  />
                </div>
              ) : null}
              <div className={styles.textBlock}>
                <p className={styles.itemTitle}>{item.name || item.title}</p>
                {item.artist ? (
                  <p className={styles.itemSubtitle}>{item.artist}</p>
                ) : item.subtitle ? (
                  <p className={styles.itemSubtitle}>{item.subtitle}</p>
                ) : null}
              </div>
            </div>
            {item.popularity ? (
              <span className={styles.metric}>🔥 {item.popularity}</span>
            ) : item.followers ? (
              <span className={styles.metric}>
                👥 {item.followers.toLocaleString()}
              </span>
            ) : item.metric ? (
              <span className={styles.metric}>{item.metric}</span>
            ) : null}

            <div className={styles.buttonGroup}>
              {type === "track" && (
                <button
                  className={styles.saveButton}
                  onClick={() => setSelectedTrack(item)}
                >
                  ➕ Playlist
                </button>
              )}
                  
              
              <button
                className={styles.saveButton}
                onClick={() => addToLibrary(item)}
              >
                ➕ Biblioteca
              </button>


            </div>
          </li>
        ))}
      </ol>

      <AddToPlaylistModal
  track={selectedTrack}
  playlists={playlists}
  onSelect={(playlistId) => {
    addToPlaylist(playlistId, selectedTrack);
    setSelectedTrack(null);
  }}
  onCreatePlaylist={(name, track) => {
  const id = createPlaylist(name, "", [track]); 
  return id; 
}}
  onClose={() => setSelectedTrack(null)}
/>


    </section>
  );
}
