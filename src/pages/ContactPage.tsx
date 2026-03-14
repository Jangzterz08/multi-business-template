import type { CSSProperties } from 'react';
import { ContactForm } from '../components/ContactForm';
import { usePreset } from '../app/usePreset';
import styles from './Page.module.css';

export function ContactPage() {
  const preset = usePreset();
  const contactCopy = preset.pageCopy?.contact;

  return (
    <>
      <section data-testid="route-contact" className={`${styles.section} panel motionReveal`}>
        <span className="pill">{contactCopy?.badge ?? 'Contact'}</span>
        <h1>{contactCopy?.title ?? `Talk with ${preset.businessName}`}</h1>
        <p>{contactCopy?.intro ?? 'Use the form below and we will follow up with options, pricing context, and next steps.'}</p>
      </section>

      <section
        className={`${styles.split} panel motionReveal`}
        style={{ '--reveal-delay': '90ms' } as CSSProperties}
      >
        <article className={styles.section}>
          <h2>{contactCopy?.formTitle ?? 'Send your request'}</h2>
          <p>{contactCopy?.formDescription ?? 'Share a few details and we will point you to the best next step.'}</p>
          <ContactForm preset={preset} />
        </article>

        <aside className={styles.sideStack}>
          <div className={styles.listCard}>
            <h3>{contactCopy?.directTitle ?? 'Reach us directly'}</h3>
            <p>{preset.contact.address}</p>
            <p>
              <a href={`mailto:${preset.contact.email}`}>{preset.contact.email}</a>
            </p>
            <p>
              <a href={`tel:${preset.contact.phoneLink}`}>{preset.contact.phone}</a>
            </p>
          </div>

          <div className={styles.listCard}>
            <h3>{contactCopy?.hoursTitle ?? 'Hours'}</h3>
            <ul className={styles.hoursList}>
              {preset.contact.hours.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
