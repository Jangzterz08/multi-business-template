import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import type { PresetConfig } from '../types/preset';
import styles from './RestaurantHome.module.css';

interface RestaurantHomeProps {
  preset: PresetConfig;
}

const foodImages = {
  hero: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1400&q=80',
  featureA: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80',
  featureB: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&w=900&q=80',
  featureC: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80',
  cta: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80',
  contact: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?auto=format&fit=crop&w=1000&q=80'
};

export function RestaurantHome({ preset }: RestaurantHomeProps) {
  return (
    <>
      <section data-testid="route-home" className={`${styles.hero} motionReveal`}>
        <div className={styles.heroContent}>
          <span className={styles.kicker}>{preset.brand.kicker}</span>
          <h1>{preset.hero.title}</h1>
          <p>{preset.hero.subtitle}</p>

          <div className={styles.actions}>
            <Link className="button buttonPrimary" to="/contact">
              {preset.hero.primaryCta}
            </Link>
            <Link className="button buttonSecondary" to="/services">
              {preset.hero.secondaryCta}
            </Link>
          </div>

          <div className={styles.stats}>
            <article>
              <strong>{preset.about.yearsInBusiness}+ years</strong>
              <span>Italian hospitality</span>
            </article>
            <article>
              <strong>{preset.services.length} menu experiences</strong>
              <span>From tasting to private events</span>
            </article>
            <article>
              <strong>{preset.contact.hours[0]}</strong>
              <span>Prime dinner seating</span>
            </article>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <img src={foodImages.hero} alt="Italian pasta and plated dinner" />
          <div className={styles.floatCards}>
            {preset.services.slice(0, 3).map((service) => (
              <article key={service.name}>
                <h3>{service.name}</h3>
                <p>{service.priceHint}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.lightBand} motionReveal`} style={{ '--reveal-delay': '100ms' } as CSSProperties}>
        <header className={styles.bandHeader}>
          <h2>Chef Highlights</h2>
          <p>Signature dishes and event-friendly menu formats tailored for your evening.</p>
        </header>

        <div className={styles.highlightsGrid}>
          <img src={foodImages.featureA} alt="Fresh Italian dish" />
          <article>
            <h3>{preset.services[0]?.name}</h3>
            <p>{preset.services[0]?.blurb}</p>
          </article>
          <article>
            <h3>{preset.services[1]?.name}</h3>
            <p>{preset.services[1]?.blurb}</p>
          </article>
          <img src={foodImages.featureB} alt="Chef plated specialty" />
        </div>
      </section>

      <section className={`${styles.darkBand} motionReveal`} style={{ '--reveal-delay': '180ms' } as CSSProperties}>
        <header className={styles.bandHeaderDark}>
          <h2>Our Italian Experience</h2>
          <p>
            Designed for date nights, celebrations, and business dinners with regional wines, fresh pasta, and
            polished service.
          </p>
        </header>

        <div className={styles.experienceGrid}>
          <article>
            <h3>House-Made Daily</h3>
            <p>Fresh dough and sauces prepared in-house for dependable quality every service.</p>
          </article>
          <img src={foodImages.featureC} alt="Italian tasting plate" />
          <article>
            <h3>Private Dining Ready</h3>
            <p>Flexible layouts and menu curation for intimate events and milestone evenings.</p>
          </article>
        </div>
      </section>

      <section className={`${styles.ctaBand} motionReveal`} style={{ '--reveal-delay': '240ms' } as CSSProperties}>
        <div>
          <span className={styles.kicker}>Reserve Tonight</span>
          <h2>Book your table at {preset.businessName}</h2>
          <p>{preset.brand.accentPhrase}</p>
          <Link className="button buttonPrimary" to="/contact">
            Request reservation
          </Link>
        </div>
        <img src={foodImages.cta} alt="Italian plated food close-up" />
      </section>

      <section className={`${styles.contactBand} motionReveal`} style={{ '--reveal-delay': '300ms' } as CSSProperties}>
        <header className={styles.bandHeader}>
          <h2>Contact & Reservation Details</h2>
          <p>Share your date, party size, and preferences. We will confirm availability quickly.</p>
        </header>

        <div className={styles.contactGrid}>
          <img src={foodImages.contact} alt="Restaurant table setting" />
          <div className={styles.contactCard}>
            <h3>Reservation Desk</h3>
            <ul>
              <li>
                <strong>Phone:</strong> <a href={`tel:${preset.contact.phoneLink}`}>{preset.contact.phone}</a>
              </li>
              <li>
                <strong>Email:</strong> <a href={`mailto:${preset.contact.email}`}>{preset.contact.email}</a>
              </li>
              <li>
                <strong>Address:</strong> {preset.contact.address}
              </li>
            </ul>
            <div className={styles.hoursBox}>
              <h4>Hours</h4>
              <ul>
                {preset.contact.hours.map((entry) => (
                  <li key={entry}>{entry}</li>
                ))}
              </ul>
            </div>
            <div className={styles.contactActions}>
              <Link className="button buttonPrimary" to="/contact">
                Book now
              </Link>
              <Link className="button buttonSecondary" to="/services">
                Full menu
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
