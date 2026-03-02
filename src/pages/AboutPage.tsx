import type { CSSProperties } from 'react';
import { usePreset } from '../app/usePreset';
import styles from './Page.module.css';

export function AboutPage() {
  const preset = usePreset();

  return (
    <>
      <section data-testid="route-about" className={`${styles.section} panel motionReveal`}>
        <span className="pill">About</span>
        <h1>{preset.about.headline}</h1>
        <p>{preset.about.story}</p>
      </section>

      <section
        className={`${styles.split} panel motionReveal`}
        style={{ '--reveal-delay': '90ms' } as CSSProperties}
      >
        <article className={styles.section}>
          <h2>Founder perspective</h2>
          <p>
            Led by {preset.about.founder}, our team focuses on practical plans and consistent outcomes for every
            client.
          </p>
          <p>
            We are {preset.about.yearsInBusiness} years in and still optimize each step for clarity, comfort, and
            quality.
          </p>
        </article>

        <aside className={styles.sideStack}>
          <div className={styles.listCard}>
            <h3>Core values</h3>
            <ul>
              {preset.about.values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>

          <div className={styles.listCard}>
            <h3>Service area</h3>
            <p>{preset.contact.serviceArea}</p>
          </div>
        </aside>
      </section>
    </>
  );
}
