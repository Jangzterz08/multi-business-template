import { useEffect, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import { AppShell } from './AppShell';
import { PresetProvider } from './PresetContext';
import { routerFuture } from './routerFuture';
import { SitePreferencesProvider } from './SitePreferencesContext';
import { getPresetConfig } from '../presets';

function ensureMeta(name: string): HTMLMetaElement {
  const existing = document.querySelector(`meta[name="${name}"]`);
  if (existing) {
    return existing as HTMLMetaElement;
  }

  const meta = document.createElement('meta');
  meta.setAttribute('name', name);
  document.head.appendChild(meta);
  return meta;
}

export function App() {
  const preset = useMemo(() => getPresetConfig(import.meta.env.VITE_PRESET), []);

  useEffect(() => {
    document.title = preset.seo.title;

    const description = ensureMeta('description');
    description.setAttribute('content', preset.seo.description);

    const keywords = ensureMeta('keywords');
    keywords.setAttribute('content', preset.seo.keywords.join(', '));
  }, [preset]);

  return (
    <PresetProvider preset={preset}>
      <SitePreferencesProvider preset={preset}>
        <BrowserRouter future={routerFuture}>
          <AppShell>
            <AppRoutes />
          </AppShell>
        </BrowserRouter>
      </SitePreferencesProvider>
    </PresetProvider>
  );
}
