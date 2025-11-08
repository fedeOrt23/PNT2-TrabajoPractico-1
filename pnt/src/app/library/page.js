"use client";

import React, { useState } from "react";
import { useLibrary } from "../../context/LibraryContext.jsx";
import SaveButton from "../../components/SaveButton.jsx";
import pageStyles from "../page.module.css";
import styles from "./library.module.css";

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
    <main className={pageStyles.main}>
      <h1 className={pageStyles.title}>Mi Biblioteca (memoria)</h1>

      <section className={pageStyles.description}>
        <h3>Añadir canción</h3>
        <div className={styles.inputRow}>
          <input
            className={styles.input}
            placeholder="Nombre de la canción"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
          />
          <input
            className={styles.input}
            placeholder="Artista"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
          />
          <button className={styles.addButton} onClick={addSong}>Agregar</button>
        </div>
      </section>

      <section className={pageStyles.description}>
        <h3>Añadir artista</h3>
        <div className={styles.inputRow}>
          <input
            className={styles.input}
            placeholder="Nombre del artista"
            value={artistOnly}
            onChange={(e) => setArtistOnly(e.target.value)}
          />
          <button className={styles.addButton} onClick={addArtist}>Agregar artista</button>
        </div>
      </section>

      <section className={pageStyles.description}>
        <h3>Canciones guardadas</h3>
        {!library.songs.length ? (
          <p>No hay canciones.</p>
        ) : (
          <ul className={styles.list}>
            {library.songs.map((s) => (
              <li key={s.id} className={styles.listItem}>
                <div className={styles.itemMeta}>
                  <div className={styles.itemTitle}>{s.name}</div>
                  <div className={styles.itemSubtitle}>{s.artist}</div>
                </div>
                <SaveButton item={s} type="song" className={styles.itemAction} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={pageStyles.description}>
        <h3>Artistas guardados</h3>
        {!library.artists.length ? (
          <p>No hay artistas.</p>
        ) : (
          <ul className={styles.list}>
            {library.artists.map((a) => (
              <li key={a.id} className={styles.listItem}>
                <div className={styles.itemMeta}>
                  <div className={styles.itemTitle}>{a.name}</div>
                </div>
                <SaveButton item={a} type="artist" className={styles.itemAction} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
