import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ServiceGrid } from '../components/ServiceGrid';
import { TestimonialGrid } from '../components/TestimonialGrid';
import { usePreset } from '../app/usePreset';
import { RestaurantHome } from './RestaurantHome';
import styles from './Page.module.css';

export function HomePage() {
  const preset = usePreset();
  if (preset.id === 'restaurant') {
    return <RestaurantHome preset={preset} />;
  }

  return (
    <>
      <section data-testid="route-home" className={`${styles.hero} panel motionReveal`}>
        <span className="pill">{preset.brand.kicker}</span>
        <h1>{preset.hero.title}</h1>
        <p className={styles.heroLead}>{preset.hero.subtitle}</p>

        <div className={styles.heroActions}>
          <Link className="button buttonPrimary" to="/contact">
            {preset.hero.primaryCta}
          </Link>
          <Link className="button buttonSecondary" to="/services">
            {preset.hero.secondaryCta}
          </Link>
        </div>

        <div className={styles.metricRow}>
          <article className={styles.metric}>
            <strong>{preset.about.yearsInBusiness}+ years</strong>
            <p>Serving local clients</p>
          </article>
          <article className={styles.metric}>
            <strong>{preset.services.length} focused services</strong>
            <p>Structured options with clear scope</p>
          </article>
          <article className={styles.metric}>
            <strong>{preset.contact.hours[0]}</strong>
            <p>Fast response windows</p>
          </article>
        </div>
      </section>

      <section
        className={`${styles.section} panel motionReveal`}
        style={{ '--reveal-delay': '90ms' } as CSSProperties}
      >
        <div className={styles.sectionHeading}>
          <h2>Featured services</h2>
          <p>Pre-built cards are connected to preset config. Swap content in one place.</p>
        </div>
        <ServiceGrid services={preset.services.slice(0, 3)} />
        <Link to="/services" className="button buttonSecondary">
          View full service menu
        </Link>
      </section>

      <section
        className={`${styles.section} panel motionReveal`}
        style={{ '--reveal-delay': '150ms' } as CSSProperties}
      >
        <div className={styles.sectionHeading}>
          <h2>Client voice</h2>
          <p>Use these placeholders or replace from `preset.testimonials`.</p>
        </div>
        <TestimonialGrid testimonials={preset.testimonials} />
      </section>
    </>
  );
}
