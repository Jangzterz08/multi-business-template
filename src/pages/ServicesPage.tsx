import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ServiceGrid } from '../components/ServiceGrid';
import { useLocalizedPreset } from '../app/useLocalizedPreset';
import styles from './Page.module.css';

export function ServicesPage() {
  const preset = useLocalizedPreset();
  const servicesCopy = preset.pageCopy?.services;
  const journeySteps =
    servicesCopy?.journeySteps && servicesCopy.journeySteps.length > 0
      ? servicesCopy.journeySteps
      : [
          'Tell us what you need and what timing works best for you.',
          'We reply with the best-fit option and any helpful prep details.',
          'Choose your next step and move forward with confidence.'
        ];

  return (
    <>
      <section data-testid="route-services" className={`${styles.section} panel motionReveal`}>
        <span className="pill">{servicesCopy?.badge ?? 'Services'}</span>
        <h1>{servicesCopy?.title ?? `${preset.businessName} services`}</h1>
        <p>{servicesCopy?.intro ?? 'Choose the option that best fits your goals, timing, and budget.'}</p>
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
        <h2>{servicesCopy?.journeyTitle ?? 'How it works'}</h2>
        <ul>
          {journeySteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
        <Link className="button buttonPrimary" to="/contact">
          {servicesCopy?.ctaLabel ?? 'Start your request'}
        </Link>
      </section>
    </>
  );
}
