"use client";

import React, { createContext, useContext, useState } from "react";

const LibraryContext = createContext();

export function LibraryProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);

  const saveSong = (song) =>
    setSongs((prev) => (prev.find((s) => s.id === song.id) ? prev : [...prev, song]));

  const removeSong = (id) => setSongs((prev) => prev.filter((s) => s.id !== id));
  const isSongSaved = (id) => songs.some((s) => s.id === id);

  const saveArtist = (artist) =>
    setArtists((prev) => (prev.find((a) => a.id === artist.id) ? prev : [...prev, artist]));

  const removeArtist = (id) => setArtists((prev) => prev.filter((a) => a.id !== id));
  const isArtistSaved = (id) => artists.some((a) => a.id === id);

  return (
    <LibraryContext.Provider
      value={{
        library: { songs, artists },
        saveSong,
        removeSong,
        isSongSaved,
        saveArtist,
        removeArtist,
        isArtistSaved,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}