"use client";
import { createContext, useContext, useState } from "react";

const LibraryContext = createContext();

export function LibraryProvider({ children }) {
  const [libraryItems, setLibrary] = useState([]);

  function addToLibrary(item, type) {
    setLibrary((prev) =>
      prev.some((i) => i.id === item.id) ? prev : [...prev, item]
    );
  }

  function removeFromLibrary(id) {
    setLibrary((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <LibraryContext.Provider value={{ libraryItems, addToLibrary, removeFromLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}
