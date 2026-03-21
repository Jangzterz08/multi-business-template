import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';
import { KeyboardPlayground } from './KeyboardPlayground';
import type { HomeExperienceConfig } from '../types/preset';

const experience: HomeExperienceConfig = {
  type: 'keyboard-playground',
  title: 'Sound Garden',
  description: 'Press keys and watch floating bubbles appear.',
  helperText: 'A clean background for floating key bubbles.',
  keyboardHint: 'Any key works.',
  locales: {
    it: {
      title: 'Giardino Sonoro',
      description: 'Tocca i colori e suona.',
      helperText: 'Tasti grandi per mani piccole.',
      keyboardHint: 'Ogni tasto funziona.',
      pads: [
        { label: 'Bagliore', hint: 'Campana calda', accent: '#ff8f5a' },
        { label: 'Fiore', hint: 'Tintinnio morbido', accent: '#ffcf4d' },
        { label: 'Vento', hint: 'Pizzico arioso', accent: '#7cc8ff' },
        { label: 'Salto', hint: 'Rimbalzo piccolo', accent: '#8fdc6a' }
      ]
    }
  },
  pads: [
    { label: 'Glow', hint: 'Warm bell', accent: '#ff8f5a' },
    { label: 'Bloom', hint: 'Soft chime', accent: '#ffcf4d' },
    { label: 'Drift', hint: 'Airy pluck', accent: '#7cc8ff' },
    { label: 'Hop', hint: 'Tiny bounce', accent: '#8fdc6a' }
  ]
};

let fullscreenElement: Element | null = null;

describe('KeyboardPlayground', () => {
  beforeEach(() => {
    fullscreenElement = null;

    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => fullscreenElement
    });

    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
      configurable: true,
      value: vi.fn(function requestFullscreen(this: HTMLElement) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        fullscreenElement = this;
        document.dispatchEvent(new Event('fullscreenchange'));
        return Promise.resolve();
      })
    });

    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: vi.fn(() => {
        fullscreenElement = null;
        document.dispatchEvent(new Event('fullscreenchange'));
        return Promise.resolve();
      })
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    fullscreenElement = null;
    delete document.documentElement.dataset.playMode;
  });

  it('renders the configured content and controls', () => {
    render(<KeyboardPlayground experience={experience} />);

    expect(screen.getByRole('heading', { name: 'Sound Garden' })).toBeInTheDocument();
    expect(screen.getByText('A clean background for floating key bubbles.')).toBeInTheDocument();
    expect(screen.getByText('Ready to play')).toBeInTheDocument();
    expect(screen.getByText(/Sunny is ready to cheer every note/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Kid Mode/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Rainbow DJ/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mute Sound/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Glow Warm bell/i })).not.toBeInTheDocument();
  });

  it('switches the playground into italian and dark mode', () => {
    render(<KeyboardPlayground experience={experience} />);

    fireEvent.click(screen.getByRole('button', { name: /Switch to Italian/i }));
    fireEvent.click(screen.getByRole('button', { name: /tema chiaro o scuro/i }));

    const snapshot = JSON.parse(window.render_game_to_text?.() ?? '{}') as {
      locale: string;
      visualMode: string;
    };

    expect(screen.getByRole('heading', { name: 'Giardino Sonoro' })).toBeInTheDocument();
    expect(screen.getByText('Tasti grandi per mani piccole.')).toBeInTheDocument();
    expect(snapshot.locale).toBe('it');
    expect(snapshot.visualMode).toBe('dark');
  });

  it('hides the internal language toggle when locale is controlled by the page', () => {
    render(<KeyboardPlayground experience={experience} locale="it" />);

    expect(screen.queryByRole('button', { name: /Passa all inglese|Switch to Italian/i })).not.toBeInTheDocument();

    const snapshot = JSON.parse(window.render_game_to_text?.() ?? '{}') as {
      locale: string;
    };

    expect(snapshot.locale).toBe('it');
  });

  it('hides the internal theme toggle when visual mode is controlled by the site', () => {
    render(<KeyboardPlayground experience={experience} visualMode="dark" />);

    expect(screen.queryByRole('button', { name: /Toggle dark mode|Cambia tema chiaro o scuro/i })).not.toBeInTheDocument();

    const snapshot = JSON.parse(window.render_game_to_text?.() ?? '{}') as {
      visualMode: string;
    };

    expect(snapshot.visualMode).toBe('dark');
  });

  it('updates status and debug output when a key bubble is triggered', () => {
    render(<KeyboardPlayground experience={experience} />);

    fireEvent.keyDown(window, { key: 'a', code: 'KeyA' });

    expect(screen.getAllByText('A').length).toBeGreaterThan(0);
    expect(window.render_game_to_text?.()).toContain('"noteTrail":["A"]');
    expect(window.render_game_to_text?.()).toContain('"bubbleLabels":["A"]');
    expect(window.render_game_to_text?.()).toContain('"streakCount":1');
  });

  it('tracks streak progress and resets it after a pause', () => {
    vi.useFakeTimers();
    render(<KeyboardPlayground experience={experience} />);

    fireEvent.keyDown(window, { key: 'a', code: 'KeyA' });

    act(() => {
      vi.advanceTimersByTime(600);
    });

    fireEvent.keyDown(window, { key: 'd', code: 'KeyD' });

    const activeSnapshot = JSON.parse(window.render_game_to_text?.() ?? '{}') as {
      bestStreak: number;
      mascotMessage: string;
      streakCount: number;
    };

    expect(screen.getByText('2 bubbles in a row')).toBeInTheDocument();
    expect(activeSnapshot.streakCount).toBe(2);
    expect(activeSnapshot.bestStreak).toBe(2);
    expect(activeSnapshot.mascotMessage).toMatch(/streak|tap/i);

    act(() => {
      vi.advanceTimersByTime(1600);
    });

    const resetSnapshot = JSON.parse(window.render_game_to_text?.() ?? '{}') as {
      mascotMessage: string;
      streakCount: number;
    };

    expect(resetSnapshot.streakCount).toBe(0);
    expect(resetSnapshot.mascotMessage).toMatch(/ready|calm mode/i);
    expect(screen.getByText('Ready to play')).toBeInTheDocument();
  });

  it('treats shortcut-looking keys as playable notes instead of toggles', () => {
    render(<KeyboardPlayground experience={experience} />);

    fireEvent.keyDown(window, { key: 'm' });
    fireEvent.keyDown(window, { key: 'r' });

    const snapshot = JSON.parse(window.render_game_to_text?.() ?? '{}') as {
      autoPlayEnabled: boolean;
      noteTrail: string[];
      soundEnabled: boolean;
    };

    expect(screen.getByRole('button', { name: /Mute Sound/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Rainbow DJ/i })).toBeInTheDocument();
    expect(snapshot.soundEnabled).toBe(true);
    expect(snapshot.autoPlayEnabled).toBe(false);
    expect(snapshot.noteTrail).toHaveLength(2);
    expect(snapshot.noteTrail).toEqual(['M', 'R']);
  });

  it('enters kid mode and exits only after holding the parent gate', async () => {
    vi.useFakeTimers();
    render(<KeyboardPlayground experience={experience} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Start Kid Mode/i }));
    });

    expect(document.documentElement.dataset.playMode).toBe('kid');
    const exitButton = screen.getByRole('button', { name: /Hold to exit/i });

    await act(async () => {
      fireEvent.pointerDown(exitButton);
      vi.advanceTimersByTime(1800);
      await Promise.resolve();
    });

    expect(document.documentElement.dataset.playMode).toBeUndefined();
    expect(screen.getByRole('button', { name: /Start Kid Mode/i })).toBeInTheDocument();
    expect(screen.getByText(/press any keyboard key to pop a musical bubble/i)).toBeInTheDocument();
  });

  it('locks the playground until fullscreen is restored if kid mode loses fullscreen', async () => {
    render(<KeyboardPlayground experience={experience} />);

    fireEvent.click(screen.getByRole('button', { name: /Start Kid Mode/i }));

    await act(async () => {
      await document.exitFullscreen();
    });

    expect(screen.getByRole('dialog', { name: /Parent step required/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'a' });

    const lockedSnapshot = JSON.parse(window.render_game_to_text?.() ?? '{}') as {
      fullscreenActive: boolean;
      fullscreenGuardActive: boolean;
      noteTrail: string[];
    };

    expect(lockedSnapshot.fullscreenActive).toBe(false);
    expect(lockedSnapshot.fullscreenGuardActive).toBe(true);
    expect(lockedSnapshot.noteTrail).toHaveLength(0);

    fireEvent.click(screen.getByRole('button', { name: /Return to full screen/i }));

    const restoredSnapshot = JSON.parse(window.render_game_to_text?.() ?? '{}') as {
      fullscreenActive: boolean;
      fullscreenGuardActive: boolean;
    };

    expect(restoredSnapshot.fullscreenActive).toBe(true);
    expect(restoredSnapshot.fullscreenGuardActive).toBe(false);
  });
});
