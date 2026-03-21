import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import { AppShell } from './AppShell';
import { PresetProvider } from './PresetContext';
import { routerFuture } from './routerFuture';
import { SitePreferencesProvider } from './SitePreferencesContext';
import { getPresetConfig } from '../presets';
import { applyDesignTokens } from '../theme/applyDesignTokens';
import type { RoutePath } from '../types/preset';

const educationPreset = getPresetConfig('education');

function renderLocalizedRoute(path: RoutePath) {
  window.localStorage.clear();
  delete document.documentElement.dataset.siteLocale;
  delete document.documentElement.dataset.siteTheme;
  applyDesignTokens(educationPreset);

  render(
    <PresetProvider preset={educationPreset}>
      <SitePreferencesProvider preset={educationPreset}>
        <MemoryRouter initialEntries={[path]} future={routerFuture}>
          <AppShell>
            <AppRoutes />
          </AppShell>
        </MemoryRouter>
      </SitePreferencesProvider>
    </PresetProvider>
  );

  fireEvent.click(screen.getByRole('button', { name: /Switch website to Italian/i }));
}

describe('site localization', () => {
  it.each([
    ['/', 'Trasforma qualsiasi tastiera del computer in un mini piano giocoso per piccole mani curiose.'],
    ['/services', 'Come i bambini possono giocare con TinyKeys'],
    ['/about', 'Un gioco musicale semplice e immediato, pensato per i bambini che vogliono premere ogni tasto che trovano.'],
    ['/contact', 'Parla con il team TinyKeys']
  ] satisfies Array<[RoutePath, string]>)('renders %s in Italian after the header toggle', (path, heading) => {
    renderLocalizedRoute(path);

    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Modalita' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Chi siamo' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contatti' })).toBeInTheDocument();
  });

  it('localizes contact form guidance and validation errors', () => {
    renderLocalizedRoute('/contact');

    fireEvent.click(screen.getByRole('button', { name: 'Invia richiesta' }));

    expect(screen.queryByLabelText('Telefono')).not.toBeInTheDocument();
    expect(screen.getByText('Controlla i campi evidenziati e riprova.')).toBeInTheDocument();
    expect(screen.getByText('Inserisci il tuo nome.')).toBeInTheDocument();
    expect(screen.getByText('Inserisci un indirizzo email valido.')).toBeInTheDocument();
    expect(screen.getByText('Seleziona un opzione.')).toBeInTheDocument();
    expect(
      screen.getByText('Aggiungi un breve messaggio per aiutarci a capire di cosa hai bisogno.')
    ).toBeInTheDocument();
    expect(screen.getByText('Conferma il consenso per essere ricontattato.')).toBeInTheDocument();
  });
});
