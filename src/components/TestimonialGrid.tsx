import type { CSSProperties } from 'react';
import type { Testimonial } from '../types/preset';
import styles from './TestimonialGrid.module.css';

interface TestimonialGridProps {
  testimonials: Testimonial[];
}

export function TestimonialGrid({ testimonials }: TestimonialGridProps) {
  return (
    <div className={styles.grid}>
      {testimonials.map((item, index) => (
        <figure
          key={`${item.name}-${item.role}`}
          className={`${styles.card} motionReveal`}
          style={{ '--reveal-delay': `${index * 90}ms` } as CSSProperties}
        >
          <blockquote>“{item.quote}”</blockquote>
          <figcaption>
            <strong>{item.name}</strong>
            <span>{item.role}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
