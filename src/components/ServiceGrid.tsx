import type { CSSProperties } from 'react';
import type { ServiceItem } from '../types/preset';
import styles from './ServiceGrid.module.css';

interface ServiceGridProps {
  services: ServiceItem[];
}

export function ServiceGrid({ services }: ServiceGridProps) {
  return (
    <div className={styles.grid}>
      {services.map((service, index) => (
        <article
          key={service.name}
          className={`${styles.card} motionReveal`}
          style={{ '--reveal-delay': `${index * 80}ms` } as CSSProperties}
        >
          <div className={styles.headerRow}>
            <h3>{service.name}</h3>
            <span className="pill">{service.duration}</span>
          </div>
          <p>{service.blurb}</p>
          <div className={styles.price}>{service.priceHint}</div>
        </article>
      ))}
    </div>
  );
}
