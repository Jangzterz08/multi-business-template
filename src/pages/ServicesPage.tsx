import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ServiceGrid } from '../components/ServiceGrid';
import { usePreset } from '../app/usePreset';
import styles from './Page.module.css';

export function ServicesPage() {
  const preset = usePreset();

  return (
    <>
      <section data-testid="route-services" className={`${styles.section} panel motionReveal`}>
        <span className="pill">Service Menu</span>
        <h1>{preset.businessName} services</h1>
        <p>
          Every card below is generated from the preset configuration. Update names, blurbs, and pricing hints from
          one file.
        </p>
      </section>

      <section
        className={`${styles.section} panel motionReveal`}
        style={{ '--reveal-delay': '90ms' } as CSSProperties}
      >
        <ServiceGrid services={preset.services} />
      </section>

      <section
        className={`${styles.section} panel motionReveal`}
        style={{ '--reveal-delay': '150ms' } as CSSProperties}
      >
        <h2>Booking flow</h2>
        <ul>
          <li>Share your goals and timing through the contact form.</li>
          <li>Get a response with availability and prep guidance.</li>
          <li>Confirm your appointment and receive a reminder.</li>
        </ul>
        <Link className="button buttonPrimary" to="/contact">
          Start your request
        </Link>
      </section>
    </>
  );
}
