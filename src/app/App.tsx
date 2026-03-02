import { useEffect, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import { AppShell } from './AppShell';
import { PresetProvider } from './PresetContext';
import { getPresetConfig } from '../presets';
import { applyDesignTokens } from '../theme/applyDesignTokens';

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
    applyDesignTokens(preset);
    document.title = preset.seo.title;

    const description = ensureMeta('description');
    description.setAttribute('content', preset.seo.description);

    const keywords = ensureMeta('keywords');
    keywords.setAttribute('content', preset.seo.keywords.join(', '));
  }, [preset]);

  return (
    <PresetProvider preset={preset}>
      <BrowserRouter>
        <AppShell>
          <AppRoutes />
        </AppShell>
      </BrowserRouter>
    </PresetProvider>
  );
}
