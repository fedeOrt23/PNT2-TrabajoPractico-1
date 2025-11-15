"use client";
import { useLibrary } from "@/app/contexts/LibraryContext";
import { usePlaylists } from "@/app/contexts/PlaylistContext";
import { useState } from "react";


import Image from "next/image";
import styles from "./TopListSection.module.css";


export default function TopListSection({
  title,
  items = [],
  accentColor = "#e74c3c",
  type, //Agregué para identificar el tipo de item (cancion, artista o álbum)
}) {
  const { addToLibrary } = useLibrary();
  const { playlists, addToPlaylist } = usePlaylists();
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
                  
              {  //popup para agregar a playlist
              selectedTrack && (
  <div className={styles.playlistPopup}>
    <h4>Agregar a playlist</h4>

    {playlists.length === 0 && (
      <p style={{ padding: "0.5rem 0" }}>No tenés playlists todavía.</p>
    )}

    {playlists.map((p) => (
      <button
        key={p.id}
        className={styles.playlistOption}
        onClick={() => {
          addToPlaylist(p.id, selectedTrack);
          setSelectedTrack(null); // cerrar popup
        }}
      >
        {p.name}
      </button>
    ))}

    <button
      className={styles.cancelButton}
      onClick={() => setSelectedTrack(null)}
    >
      Cancelar
    </button>
  </div>
)
//fin popup
}


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
    </section>
  );
}
