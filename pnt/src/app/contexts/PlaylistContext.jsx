"use client";

import { createContext, useContext, useState } from "react";

const PlaylistContext = createContext();

export function PlaylistProvider({ children }) {
  const [playlists, setPlaylists] = useState([]);

  function createPlaylist(name, description = "") {
    const newPlaylist = {
      id: crypto.randomUUID(),
      name,
      description,
      songs: [],
    };

    setPlaylists((prev) => [...prev, newPlaylist]);

    return newPlaylist.id;
  }

  function addToPlaylist(playlistId, song) {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, songs: [...p.songs, song] }
          : p
      )
    );
  }

  function removeFromPlaylist(playlistId, songId) {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.id === playlistId
          ? { ...p, songs: p.songs.filter((s) => s.id !== songId) }
          : p
      )
    );
  }

  function deletePlaylist(playlistId) {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  }

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        createPlaylist,
        addToPlaylist,
        removeFromPlaylist,
        deletePlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylists() {
  return useContext(PlaylistContext);
}
