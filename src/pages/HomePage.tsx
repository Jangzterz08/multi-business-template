import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ServiceGrid } from '../components/ServiceGrid';
import { TestimonialGrid } from '../components/TestimonialGrid';
import { usePreset } from '../app/usePreset';
import { RestaurantHome } from './RestaurantHome';
import styles from './Page.module.css';

export function HomePage() {
  const preset = usePreset();
  const homeCopy = preset.pageCopy?.home;
  const metrics =
    homeCopy?.metrics && homeCopy.metrics.length > 0
      ? homeCopy.metrics
      : [
          { value: `${preset.about.yearsInBusiness}+ years`, label: 'Serving local clients' },
          { value: `${preset.services.length} focused services`, label: 'Clear options for different needs' },
          { value: preset.contact.hours[0], label: 'Fast response windows' }
        ];

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
          {metrics.map((item) => (
            <article key={`${item.value}-${item.label}`} className={styles.metric}>
              <strong>{item.value}</strong>
              <p>{item.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className={`${styles.section} panel motionReveal`}
        style={{ '--reveal-delay': '90ms' } as CSSProperties}
      >
        <div className={styles.sectionHeading}>
          <h2>{homeCopy?.featuredTitle ?? 'Featured offers'}</h2>
          <p>{homeCopy?.featuredDescription ?? 'Start with the options people ask about most often.'}</p>
        </div>
        <ServiceGrid services={preset.services.slice(0, 3)} />
        <Link to="/services" className="button buttonSecondary">
          {homeCopy?.featuredCtaLabel ?? 'View everything'}
        </Link>
      </section>

      <section
        className={`${styles.section} panel motionReveal`}
        style={{ '--reveal-delay': '150ms' } as CSSProperties}
      >
        <div className={styles.sectionHeading}>
          <h2>{homeCopy?.testimonialsTitle ?? 'What people say'}</h2>
          <p>{homeCopy?.testimonialsDescription ?? 'Recent feedback from the people we serve.'}</p>
        </div>
        <TestimonialGrid testimonials={preset.testimonials} />
      </section>
    </>
  );
}
