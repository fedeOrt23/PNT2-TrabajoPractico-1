import DashboardLayout from "@/components/DashboardLayout";
import styles from "../page.module.css";

export default function LibraryPage() {
  return (
    <DashboardLayout>
      <div className={styles.page}>
        <div className={styles.shell}>
          <main className={styles.main}>
            <header className={styles.hero}>
              <p className={styles.eyebrow}>MusicHub</p>
              <h1>Mi Biblioteca</h1>
              <p className={styles.description}>
                Guardado de artistas, albumes y playlists favoritos. Conecta tu
                cuenta de Spotify para sincronizar esta seccion con tus datos
                reales.
              </p>
            </header>

            <div className={styles.emptyState}>
              <p>Todavia no agregaste contenido a tu biblioteca.</p>
              <p>
                Cuando conectes tu cuenta, vas a ver tus playlists y favoritos
                aca.
              </p>
            </div>
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
