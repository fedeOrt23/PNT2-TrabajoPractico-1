import DashboardLayout from "@/components/DashboardLayout";
import TopListSection from "@/components/TopListSection";
import {
  getTopArtists,
  getTopTracks,
  getTopAlbums,
} from "@/lib/spotifyClient";
import styles from "../page.module.css";
function ArtistCard({ artist, topTracks }) {
  const description = `Con más de ${(
    artist.followers || 0
  ).toLocaleString("es-ES")} seguidores.`;

  
  const artistTracks = topTracks.filter(track =>
    track.artist.includes(artist.name)
  ).map((track, index) => ({ 
    ...track,
    rank: index + 1,
  }));
  return (
    <div className={styles.hero}>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        {artist.image && (
          <img
            src={artist.image}
            alt={`Foto de ${artist.name}`}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        )}
        <div>
          <h2 style={{ fontSize: "2rem", margin: 0 }}>{artist.name}</h2>
          <p className={styles.description} style={{ fontSize: "16px" }}>
            {description}
          </p>
        </div>
      </div>

      {artistTracks.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <TopListSection
            title="Canciones más conocidas"
            items={artistTracks}
            type="track"
          />
        </div>
      )}
    </div>
  );
}

export default async function ArtistsPage() {
  try {
    const topArtists = await getTopArtists({ limit: 5 });
    const artistIds = topArtists.map((artist) => artist.id);

    const allTopTracks = await getTopTracks({ artistIds, limit: 15, perArtist: 3 });

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
              </header>

              <div className={styles.sections}>
                {topArtists.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    topTracks={allTopTracks}
                  />
                ))}

                
              </div>
            </main>
          </div>
        </div>
      </DashboardLayout>
    );
  } catch (error) {
    console.error("Error al cargar la página de artistas:", error);
    return (
      <DashboardLayout>
        <div className={styles.page}>
          <main className={styles.main}>
            <div className={styles.emptyState}>
              <h1>Error al cargar los artistas</h1>
              <p>No se pudo obtener la información desde Kapelle.</p>
            </div>
          </main>
        </div>
      </DashboardLayout>
    );
  }
}
