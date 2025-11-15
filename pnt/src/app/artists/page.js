"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import ArtistCard from "@/components/ArtistCard";
import {
  getAllArtists,
  createArtist,
  updateArtist,
  deleteArtist,
} from "@/app/api/spotify_token/services/ABMartistas";
import styles from "../page.module.css";


export default function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchArtists = async () => {
    try {
      const data = await getAllArtists();
      setArtists(data);
    } catch (err) {
      setError("No se pudieron cargar los artistas.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleCreate = () => {
    (async () => {
      const name = prompt("Nombre del artista:");
      if (name === null) return; 
      const trimmedName = name.trim();
      if (!trimmedName) {
        alert("El nombre no puede estar vacío.");
        return;
      }

      const image = prompt("URL de imagen (dejar vacío para no establecer):", "") || "";
      if (image === null) return; 

      const newArtist = {
        name: trimmedName,
        image: image.trim() === "" ? undefined : image.trim(),
        followers: 0,
      };

      try {
        await createArtist(newArtist);
        await fetchArtists();
        alert("Artista creado correctamente.");
      } catch (err) {
        console.error("Error al crear artista:\n", err);
        alert("No se pudo crear el artista. Revisa la consola para más detalles.");
      }
    })();
  };

  const handleEdit = async (artist) => {
    const newName = prompt("Editar nombre del artista:", artist.name);
    if (newName === null) return;

    const newImage = prompt("Editar URL de imagen (dejar vacío para mantener la actual):", artist.image || "");
    if (newImage === null) return;

    const updated = {
      name: newName.trim() || artist.name,
      image: newImage.trim() === "" ? artist.image : newImage.trim(),
      followers: artist.followers || 0,
    };

    try {
      await updateArtist(artist.id, updated);
      await fetchArtists();
    } catch (err) {
      console.error("Error al actualizar artista:", err);
      alert("No se pudo guardar el artista. Revisa la consola.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de que quieres eliminar este artista?")) {
      await deleteArtist(id);
      fetchArtists();
    }
  };

  try {
    return (
      <DashboardLayout>
        <div className={styles.page}>
          <div className={styles.shell}>
            <main className={styles.main}>
              <header className={styles.hero}>
                <p className={styles.eyebrow}>Kapelle</p>
                <h1>Artistas</h1>
                <p className={styles.description}>
                  Estos son los artistas más relevantes del momento, junto con
                  sus canciones más populares.
                </p>
                <button onClick={handleCreate} className={styles.createButton}>Crear Artista</button>
              </header>

              <div className={styles.sections}>
                {artists.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </main>
          </div>
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error("Error al cargar la página de artistas:", error || e);
    return (
      <DashboardLayout>
        <div className={styles.page}>
          <main className={styles.main}>
            <div className={styles.emptyState}>
              <h1>{error || "Error al cargar los artistas"}</h1>
              <p>No se pudo obtener la información desde Kapelle.</p>
            </div>
          </main>
        </div>
      </DashboardLayout>
    );
  }
}
