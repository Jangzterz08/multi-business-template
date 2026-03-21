import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { SiteThemeMode } from '../app/SitePreferencesContext';
import type { HomeExperienceConfig, HomeExperienceLocale } from '../types/preset';
import styles from './KeyboardPlayground.module.css';

interface KeyboardPlaygroundProps {
  experience: HomeExperienceConfig;
  locale?: HomeExperienceLocale;
  visualMode?: SiteThemeMode;
}

interface Burst {
  id: number;
  label: string;
  accent: string;
  left: string;
  top: string;
  size: string;
  rotation: string;
}

interface NoteHistoryItem {
  id: number;
  label: string;
  accent: string;
  source: string;
}

interface PlaygroundStateSnapshot {
  activePadIndex: number | null;
  autoPlayEnabled: boolean;
  bestStreak: number;
  bubbleLabels: string[];
  burstCount: number;
  calmModeEnabled: boolean;
  exitGateArmed: boolean;
  fullscreenActive: boolean;
  fullscreenGuardActive: boolean;
  kidModeEnabled: boolean;
  locale: HomeExperienceLocale;
  mascotMessage: string;
  noteTrail: string[];
  pads: string[];
  soundEnabled: boolean;
  streakCount: number;
  statusMessage: string;
  visualMode: SiteThemeMode;
  volume: number;
}

declare global {
  interface Window {
    render_game_to_text?: () => string;
    advanceTime?: (ms: number) => Promise<void>;
  }
}

const NOTE_STEPS = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
const BLOCKED_KEYS = new Set(['Alt', 'Control', 'Meta']);
const AUTO_PLAY_DELAY_MS = 640;
const KID_MODE_EXIT_HOLD_MS = 1800;
const STREAK_WINDOW_MS = 1600;

const KEY_BUBBLE_LABELS: Partial<Record<string, string>> = {
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  ArrowUp: '↑',
  Backspace: '⌫',
  Delete: '⌦',
  Enter: '↵',
  Escape: '⎋',
  Space: '␣',
  Tab: '↹'
};

const KEY_SOURCE_LABELS: Record<HomeExperienceLocale, Partial<Record<string, string>>> = {
  en: {
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    ArrowUp: 'Up',
    Backspace: 'Backspace',
    Delete: 'Delete',
    Enter: 'Enter',
    Escape: 'Escape',
    Space: 'Space',
    Tab: 'Tab'
  },
  it: {
    ArrowDown: 'Giu',
    ArrowLeft: 'Sinistra',
    ArrowRight: 'Destra',
    ArrowUp: 'Su',
    Backspace: 'Indietro',
    Delete: 'Canc',
    Enter: 'Invio',
    Escape: 'Esc',
    Space: 'Spazio',
    Tab: 'Tab'
  }
};

const UI_TEXT = {
  en: {
    cheerBuddy: 'Cheer buddy',
    enableSound: 'Enable Sound',
    exitCalmMode: 'Exit Calm Mode',
    exitFullscreen: 'Exit Fullscreen',
    fullscreen: 'Fullscreen',
    fullscreenOffStatus: 'Full screen turned off. A parent needs to restore it or exit kid mode.',
    fullscreenOnStatus: 'Kid mode is on. Every regular key makes music. Hold the parent button to exit.',
    fullscreenRestoreFailed: 'Full screen could not be restored yet. A parent can try again or exit kid mode.',
    fullscreenStartFailed: 'Full screen could not start. A parent needs to restore it or exit kid mode.',
    holdToExit: 'Hold to exit',
    immersivePromptBody: 'Letters, numbers, punctuation, tab, backspace, arrows, enter, and space all make music bubbles.',
    immersivePromptTitle: 'Press any key',
    kidModeBuddy: 'Kid mode buddy',
    kidModeOffStatus: 'Kid mode is off. Parents can adjust settings again.',
    kidModeOnStatus: 'Starting full-screen kid mode. Parent hold button exits.',
    kidModePill: 'Kid mode is on',
    keyboardPlay: 'Keyboard Play',
    languageButton: 'IT',
    languageToggleLabel: 'Switch to Italian',
    lightMode: 'Light',
    darkMode: 'Dark',
    modeToggleLabel: 'Toggle dark mode',
    muteSound: 'Mute Sound',
    noteTrailHint: 'Recent key bubbles will shimmer here.',
    parentOnly: 'Parent only',
    parentRequired: 'Parent step required',
    playModeTitle: 'Play mode stays full screen',
    playModeText:
      'Full screen turned off, so the concert is paused. Restore full screen to continue playing, or hold the parent button to leave kid mode.',
    readyToPlay: 'Ready to play',
    recentNotes: 'Recent keys',
    returnToFullscreen: 'Return to full screen',
    screensaverHint: 'Fullscreen play keeps only the background and floating key bubbles on stage.',
    soundToggleLabel: 'Toggle sound',
    startKidMode: 'Start Kid Mode',
    startRainbowDj: 'Start Rainbow DJ',
    statusHint: 'Parent controls stay on the buttons, so regular keyboard mashing always stays musical.',
    stopRainbowDj: 'Stop Rainbow DJ',
    themeToggleLabel: 'Toggle light or dark play mode',
    volume: 'Volume'
  },
  it: {
    cheerBuddy: 'Amico del ritmo',
    enableSound: 'Attiva audio',
    exitCalmMode: 'Esci da calmo',
    exitFullscreen: 'Esci da schermo intero',
    fullscreen: 'Schermo intero',
    fullscreenOffStatus: 'Lo schermo intero si e spento. Un genitore deve riattivarlo o uscire dalla modalita bimbo.',
    fullscreenOnStatus: 'La modalita bimbo e attiva. Ogni tasto normale suona. Il genitore puo uscire solo tenendo premuto il pulsante.',
    fullscreenRestoreFailed: 'Lo schermo intero non si e riattivato. Un genitore puo riprovare o uscire dalla modalita bimbo.',
    fullscreenStartFailed: 'Lo schermo intero non e partito. Un genitore deve riattivarlo o uscire dalla modalita bimbo.',
    holdToExit: 'Tieni premuto per uscire',
    immersivePromptBody: 'Lettere, numeri, punteggiatura, tab, backspace, frecce, invio e spazio fanno apparire bolle musicali.',
    immersivePromptTitle: 'Premi un tasto',
    kidModeBuddy: 'Amico modalita bimbo',
    kidModeOffStatus: 'La modalita bimbo e spenta. I genitori possono cambiare di nuovo le impostazioni.',
    kidModeOnStatus: 'Avvio della modalita bimbo a schermo intero. Il genitore puo uscire tenendo premuto il pulsante.',
    kidModePill: 'Modalita bimbo attiva',
    keyboardPlay: 'Gioco da tastiera',
    languageButton: 'EN',
    languageToggleLabel: 'Passa all inglese',
    lightMode: 'Chiaro',
    darkMode: 'Scuro',
    modeToggleLabel: 'Cambia tema chiaro o scuro',
    muteSound: 'Disattiva audio',
    noteTrailHint: 'Le bolle dei tasti recenti brilleranno qui.',
    parentOnly: 'Solo genitore',
    parentRequired: 'Serve un genitore',
    playModeTitle: 'Il gioco resta a schermo intero',
    playModeText:
      'Lo schermo intero si e spento, quindi il concerto e in pausa. Riattiva lo schermo intero per continuare, oppure tieni premuto il pulsante genitore per uscire.',
    readyToPlay: 'Pronto a suonare',
    recentNotes: 'Tasti recenti',
    returnToFullscreen: 'Torna a schermo intero',
    screensaverHint: 'Il gioco a schermo intero lascia sul palco solo lo sfondo e le bolle dei tasti.',
    soundToggleLabel: 'Attiva o disattiva audio',
    startKidMode: 'Avvia modalita bimbo',
    startRainbowDj: 'Avvia DJ Arcobaleno',
    statusHint: 'I controlli per i genitori restano sui pulsanti, cosi i tasti normali fanno sempre musica.',
    stopRainbowDj: 'Ferma DJ Arcobaleno',
    themeToggleLabel: 'Cambia il tema chiaro o scuro del gioco',
    volume: 'Volume'
  }
} satisfies Record<HomeExperienceLocale, Record<string, string>>;

function toFrequency(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  );
}

function resolveLocale(experience: HomeExperienceConfig) {
  if (typeof window === 'undefined') {
    return 'en' as HomeExperienceLocale;
  }

  if (window.navigator.language.toLowerCase().startsWith('it') && experience.locales?.it) {
    return 'it' as HomeExperienceLocale;
  }

  return 'en' as HomeExperienceLocale;
}

function resolveLocalizedExperience(experience: HomeExperienceConfig, locale: HomeExperienceLocale) {
  if (locale === 'en' || !experience.locales?.[locale]) {
    return experience;
  }

  const localized = experience.locales[locale];

  return {
    ...experience,
    title: localized.title ?? experience.title,
    description: localized.description ?? experience.description,
    helperText: localized.helperText ?? experience.helperText,
    keyboardHint: localized.keyboardHint ?? experience.keyboardHint,
    pads: localized.pads ?? experience.pads
  };
}

function getIdleMascotMessage(locale: HomeExperienceLocale, kidModeEnabled: boolean, calmModeEnabled: boolean) {
  if (kidModeEnabled) {
    return locale === 'it'
      ? 'Sunny guarda il palco. Qualsiasi tasto puo iniziare il prossimo piccolo concerto.'
      : 'Sunny is watching the stage. Any key can start the next tiny concert.';
  }

  if (calmModeEnabled) {
    return locale === 'it'
      ? 'La modalita calma e pronta. I tocchi morbidi creano note sognanti.'
      : 'Calm mode is ready. Soft taps make dreamy little notes.';
  }

  return locale === 'it'
    ? 'Sunny e pronto a festeggiare ogni nota. Premi un tasto per iniziare.'
    : 'Sunny is ready to cheer every note. Press any key to begin.';
}

function getMascotMessage(
  locale: HomeExperienceLocale,
  streakCount: number,
  bubbleLabel: string,
  sourceLabel: string,
  kidModeEnabled: boolean,
  calmModeEnabled: boolean
) {
  if (sourceLabel === 'Rainbow DJ' || sourceLabel === 'DJ Arcobaleno') {
    if (locale === 'it') {
      return streakCount >= 4
        ? 'Il DJ Arcobaleno sta lanciando una parata di scintille sul palco.'
        : 'Il DJ Arcobaleno fa ballare i colori da solo.';
    }

    return streakCount >= 4
      ? 'Rainbow DJ is throwing a sparkle parade across the stage.'
      : 'Rainbow DJ is keeping the colors dancing all by itself.';
  }

  if (calmModeEnabled && streakCount >= 3) {
    return locale === 'it'
      ? `${bubbleLabel} sta aiutando a costruire un ritmo morbido e regolare.`
      : `${bubbleLabel} is helping build a soft and steady little rhythm.`;
  }

  if (kidModeEnabled && streakCount >= 5) {
    return locale === 'it'
      ? `${streakCount} note di fila. Sunny dice che questo e un concerto da superstar in modalita bimbo.`
      : `${streakCount} notes in a row. Sunny says this is a superstar kid-mode concert.`;
  }

  if (streakCount >= 4) {
    return locale === 'it'
      ? `${streakCount} note di fila. Continua a far scorrere il concerto arcobaleno.`
      : `${streakCount} notes in a row. Keep the rainbow concert rolling.`;
  }

  if (streakCount >= 2) {
    return locale === 'it'
      ? `${bubbleLabel} si e unito alla serie. Un altro tocco la rendera ancora piu grande.`
      : `${bubbleLabel} joined the streak. Another tap will make it even bigger.`;
  }

  return locale === 'it'
    ? `${bubbleLabel} ti saluta. Premi un altro tasto per una nuova sorpresa.`
    : `${bubbleLabel} says hello. Press another key for a new surprise.`;
}

function getKeyBubbleLabel(key: string) {
  const normalizedKey = key === ' ' ? 'Space' : key;

  if (KEY_BUBBLE_LABELS[normalizedKey]) {
    return KEY_BUBBLE_LABELS[normalizedKey] ?? normalizedKey;
  }

  if (normalizedKey.length === 1) {
    return normalizedKey.toUpperCase();
  }

  return normalizedKey.slice(0, 3).toUpperCase();
}

function getKeySourceLabel(locale: HomeExperienceLocale, key: string) {
  const normalizedKey = key === ' ' ? 'Space' : key;
  const localizedLabel = KEY_SOURCE_LABELS[locale][normalizedKey];

  if (localizedLabel) {
    return localizedLabel;
  }

  if (normalizedKey.length === 1) {
    return normalizedKey.toUpperCase();
  }

  return normalizedKey;
}

function createSnapshot(payload: PlaygroundStateSnapshot) {
  return JSON.stringify({
    mode: 'keyboard-playground',
    activePadIndex: payload.activePadIndex,
    autoPlayEnabled: payload.autoPlayEnabled,
    bestStreak: payload.bestStreak,
    bubbleLabels: payload.bubbleLabels,
    burstCount: payload.burstCount,
    calmModeEnabled: payload.calmModeEnabled,
    exitGateArmed: payload.exitGateArmed,
    fullscreenActive: payload.fullscreenActive,
    fullscreenGuardActive: payload.fullscreenGuardActive,
    kidModeEnabled: payload.kidModeEnabled,
    locale: payload.locale,
    mascotMessage: payload.mascotMessage,
    noteTrail: payload.noteTrail,
    pads: payload.pads,
    soundEnabled: payload.soundEnabled,
    streakCount: payload.streakCount,
    statusMessage: payload.statusMessage,
    visualMode: payload.visualMode,
    volume: payload.volume,
    coordinateSystem: 'origin top-left, percentages used for floating burst positions'
  });
}

export function KeyboardPlayground({
  experience,
  locale: controlledLocale,
  visualMode: controlledVisualMode
}: KeyboardPlaygroundProps) {
  const initialLocale = controlledLocale ?? resolveLocale(experience);
  const rootRef = useRef<HTMLElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const burstIdRef = useRef(0);
  const noteIdRef = useRef(0);
  const activePadTimerRef = useRef<number | null>(null);
  const burstTimerRefs = useRef<number[]>([]);
  const autoPlayTimerRef = useRef<number | null>(null);
  const exitGateTimerRef = useRef<number | null>(null);
  const streakResetTimerRef = useRef<number | null>(null);
  const lastTriggerAtRef = useRef<number | null>(null);
  const streakCountRef = useRef(0);
  const bestStreakRef = useRef(0);
  const fullscreenEntryPendingRef = useRef(false);
  const kidModeEnabledRef = useRef(false);
  const localeRef = useRef<HomeExperienceLocale>(initialLocale);

  const [activePadIndex, setActivePadIndex] = useState<number | null>(null);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);
  const [bestStreak, setBestStreak] = useState(0);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const calmModeEnabled = false;
  const [exitGateArmed, setExitGateArmed] = useState(false);
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const [fullscreenEntryPending, setFullscreenEntryPending] = useState(false);
  const [fullscreenGuardActive, setFullscreenGuardActive] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [kidModeEnabled, setKidModeEnabled] = useState(false);
  const [uncontrolledLocale, setUncontrolledLocale] = useState<HomeExperienceLocale>(initialLocale);
  const [uncontrolledVisualMode, setUncontrolledVisualMode] = useState<SiteThemeMode>('light');
  const locale = controlledLocale ?? uncontrolledLocale;
  const localeToggleVisible = controlledLocale == null && Boolean(experience.locales?.it);
  const visualMode = controlledVisualMode ?? uncontrolledVisualMode;
  const themeToggleVisible = controlledVisualMode == null;
  const [mascotMessage, setMascotMessage] = useState(() => getIdleMascotMessage(initialLocale, false, false));
  const [noteHistory, setNoteHistory] = useState<NoteHistoryItem[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [streakCount, setStreakCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState(() =>
    initialLocale === 'it'
      ? 'Premi un tasto della tastiera per far apparire una bolla musicale.'
      : 'Press any keyboard key to pop a musical bubble.'
  );
  const volume = 0.68;
  const localizedExperience = useMemo(() => resolveLocalizedExperience(experience, locale), [experience, locale]);
  const ui = UI_TEXT[locale];

  useEffect(() => {
    return () => {
      if (activePadTimerRef.current !== null) {
        window.clearTimeout(activePadTimerRef.current);
      }

      if (autoPlayTimerRef.current !== null) {
        window.clearTimeout(autoPlayTimerRef.current);
      }

      if (exitGateTimerRef.current !== null) {
        window.clearTimeout(exitGateTimerRef.current);
      }

      if (streakResetTimerRef.current !== null) {
        window.clearTimeout(streakResetTimerRef.current);
      }

      for (const timer of burstTimerRefs.current) {
        window.clearTimeout(timer);
      }

      burstTimerRefs.current = [];

      if (audioContextRef.current) {
        void audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    kidModeEnabledRef.current = kidModeEnabled;
  }, [kidModeEnabled]);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  useEffect(() => {
    fullscreenEntryPendingRef.current = fullscreenEntryPending;
  }, [fullscreenEntryPending]);

  useEffect(() => {
    if (controlledVisualMode != null) {
      return;
    }

    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setUncontrolledVisualMode(media.matches ? 'dark' : 'light');
  }, [controlledVisualMode]);

  useEffect(() => {
    function handleFullscreenChange() {
      const nextFullscreenActive = document.fullscreenElement === rootRef.current;
      setFullscreenActive(nextFullscreenActive);

      if (!kidModeEnabledRef.current) {
        setFullscreenGuardActive(false);
        return;
      }

      if (nextFullscreenActive) {
        fullscreenEntryPendingRef.current = false;
        setFullscreenEntryPending(false);
        setFullscreenGuardActive(false);
        setStatusMessage(UI_TEXT[localeRef.current].fullscreenOnStatus);
        return;
      }

      if (fullscreenEntryPendingRef.current) {
        return;
      }

      setFullscreenGuardActive(true);
      setStatusMessage(UI_TEXT[localeRef.current].fullscreenOffStatus);
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const previousOverflow = document.body.style.overflow;

    if (kidModeEnabled) {
      root.dataset.playMode = 'kid';
    } else if (root.dataset.playMode === 'kid') {
      delete root.dataset.playMode;
    }

    if (kidModeEnabled || fullscreenActive) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      if (root.dataset.playMode === 'kid') {
        delete root.dataset.playMode;
      }
    };
  }, [fullscreenActive, kidModeEnabled]);

  useEffect(() => {
    if (streakCountRef.current === 0) {
      setMascotMessage(getIdleMascotMessage(locale, kidModeEnabled, calmModeEnabled));
    }
  }, [calmModeEnabled, kidModeEnabled, locale]);

  useEffect(() => {
    if (streakCount > 0 || exitGateArmed) {
      return;
    }

    if (fullscreenGuardActive) {
      setStatusMessage(ui.fullscreenOffStatus);
      return;
    }

    if (kidModeEnabled && fullscreenActive) {
      setStatusMessage(ui.fullscreenOnStatus);
      return;
    }

    if (!kidModeEnabled) {
      setStatusMessage(
        locale === 'it'
          ? 'Premi un tasto della tastiera per far apparire una bolla musicale.'
          : 'Press any keyboard key to pop a musical bubble.'
      );
    }
  }, [
    exitGateArmed,
    fullscreenActive,
    fullscreenGuardActive,
    kidModeEnabled,
    locale,
    streakCount,
    ui.fullscreenOffStatus,
    ui.fullscreenOnStatus
  ]);

  const ensureAudioContext = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const AudioContextClass =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    if (audioContextRef.current.state === 'suspended') {
      void audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, []);

  const pushBurst = useCallback(
    (index: number, bubbleLabel: string) => {
      const pad = localizedExperience.pads[index];
      const burst: Burst = {
        id: burstIdRef.current++,
        label: bubbleLabel,
        accent: pad.accent,
        left: `${10 + Math.random() * 80}%`,
        top: `${14 + Math.random() * 72}%`,
        size: `${Math.max(3.8, Math.min(7.2, 6.8 - bubbleLabel.length * 0.3))}rem`,
        rotation: `${-18 + Math.random() * 36}deg`
      };

      setBursts((current) => [...current.slice(-10), burst]);

      const timer = window.setTimeout(() => {
        setBursts((current) => current.filter((item) => item.id !== burst.id));
        burstTimerRefs.current = burstTimerRefs.current.filter((item) => item !== timer);
      }, calmModeEnabled ? 680 : 900);

      burstTimerRefs.current.push(timer);
    },
    [calmModeEnabled, localizedExperience.pads]
  );

  const pushNoteHistory = useCallback((index: number, sourceLabel: string, bubbleLabel: string) => {
    const pad = localizedExperience.pads[index];

    setNoteHistory((current) => {
      const nextItem: NoteHistoryItem = {
        id: noteIdRef.current++,
        label: bubbleLabel,
        accent: pad.accent,
        source: sourceLabel
      };

      return [...current.slice(-5), nextItem];
    });
  }, [localizedExperience.pads]);

  const playTone = useCallback(
    (index: number) => {
      if (!soundEnabled) {
        return;
      }

      const audioContext = ensureAudioContext();

      if (!audioContext) {
        return;
      }

      const pad = localizedExperience.pads[index];
      const now = audioContext.currentTime;
      const noteStep = NOTE_STEPS[index % NOTE_STEPS.length];
      const octaveOffset = Math.random() > 0.6 ? 12 : 0;
      const targetVolume = Math.max(0.04, volume * (calmModeEnabled ? 0.38 : 0.7));
      const accentOffset = (pad.label.charCodeAt(0) + index) % 3;
      const frequency = toFrequency(55 + noteStep + octaveOffset + accentOffset);

      const bodyOscillator = audioContext.createOscillator();
      bodyOscillator.type = 'triangle';
      bodyOscillator.frequency.setValueAtTime(frequency, now);

      const sparkleOscillator = audioContext.createOscillator();
      sparkleOscillator.type = 'sine';
      sparkleOscillator.frequency.setValueAtTime(frequency * 2, now);

      const bodyGain = audioContext.createGain();
      bodyGain.gain.setValueAtTime(0.0001, now);
      bodyGain.gain.linearRampToValueAtTime(targetVolume, now + 0.03);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + (calmModeEnabled ? 1 : 1.25));

      const sparkleGain = audioContext.createGain();
      sparkleGain.gain.setValueAtTime(0.0001, now);
      sparkleGain.gain.linearRampToValueAtTime(targetVolume * 0.3, now + 0.02);
      sparkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.58);

      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(calmModeEnabled ? 1700 : 2500, now);
      filter.Q.setValueAtTime(0.7, now);

      bodyOscillator.connect(filter);
      filter.connect(bodyGain);
      bodyGain.connect(audioContext.destination);

      sparkleOscillator.connect(sparkleGain);
      sparkleGain.connect(audioContext.destination);

      bodyOscillator.start(now);
      sparkleOscillator.start(now);
      bodyOscillator.stop(now + (calmModeEnabled ? 1.05 : 1.3));
      sparkleOscillator.stop(now + 0.7);
    },
    [calmModeEnabled, ensureAudioContext, localizedExperience.pads, soundEnabled, volume]
  );

  const triggerPad = useCallback(
    (index: number, sourceLabel: string, bubbleLabel = localizedExperience.pads[index].label) => {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const nextStreak =
        lastTriggerAtRef.current !== null && now - lastTriggerAtRef.current <= STREAK_WINDOW_MS
          ? streakCountRef.current + 1
          : 1;
      const nextBestStreak = Math.max(bestStreakRef.current, nextStreak);

      lastTriggerAtRef.current = now;
      streakCountRef.current = nextStreak;
      bestStreakRef.current = nextBestStreak;

      setHasStarted(true);
      playTone(index);
      pushBurst(index, bubbleLabel);
      pushNoteHistory(index, sourceLabel, bubbleLabel);
      setActivePadIndex(index);
      setBestStreak(nextBestStreak);
      setStreakCount(nextStreak);
      setMascotMessage(getMascotMessage(locale, nextStreak, bubbleLabel, sourceLabel, kidModeEnabled, calmModeEnabled));
      setStatusMessage(
        locale === 'it'
          ? `${sourceLabel} ha fatto apparire ${bubbleLabel}. Serie ${nextStreak}.`
          : `${sourceLabel} popped ${bubbleLabel}. Streak ${nextStreak}.`
      );

      if (streakResetTimerRef.current !== null) {
        window.clearTimeout(streakResetTimerRef.current);
      }

      streakResetTimerRef.current = window.setTimeout(() => {
        streakCountRef.current = 0;
        lastTriggerAtRef.current = null;
        setStreakCount(0);
        setMascotMessage(getIdleMascotMessage(locale, kidModeEnabled, calmModeEnabled));
      }, STREAK_WINDOW_MS);

      if (activePadTimerRef.current !== null) {
        window.clearTimeout(activePadTimerRef.current);
      }

      activePadTimerRef.current = window.setTimeout(() => {
        setActivePadIndex(null);
      }, 210);
    },
    [calmModeEnabled, kidModeEnabled, locale, localizedExperience.pads, playTone, pushBurst, pushNoteHistory]
  );

  const exitRootFullscreen = useCallback(async () => {
    if (document.fullscreenElement === rootRef.current) {
      await document.exitFullscreen();
    }
  }, []);

  const requestRootFullscreen = useCallback(async () => {
    if (document.fullscreenElement === rootRef.current) {
      setFullscreenGuardActive(false);
      return true;
    }

    if (!rootRef.current?.requestFullscreen) {
      return false;
    }

    try {
      await rootRef.current.requestFullscreen();
      return true;
    } catch {
      return false;
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement === rootRef.current) {
      await exitRootFullscreen();
      return;
    }

    await requestRootFullscreen();
  }, [exitRootFullscreen, requestRootFullscreen]);

  const disarmExitGate = useCallback(() => {
    if (exitGateTimerRef.current !== null) {
      window.clearTimeout(exitGateTimerRef.current);
      exitGateTimerRef.current = null;
    }

    setExitGateArmed(false);
  }, []);

  const leaveKidMode = useCallback(() => {
    disarmExitGate();
    kidModeEnabledRef.current = false;
    fullscreenEntryPendingRef.current = false;
    setAutoPlayEnabled(false);
    setFullscreenEntryPending(false);
    setFullscreenGuardActive(false);
    setKidModeEnabled(false);
    setMascotMessage(getIdleMascotMessage(locale, false, calmModeEnabled));
    setStatusMessage(ui.kidModeOffStatus);
    void exitRootFullscreen();
  }, [calmModeEnabled, disarmExitGate, exitRootFullscreen, locale, ui.kidModeOffStatus]);

  const armExitGate = useCallback(() => {
    if (!kidModeEnabled) {
      return;
    }

    disarmExitGate();
    setExitGateArmed(true);

    exitGateTimerRef.current = window.setTimeout(() => {
      leaveKidMode();
    }, KID_MODE_EXIT_HOLD_MS);
  }, [disarmExitGate, kidModeEnabled, leaveKidMode]);

  const enterKidMode = useCallback(() => {
    setHasStarted(true);
    kidModeEnabledRef.current = true;
    fullscreenEntryPendingRef.current = true;
    setFullscreenEntryPending(true);
    setFullscreenGuardActive(false);
    setKidModeEnabled(true);
    setMascotMessage(getIdleMascotMessage(locale, true, calmModeEnabled));
    setStatusMessage(ui.kidModeOnStatus);
    void requestRootFullscreen().then((granted) => {
      fullscreenEntryPendingRef.current = false;
      setFullscreenEntryPending(false);

      if (!granted) {
        setFullscreenGuardActive(true);
        setStatusMessage(ui.fullscreenStartFailed);
      }
    });
  }, [calmModeEnabled, locale, requestRootFullscreen, ui.fullscreenStartFailed, ui.kidModeOnStatus]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (BLOCKED_KEYS.has(event.key) || isEditableTarget(event.target)) {
        return;
      }

      const normalizedKey = event.key === ' ' ? 'Space' : event.key;
      if (!normalizedKey || normalizedKey === 'Dead' || normalizedKey === 'Process' || normalizedKey === 'Unidentified') {
        return;
      }

      event.preventDefault();

      if (fullscreenGuardActive) {
        return;
      }

      if (event.repeat) {
        return;
      }

      const seedSource = event.code && event.code !== 'Unidentified' ? event.code : normalizedKey;
      const seed = Array.from(seedSource).reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const index = seed % localizedExperience.pads.length;
      const sourceLabel = locale === 'it' ? `Tasto ${getKeySourceLabel(locale, normalizedKey)}` : `Key ${getKeySourceLabel(locale, normalizedKey)}`;
      triggerPad(index, sourceLabel, getKeyBubbleLabel(normalizedKey));
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenGuardActive, locale, localizedExperience.pads.length, triggerPad]);

  useEffect(() => {
    if (!autoPlayEnabled || fullscreenGuardActive) {
      if (autoPlayTimerRef.current !== null) {
        window.clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      return;
    }

    function queueNext() {
      autoPlayTimerRef.current = window.setTimeout(() => {
        const index = Math.floor(Math.random() * localizedExperience.pads.length);
        triggerPad(index, locale === 'it' ? 'DJ Arcobaleno' : 'Rainbow DJ', '♪');
        queueNext();
      }, kidModeEnabled ? 540 : AUTO_PLAY_DELAY_MS);
    }

    queueNext();

    return () => {
      if (autoPlayTimerRef.current !== null) {
        window.clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [autoPlayEnabled, fullscreenGuardActive, kidModeEnabled, locale, localizedExperience.pads.length, triggerPad]);

  useEffect(() => {
    const snapshot = createSnapshot({
      activePadIndex,
      autoPlayEnabled,
      bestStreak,
      bubbleLabels: bursts.map((item) => item.label),
      burstCount: bursts.length,
      calmModeEnabled,
      exitGateArmed,
      fullscreenActive,
      fullscreenGuardActive,
      kidModeEnabled,
      locale,
      mascotMessage,
      noteTrail: noteHistory.map((item) => item.label),
      pads: localizedExperience.pads.map((item) => item.label),
      soundEnabled,
      streakCount,
      statusMessage,
      visualMode,
      volume
    });

    window.render_game_to_text = () => snapshot;
    window.advanceTime = (ms: number) =>
      new Promise((resolve) => {
        window.setTimeout(resolve, Math.max(0, ms));
      });

    return () => {
      delete window.render_game_to_text;
      delete window.advanceTime;
    };
  }, [
    activePadIndex,
    autoPlayEnabled,
    bestStreak,
    bursts,
    calmModeEnabled,
    exitGateArmed,
    fullscreenActive,
    fullscreenGuardActive,
    kidModeEnabled,
    locale,
    localizedExperience.pads,
    mascotMessage,
    noteHistory,
    soundEnabled,
    streakCount,
    statusMessage,
    visualMode,
    volume
  ]);

  const toggleLocale = useCallback(() => {
    if (controlledLocale != null) {
      return;
    }

    setUncontrolledLocale((current) => (current === 'en' ? 'it' : 'en'));
  }, [controlledLocale]);
  const toggleVisualMode = useCallback(() => {
    if (controlledVisualMode != null) {
      return;
    }

    setUncontrolledVisualMode((current) => (current === 'light' ? 'dark' : 'light'));
  }, [controlledVisualMode]);

  return (
    <section
      ref={rootRef}
      className={`${styles.playground} ${visualMode === 'dark' ? styles.playgroundDark : ''} ${fullscreenActive ? styles.playgroundFullscreen : ''} ${kidModeEnabled ? styles.playgroundKidMode : ''} panel motionReveal`}
      data-testid="keyboard-playground"
      data-fullscreen-guard={fullscreenGuardActive ? 'on' : 'off'}
      data-kid-mode={kidModeEnabled ? 'on' : 'off'}
    >
      {!kidModeEnabled ? (
        <div className={`${styles.copy} ${kidModeEnabled ? styles.copyKidMode : ''}`.trim()}>
          <span className="pill">{ui.keyboardPlay}</span>
          <h2>{localizedExperience.title}</h2>
          <p>{localizedExperience.description}</p>
        </div>
      ) : null}

      <div className={`${styles.controlBar} ${kidModeEnabled ? styles.controlBarKidMode : ''}`.trim()}>
        {kidModeEnabled ? (
          <>
            <span className={styles.kidBadge}>{ui.kidModePill}</span>
            <button
              type="button"
              className={`${styles.controlButton} ${styles.controlButtonKidMode}`.trim()}
              onClick={() => setAutoPlayEnabled((current) => !current)}
              aria-pressed={autoPlayEnabled}
              aria-label={autoPlayEnabled ? ui.stopRainbowDj : ui.startRainbowDj}
            >
              {autoPlayEnabled ? 'DJ Off' : 'DJ'}
            </button>
            <button
              type="button"
              className={`${styles.controlButton} ${styles.controlButtonKidMode}`.trim()}
              onClick={() => setSoundEnabled((current) => !current)}
              aria-pressed={soundEnabled}
              aria-label={soundEnabled ? ui.muteSound : ui.enableSound}
            >
              {soundEnabled ? (locale === 'it' ? 'Audio' : 'SFX') : locale === 'it' ? 'Muto' : 'SFX Off'}
            </button>
            {themeToggleVisible ? (
              <button
                type="button"
                className={`${styles.controlButton} ${styles.controlButtonKidMode}`.trim()}
                onClick={toggleVisualMode}
                aria-label={ui.themeToggleLabel}
              >
                {visualMode === 'dark' ? ui.lightMode : ui.darkMode}
              </button>
            ) : null}
            <button
              type="button"
              className={`${styles.exitGateButton} ${styles.controlButtonKidMode} ${exitGateArmed ? styles.exitGateArmed : ''}`.trim()}
              onPointerDown={armExitGate}
              onPointerUp={disarmExitGate}
              onPointerLeave={disarmExitGate}
              onPointerCancel={disarmExitGate}
              aria-label={ui.holdToExit}
            >
              <strong>{ui.holdToExit}</strong>
              <small>{ui.parentOnly}</small>
            </button>
          </>
        ) : (
          <>
            <button type="button" className={styles.primaryModeButton} onClick={enterKidMode}>
              {ui.startKidMode}
            </button>
            <button
              type="button"
              className={styles.controlButton}
              onClick={() => setAutoPlayEnabled((current) => !current)}
              aria-pressed={autoPlayEnabled}
            >
              {autoPlayEnabled ? ui.stopRainbowDj : ui.startRainbowDj}
            </button>
            <button
              type="button"
              className={styles.controlButton}
              onClick={() => setSoundEnabled((current) => !current)}
              aria-pressed={soundEnabled}
            >
              {soundEnabled ? ui.muteSound : ui.enableSound}
            </button>
            <button
              type="button"
              className={styles.controlButton}
              onClick={() => {
                void toggleFullscreen();
              }}
            >
              {fullscreenActive ? ui.exitFullscreen : ui.fullscreen}
            </button>
            {themeToggleVisible ? (
              <button
                type="button"
                className={styles.controlButton}
                onClick={toggleVisualMode}
                aria-label={ui.themeToggleLabel}
              >
                {visualMode === 'dark' ? ui.lightMode : ui.darkMode}
              </button>
            ) : null}
            {localeToggleVisible ? (
              <button
                type="button"
                className={styles.controlButton}
                onClick={toggleLocale}
                aria-label={ui.languageToggleLabel}
              >
                {ui.languageButton}
              </button>
            ) : null}
          </>
        )}
      </div>

      <div
        className={`${styles.stage} ${visualMode === 'dark' ? styles.stageDark : ''} ${calmModeEnabled ? styles.stageCalm : ''} ${kidModeEnabled ? styles.stageKidMode : ''}`.trim()}
      >
        <div className={styles.stageBackdrop} aria-hidden="true">
          <span className={`${styles.ambientOrb} ${styles.ambientOrbOne}`} />
          <span className={`${styles.ambientOrb} ${styles.ambientOrbTwo}`} />
          <span className={`${styles.ambientOrb} ${styles.ambientOrbThree}`} />
        </div>

        <div className={styles.sky} data-testid="bubble-cloud" aria-hidden="true">
          {bursts.map((burst) => (
            <span
              key={burst.id}
              className={`${styles.burst} ${activePadIndex !== null ? styles.burstActive : ''}`.trim()}
              style={
                {
                  '--burst-accent': burst.accent,
                  '--burst-left': burst.left,
                  '--burst-top': burst.top,
                  '--burst-size': burst.size,
                  '--burst-rotation': burst.rotation
                } as CSSProperties
              }
            >
              {burst.label}
            </span>
          ))}
        </div>

        {!hasStarted && !kidModeEnabled ? (
          <div className={styles.ambientPrompt}>
            <strong>{ui.immersivePromptTitle}</strong>
            <p>{ui.immersivePromptBody}</p>
          </div>
        ) : null}

        {!kidModeEnabled ? (
          <div className={styles.stageFooter}>
            <p className={styles.stagePulse}>
              {streakCount > 0
                ? locale === 'it'
                  ? `${streakCount} bolle di fila`
                  : `${streakCount} bubbles in a row`
                : ui.readyToPlay}
            </p>
            <p className={styles.stageMessage}>{mascotMessage}</p>
            <p className={styles.trailLine}>
              {noteHistory.length > 0
                ? `${ui.recentNotes}: ${noteHistory.map((item) => item.label).join(' • ')}`
                : ui.noteTrailHint}
            </p>
          </div>
        ) : null}
      </div>

      {fullscreenGuardActive ? (
        <div className={styles.guardOverlay} role="dialog" aria-modal="true" aria-label={ui.parentRequired}>
          <div className={styles.guardCard}>
            <span className={styles.guardBadge}>{ui.parentRequired}</span>
            <strong className={styles.guardTitle}>{ui.playModeTitle}</strong>
            <p className={styles.guardText}>{ui.playModeText}</p>
            <div className={styles.guardActions}>
              <button
                type="button"
                className={styles.primaryModeButton}
                onClick={() => {
                  void requestRootFullscreen().then((granted) => {
                    if (!granted) {
                      setStatusMessage(ui.fullscreenRestoreFailed);
                    }
                  });
                }}
              >
                {ui.returnToFullscreen}
              </button>
              <button
                type="button"
                className={`${styles.exitGateButton} ${exitGateArmed ? styles.exitGateArmed : ''}`.trim()}
                onPointerDown={armExitGate}
                onPointerUp={disarmExitGate}
                onPointerLeave={disarmExitGate}
                onPointerCancel={disarmExitGate}
                aria-label={ui.holdToExit}
              >
                <strong>{ui.holdToExit}</strong>
                <small>{ui.parentOnly}</small>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className={`${styles.helperRow} ${kidModeEnabled ? styles.helperRowHidden : ''}`.trim()}>
        <p className={styles.helperText}>{localizedExperience.helperText}</p>
        <p className={styles.keyboardHint}>{localizedExperience.keyboardHint}</p>
        <p className={styles.shortcutHint}>{ui.screensaverHint}</p>
      </div>

      <p className={`${styles.liveStatus} ${kidModeEnabled ? styles.liveStatusHidden : ''}`.trim()} aria-live="polite">
        {statusMessage}
      </p>
    </section>
  );
}
