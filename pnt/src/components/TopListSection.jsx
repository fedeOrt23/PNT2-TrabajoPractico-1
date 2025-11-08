import Image from "next/image";
import styles from "./TopListSection.module.css";

export default function TopListSection({ title, items = [], accentColor = "#e74c3c" }) {
  // Validación temprana
  if (!items || items.length === 0) {
    return (
      <section className={styles.section} style={{ "--accent-color": accentColor }}>
        <header className={styles.header}>
          <h2>{title}</h2>
        </header>
        <p style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
          No hay datos disponibles
        </p>
      </section>
    );
  }

  return (
    <section className={styles.section} style={{ "--accent-color": accentColor }}>
      <header className={styles.header}>
        <h2>{title}</h2>
      </header>
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={item.id ?? `${item.title}-${index}`} className={styles.item}>
            <div className={styles.itemInfo}>
              <span className={styles.rank}>#{item.rank ?? index + 1}</span>
              {item.image ? (
                <div className={styles.thumbnail}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={56}
                    height={56}
                    sizes="56px"
                    className={styles.thumbnailImage}
                  />
                </div>
              ) : null}
              <div className={styles.textBlock}>
                <p className={styles.itemTitle}>{item.title}</p>
                {item.subtitle ? (
                  <p className={styles.itemSubtitle}>{item.subtitle}</p>
                ) : null}
              </div>
            </div>
            {item.metric ? (
              <span className={styles.metric}>{item.metric}</span>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
