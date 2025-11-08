"use client";

import React from "react";
import { useLibrary } from "../context/LibraryContext";

export default function SaveButton({ item, type = "song", className = "" }) {
  const {
    saveSong,
    removeSong,
    isSongSaved,
    saveArtist,
    removeArtist,
    isArtistSaved,
  } = useLibrary();

  const saved = type === "song" ? isSongSaved(item.id) : isArtistSaved(item.id);

  const toggle = () => {
    if (type === "song") {
      saved ? removeSong(item.id) : saveSong(item);
    } else {
      saved ? removeArtist(item.id) : saveArtist(item);
    }
  };

  return (
    <button type="button" onClick={toggle} className={className}>
      {saved ? "Quitar" : "Guardar"}
    </button>
  );
}