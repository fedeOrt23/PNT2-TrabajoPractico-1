import DashboardLayout from "@/components/DashboardLayout";
import TopListSection from "@/components/TopListSection";
import { getTopAlbums, getTopArtists, getTopTracks } from "@/lib/spotifyClient";
import styles from "./page.module.css";

export default async function Home() {
  try {
    // Primero obtenemos los artistas
    const topArtists = await getTopArtists({ limit: 5 });
    console.log("Top Artists:", topArtists);

    // Extraemos los IDs de los artistas para obtener sus tracks
    const artistIds = topArtists.map((artist) => artist.id);
    console.log("Artist IDs:", artistIds);

    // Obtenemos albums y tracks en paralelo
    const [topTracks, topAlbums] = await Promise.all([
      getTopTracks({ artistIds, limit: 5, perArtist: 2 }),
      getTopAlbums({ limit: 5 }),
    ]);

    console.log("Top Tracks:", topTracks);
    console.log("Top Albums:", topAlbums);

    return (
      <DashboardLayout>
        <div className={styles.container}>
          <h1 className={styles.title}>Descubre tu música</h1>

          {topTracks && topTracks.length > 0 && (
            <TopListSection
              title="Top Canciones"
              items={topTracks}
              type="track"
            />
          )}

          {topArtists && topArtists.length > 0 && (
            <TopListSection
              title="Top Artistas"
              items={topArtists}
              type="artist"
            />
          )}

          {topAlbums && topAlbums.length > 0 && (
            <TopListSection
              title="Top Álbumes"
              items={topAlbums}
              type="album"
            />
          )}

          {(!topTracks || topTracks.length === 0) &&
            (!topArtists || topArtists.length === 0) &&
            (!topAlbums || topAlbums.length === 0) && (
              <p style={{ textAlign: "center", padding: "2rem" }}>
                No hay datos disponibles. Intenta conectar tu cuenta de Spotify.
              </p>
            )}
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error("Error loading music data:", error);
    return (
      <DashboardLayout>
        <div className={styles.container}>
          <h1 className={styles.title}>Error al cargar datos</h1>
          <p style={{ textAlign: "center", padding: "2rem" }}>
            Ocurrió un error al cargar los datos de Spotify. Por favor, intenta
            nuevamente.
          </p>
        </div>
      </DashboardLayout>
    );
  }
}
