import SidebarNav from "@/components/SidebarNav";
import ProfilePanel from "@/components/ProfilePanel";
import TopListSection from "@/components/TopListSection";
import { getTopAlbums, getTopArtists, getTopTracks } from "@/lib/spotifyClient";
import styles from "./page.module.css";

const compactNumberFormatter = new Intl.NumberFormat("es-AR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatFollowers(followers) {
  if (!followers && followers !== 0) return null;
  return `${compactNumberFormatter.format(followers)} seguidores`;
}

function formatPopularity(popularity) {
  if (typeof popularity !== "number") return null;
  return `Popularidad ${popularity}/100`;
}

function formatReleaseDate(date) {
  if (!date) return null;
  try {
    const year = new Date(date).getFullYear();
    return Number.isNaN(year) ? null : `Lanzado ${year}`;
  } catch {
    return null;
  }
}

export default async function Home() {
  const [artistsResult, albumsResult] = await Promise.allSettled([
    getTopArtists({ limit: 5 }),
    getTopAlbums({ limit: 5 }),
  ]);

  //USO Promise.allSettled ya que esta promesa espera a que todas las promesas se resuelvan o rechacen,
  //y devuelve un array de objetos que describen el resultado de cada promesa individual.
  //De esta manera, si una de las llamadas a la API falla, las otras aún pueden resolverse y mostrarse acordemente.

  if (artistsResult.status === "rejected") {
    console.error("Top artists fetch failed:", artistsResult.reason);
  }
  if (albumsResult.status === "rejected") {
    console.error("Top albums fetch failed:", albumsResult.reason);
  }

  const topArtists = artistsResult.status === "fulfilled" ? artistsResult.value : [];
  const topAlbums = albumsResult.status === "fulfilled" ? albumsResult.value : [];
  let topTracks = [];

  if (topArtists.length > 0) {
    try {
      topTracks = await getTopTracks({
        artistIds: topArtists.map((artist) => artist.id),
        limit: 5,
        perArtist: 2,
      });
    } catch (error) {
      console.error("Top tracks fetch failed:", error);
    }
  }

  const sections = [
    {
      title: "Top Artistas",
      accentColor: "#c0392b",
      items: topArtists.map((artist) => ({
        id: artist.id,
        rank: artist.rank,
        title: artist.name,
        subtitle: artist.genres?.slice(0, 2).join(" · ") || "Artista destacado",
        metric: formatFollowers(artist.followers),
        image: artist.image,
      })),
    },
    {
      title: "Top Álbumes",
      accentColor: "#d35400",
      items: topAlbums.map((album) => ({
        id: album.id,
        rank: album.rank,
        title: album.name,
        subtitle: album.artist,
        metric: formatReleaseDate(album.releaseDate),
        image: album.image,
      })),
    },
    {
      title: "Top Canciones",
      accentColor: "#8e44ad",
      items: topTracks.map((track) => ({
        id: track.id,
        rank: track.rank,
        title: track.name,
        subtitle: track.artist,
        metric: formatPopularity(track.popularity),
        image: track.image,
      })),
    },
  ].filter((section) => section.items.length > 0);

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <SidebarNav />
        <main className={styles.main}>
          <div className={styles.topRow}>
            <header className={styles.hero}>
              <p className={styles.eyebrow}>MusicHub</p>
              <h1>Kapelle</h1>
              <p className={styles.description}>
                Encontra tu musica favorita y descubri nuevas canciones.
              </p>
            </header>
            <ProfilePanel />
          </div>

          {sections.length > 0 ? (
            <div className={styles.sections}>
              {sections.map((section) => (
                <TopListSection
                  key={section.title}
                  title={section.title}
                  items={section.items}
                  accentColor={section.accentColor}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No pudimos cargar datos de Spotify en este momento.</p>
              <p>Verificá tus credenciales o inténtalo de nuevo más tarde.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
