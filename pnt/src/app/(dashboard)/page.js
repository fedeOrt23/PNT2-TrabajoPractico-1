import TopListSection from "@/components/TopListSection";
import { getTopAlbums, getTopArtists, getTopTracks } from "@/lib/spotifyClient";
import styles from "./page.module.css";

export default async function Home() {
  try {
    const [topTracks, topArtists, topAlbums] = await Promise.all([
      getTopTracks(),
      getTopArtists(),
      getTopAlbums(),
    ]);

    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Descubre tu música</h1>

        {topTracks?.items && topTracks.items.length > 0 && (
          <TopListSection
            title="Top Canciones"
            items={topTracks.items}
            type="track"
          />
        )}

        {topArtists?.items && topArtists.items.length > 0 && (
          <TopListSection
            title="Top Artistas"
            items={topArtists.items}
            type="artist"
          />
        )}

        {topAlbums?.items && topAlbums.items.length > 0 && (
          <TopListSection
            title="Top Álbumes"
            items={topAlbums.items}
            type="album"
          />
        )}

        {!topTracks?.items && !topArtists?.items && !topAlbums?.items && (
          <p style={{ textAlign: "center", padding: "2rem" }}>
            No hay datos disponibles. Intenta conectar tu cuenta de Spotify.
          </p>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading music data:", error);
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Error al cargar datos</h1>
        <p style={{ textAlign: "center", padding: "2rem" }}>
          Ocurrió un error al cargar los datos de Spotify. Por favor, intenta
          nuevamente.
        </p>
      </div>
    );
  }
}
