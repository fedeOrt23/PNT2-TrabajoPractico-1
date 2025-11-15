"use client";

import { useParams } from "next/navigation";
import { usePlaylists } from "@/app/contexts/PlaylistContext";
import DashboardLayout from "@/components/DashboardLayout";

export default function PlaylistDetailPage() {
  const { id } = useParams(); 
  const { playlists, removeFromPlaylist, deletePlaylist } = usePlaylists();

  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <DashboardLayout>
        <div style={{ padding: "2rem" }}>
          <h1>Playlist no encontrada</h1>
          <p>La playlist no existe o fue eliminada.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ padding: "2rem" }}>
        <h1>{playlist.name}</h1>
        <p>{playlist.description}</p>

        <button
          style={{ margin: "1rem 0", background: "red", color: "white" }}
          onClick={() => deletePlaylist(playlist.id)}
        >
          Eliminar playlist
        </button>

        <h2 style={{ marginTop: "2rem" }}>Canciones</h2>

        {playlist.songs.length === 0 && (
          <p>No hay canciones agregadas todavía.</p>
        )}

        <ul style={{ marginTop: "1rem" }}>
          {playlist.songs.map((song) => (
            <li key={song.id} style={{ marginBottom: "1rem" }}>
              <strong>{song.name}</strong> — {song.artist}
              <button
                style={{ marginLeft: "1rem" }}
                onClick={() => removeFromPlaylist(playlist.id, song.id)}
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
}
