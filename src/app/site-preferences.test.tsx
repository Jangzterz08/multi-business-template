import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { PresetProvider } from './PresetContext';
import { routerFuture } from './routerFuture';
import { SitePreferencesProvider } from './SitePreferencesContext';
import { getPresetConfig } from '../presets';
import { applyDesignTokens } from '../theme/applyDesignTokens';

const educationPreset = getPresetConfig('education');
const localeStorageKey = `multi-business-template:site-locale:${educationPreset.id}`;
const themeStorageKey = `multi-business-template:site-theme:${educationPreset.id}`;

function renderShell() {
  applyDesignTokens(educationPreset);

  render(
    <PresetProvider preset={educationPreset}>
      <SitePreferencesProvider preset={educationPreset}>
        <MemoryRouter future={routerFuture}>
          <AppShell>
            <div>child</div>
          </AppShell>
        </MemoryRouter>
      </SitePreferencesProvider>
    </PresetProvider>
  );
}

describe('site preferences persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.documentElement.dataset.siteLocale;
    delete document.documentElement.dataset.siteTheme;
  });

  it('hydrates locale and theme from localStorage', () => {
    window.localStorage.setItem(localeStorageKey, 'it');
    window.localStorage.setItem(themeStorageKey, 'dark');

    renderShell();

    expect(screen.getByRole('link', { name: 'Modalita' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Passa al tema chiaro' })).toBeInTheDocument();
    expect(document.documentElement.dataset.siteLocale).toBe('it');
    expect(document.documentElement.dataset.siteTheme).toBe('dark');
  });

  it('persists locale and theme after toggles', () => {
    renderShell();

    fireEvent.click(screen.getByRole('button', { name: 'Switch website to Italian' }));
    fireEvent.click(screen.getByRole('button', { name: 'Passa al tema scuro' }));

    expect(window.localStorage.getItem(localeStorageKey)).toBe('it');
    expect(window.localStorage.getItem(themeStorageKey)).toBe('dark');
  });
});
