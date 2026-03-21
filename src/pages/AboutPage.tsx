import type { CSSProperties } from 'react';
import { useLocalizedPreset } from '../app/useLocalizedPreset';
import styles from './Page.module.css';

export function AboutPage() {
  const preset = useLocalizedPreset();
  const aboutCopy = preset.pageCopy?.about;
  const featureParagraphs =
    aboutCopy?.featureParagraphs && aboutCopy.featureParagraphs.length > 0
      ? aboutCopy.featureParagraphs
      : [
          `Led by ${preset.about.founder}, our team focuses on practical plans and consistent outcomes for every client.`,
          `We are ${preset.about.yearsInBusiness} years in and still optimize each step for clarity, comfort, and quality.`
        ];

  return (
    <>
      <section data-testid="route-about" className={`${styles.section} panel motionReveal`}>
        <span className="pill">{aboutCopy?.badge ?? 'About'}</span>
        <h1>{preset.about.headline}</h1>
        <p>{preset.about.story}</p>
      </section>

      <section
        className={`${styles.split} panel motionReveal`}
        style={{ '--reveal-delay': '90ms' } as CSSProperties}
      >
        <article className={styles.section}>
          <h2>{aboutCopy?.featureTitle ?? 'Founder perspective'}</h2>
          {featureParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>

        <aside className={styles.sideStack}>
          <div className={styles.listCard}>
            <h3>{aboutCopy?.valuesTitle ?? 'Core values'}</h3>
            <ul>
              {preset.about.values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </div>

          <div className={styles.listCard}>
            <h3>{aboutCopy?.serviceAreaTitle ?? 'Service area'}</h3>
            <p>{preset.contact.serviceArea}</p>
          </div>
        </aside>
      </section>
    </>
  );
}
