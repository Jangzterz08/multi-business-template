import { NavLink } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
import { useLocalizedPreset } from './useLocalizedPreset';
import { useSitePreferences } from './SitePreferencesContext';
import { getNavRoutes } from './routes';
import styles from './AppShell.module.css';

export function AppShell({ children }: PropsWithChildren) {
  const preset = useLocalizedPreset();
  const { locale, localeToggleVisible, setLocale, themeMode, toggleThemeMode } = useSitePreferences();
  const hasPhoneContact = Boolean(preset.contact.phone && preset.contact.phoneLink);
  const navRoutes = getNavRoutes(preset.pageCopy?.navigation);
  const brandHomeLabel = locale === 'it' ? `Vai alla home di ${preset.businessName}` : `${preset.businessName} home`;

  const languageGroupLabel = locale === 'it' ? 'Lingua del sito' : 'Website language';
  const themeButtonLabel =
    themeMode === 'dark'
      ? locale === 'it'
        ? 'Passa al tema chiaro'
        : 'Switch website to light mode'
      : locale === 'it'
        ? 'Passa al tema scuro'
        : 'Switch website to dark mode';

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <NavLink to="/" className={styles.brand} aria-label={brandHomeLabel}>
            <span className={styles.brandMark}>{preset.brand.mark}</span>
            <span className={styles.brandText}>
              <strong>{preset.businessName}</strong>
              <small>{preset.tagline}</small>
            </span>
          </NavLink>

          <nav aria-label="Primary navigation" className={styles.nav}>
            {navRoutes.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`.trim()}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.headerControls}>
            <button
              type="button"
              className={styles.themeToggle}
              aria-label={themeButtonLabel}
              onClick={toggleThemeMode}
            >
              {themeMode === 'dark' ? (locale === 'it' ? 'Chiaro' : 'Light') : locale === 'it' ? 'Scuro' : 'Dark'}
            </button>
            {localeToggleVisible ? (
              <div className={styles.languageSwitch} role="group" aria-label={languageGroupLabel}>
                <button
                  type="button"
                  className={`${styles.languageOption} ${locale === 'en' ? styles.languageOptionActive : ''}`.trim()}
                  aria-label={locale === 'it' ? 'Passa il sito in inglese' : 'Switch website to English'}
                  aria-pressed={locale === 'en'}
                  onClick={() => setLocale('en')}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={`${styles.languageOption} ${locale === 'it' ? styles.languageOptionActive : ''}`.trim()}
                  aria-label={locale === 'it' ? 'Passa il sito in italiano' : 'Switch website to Italian'}
                  aria-pressed={locale === 'it'}
                  onClick={() => setLocale('it')}
                >
                  IT
                </button>
              </div>
            ) : null}
          </div>
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
            {hasPhoneContact ? <a href={`tel:${preset.contact.phoneLink}`}>{preset.contact.phone}</a> : null}
          </div>
        </div>
      </footer>
    </>
  );
}
