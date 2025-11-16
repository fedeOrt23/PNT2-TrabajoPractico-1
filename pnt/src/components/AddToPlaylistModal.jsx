"use client";
import { useState } from "react";

export default function AddToPlaylistModal({
  track,
  playlists,
  onSelect,         // callback para agregar track a playlist existente
  onCreatePlaylist, // NUEVO callback para crear playlist
  onClose,
}) {
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  if (!track) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#111",
          padding: "1.5rem",
          borderRadius: "12px",
          width: "320px",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>
          Agregar "{track.title || track.name}" a playlist
        </h3>

        {/* UI para crear nueva playlist  */}
        {creating ? (
          <>
            <input
              type="text"
              placeholder="Nombre de la playlist"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "0.6rem",
                borderRadius: "6px",
                border: "1px solid #444",
                background: "#222",
                color: "#fff",
              }}
            />

            <button
              onClick={() => {
                if (!newName.trim()) return;
                const newPlaylistId = onCreatePlaylist(newName);
                onSelect(newPlaylistId); // agrega el track automáticamente
                onClose();
              }}
              style={{
                width: "100%",
                padding: "0.6rem",
                borderRadius: "6px",
                background: "#1db954",
                marginBottom: "0.5rem",
              }}
            >
              Crear y agregar
            </button>

            <button
              onClick={() => setCreating(false)}
              style={{
                width: "100%",
                padding: "0.6rem",
                background: "#333",
                borderRadius: "6px",
              }}
            >
              Cancelar
            </button>
          </>
        ) : (
          <>
            {/* --- Lista de playlists existentes --- */}
            {playlists.length === 0 ? (
              <p style={{ marginBottom: "0.8rem" }}>
                No tenés playlists todavía.
              </p>
            ) : (
              playlists.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelect(p.id);
                    onClose();
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "0.5rem",
                    marginBottom: "0.4rem",
                    borderRadius: "6px",
                    background: "#222",
                  }}
                >
                  {p.name}
                </button>
              ))
            )}

            <button
              onClick={() => setCreating(true)}
              style={{
                width: "100%",
                padding: "0.6rem",
                background: "#1db954",
                borderRadius: "6px",
                marginTop: "0.5rem",
              }}
            >
              + Nueva Playlist
            </button>

            <button
              onClick={onClose}
              style={{
                marginTop: "1rem",
                width: "100%",
                padding: "0.6rem",
                background: "#333",
                borderRadius: "6px",
              }}
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
