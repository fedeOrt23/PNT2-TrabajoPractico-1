"use client";

import React, { useState } from "react";
import styles from "../page.module.css"; 
import libStyles from "./library.module.css"; // inputs y botones 
import { useLibrary } from "../../context/LibraryContext.jsx";
import SaveButton from "../../components/SaveButton.jsx";

export default function LibraryPage() {
  const { library, saveSong, saveArtist } = useLibrary();
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [artistOnly, setArtistOnly] = useState("");

  const makeId = (prefix, value) => `${prefix}-${value.replace(/\s+/g, "_")}-${Date.now()}`;

  const addSong = () => {
    if (!songName || !artistName) return;
    const song = { id: makeId("song", songName), name: songName, artist: artistName };
    saveSong(song);
    setSongName("");
    setArtistName("");
  };

  const addArtist = () => {
    if (!artistOnly) return;
    const artist = { id: makeId("artist", artistOnly), name: artistOnly };
    saveArtist(artist);
    setArtistOnly("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <main className={styles.main}>
          <header className={styles.hero}>
            <p className={styles.eyebrow}>MusicHub</p>
            <h1>Mi Biblioteca</h1>
            <p className={styles.description}>
              Guarda canciones y artistas directamente desde los resultados de Spotify.
              Esta biblioteca vive en memoria (se reinicia al recargar).
            </p>
          </header>

          
          <section className={styles.description}>
            <h3>Añadir canción</h3>
            <div className={libStyles.inputRow}>
              <input
                className={libStyles.input}
                placeholder="Nombre de la canción"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
              />
              <input
                className={libStyles.input}
                placeholder="Artista"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
              />
              <button className={libStyles.addButton} onClick={addSong}>
                Agregar
              </button>
            </div>
          </section>

          <section className={styles.description}>
            <h3>Añadir artista</h3>
            <div className={libStyles.inputRow}>
              <input
                className={libStyles.input}
                placeholder="Nombre del artista"
                value={artistOnly}
                onChange={(e) => setArtistOnly(e.target.value)}
              />
              <button className={libStyles.addButton} onClick={addArtist}>
                Agregar artista
              </button>
            </div>
          </section>

          
          <section className={styles.description}>
            <h3>Canciones guardadas</h3>
            {!library.songs.length ? (
              <div className={styles.emptyState}>
                <p>No hay canciones.</p>
              </div>
            ) : (
              <ul className={libStyles.list}>
                {library.songs.map((s) => (
                  <li key={s.id} className={libStyles.listItem}>
                    <div className={libStyles.itemMeta}>
                      <div className={libStyles.itemTitle}>{s.name}</div>
                      <div className={libStyles.itemSubtitle}>{s.artist}</div>
                    </div>
                    <SaveButton item={s} type="song" className={libStyles.itemAction} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={styles.description}>
            <h3>Artistas guardados</h3>
            {!library.artists.length ? (
              <div className={styles.emptyState}>
                <p>No hay artistas.</p>
              </div>
            ) : (
              <ul className={libStyles.list}>
                {library.artists.map((a) => (
                  <li key={a.id} className={libStyles.listItem}>
                    <div className={libStyles.itemMeta}>
                      <div className={libStyles.itemTitle}>{a.name}</div>
                    </div>
                    <SaveButton item={a} type="artist" className={libStyles.itemAction} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
