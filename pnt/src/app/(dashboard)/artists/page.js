import SidebarNav from "@/components/SidebarNav";
import styles from "../page.module.css";

export default function ArtistsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <main className={styles.main}>
          <header className={styles.hero}>
            <p className={styles.eyebrow}>MusicHub</p>
            <h1>Artistas</h1>
            <p className={styles.description}>
              Explora artistas recomendados y mantenete al dia con sus nuevos
              lanzamientos. Esta seccion puede mostrar artistas seguidos o
              destacados de tu region.
            </p>
          </header>

          <div className={styles.emptyState}>
            <p>No hay artistas cargados todavia.</p>
            <p>
              Cuando tengas un endpoint listo, podras listar tus favoritos aca.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
