import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';
import { AppShell } from './AppShell';
import { PresetProvider } from './PresetContext';
import { getPresetConfig, presetKeys } from '../presets';
import { applyDesignTokens } from '../theme/applyDesignTokens';
import type { RoutePath } from '../types/preset';

const routeExpectations: Array<{ path: RoutePath; testId: string }> = [
  { path: '/', testId: 'route-home' },
  { path: '/services', testId: 'route-services' },
  { path: '/about', testId: 'route-about' },
  { path: '/contact', testId: 'route-contact' }
];

describe('route smoke tests', () => {
  for (const presetKey of presetKeys) {
    for (const expected of routeExpectations) {
      it(`renders ${expected.path} for preset ${presetKey}`, () => {
        const preset = getPresetConfig(presetKey);
        applyDesignTokens(preset);

        render(
          <PresetProvider preset={preset}>
            <MemoryRouter initialEntries={[expected.path]}>
              <AppShell>
                <AppRoutes />
              </AppShell>
            </MemoryRouter>
          </PresetProvider>
        );

        expect(screen.getByTestId(expected.testId)).toBeInTheDocument();
        expect(screen.getAllByRole('heading', { level: 1 }).length).toBeGreaterThan(0);
      });
    }
  }
});
