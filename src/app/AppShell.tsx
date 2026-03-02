import { NavLink } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import { usePreset } from './usePreset';
import { NAV_ROUTES } from './routes';
import styles from './AppShell.module.css';

export function AppShell({ children }: PropsWithChildren) {
  const preset = usePreset();

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <NavLink to="/" className={styles.brand} aria-label={`${preset.businessName} home`}>
            <span className={styles.brandMark}>{preset.brand.mark}</span>
            <span className={styles.brandText}>
              <strong>{preset.businessName}</strong>
              <small>{preset.tagline}</small>
            </span>
          </NavLink>

          <nav aria-label="Primary navigation" className={styles.nav}>
            {NAV_ROUTES.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`.trim()}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <a className={styles.callPill} href={`tel:${preset.contact.phoneLink}`}>
            {preset.contact.phone}
          </a>
        </div>
      </header>

      <main className={`container ${styles.main}`}>{children}</main>

      <footer className={styles.footer}>
        <div className={`container ${styles.footerInner}`}>
          <div>
            <p className={styles.footerLead}>{preset.brand.accentPhrase}</p>
            <p className={styles.footerMuted}>{preset.contact.serviceArea}</p>
          </div>
          <div className={styles.footerMeta}>
            <a href={`mailto:${preset.contact.email}`}>{preset.contact.email}</a>
            <a href={`tel:${preset.contact.phoneLink}`}>{preset.contact.phone}</a>
          </div>
        </div>
      </footer>
    </>
  );
}
