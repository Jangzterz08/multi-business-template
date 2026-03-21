import { mkdir } from 'node:fs/promises';

const baseUrl = process.env.KEYBOARD_VERIFY_URL ?? 'http://127.0.0.1:4180';
const outputDir = 'output/web-game';
const runtimeSpecifier = process.env.PLAYWRIGHT_RUNTIME_PATH ?? 'playwright';
const { chromium } = await import(runtimeSpecifier);

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForSelector('[data-testid="keyboard-playground"]', { timeout: 30000 });

await page.getByRole('button', { name: /Switch website to Italian|Passa il sito in italiano/i }).click();
await page.getByRole('button', { name: /Switch website to dark mode|Passa al tema scuro/i }).click();

const homePageState = await page.evaluate(() => ({
  heading: document.querySelector('[data-testid="route-home"] h1')?.textContent ?? null,
  navLabels: Array.from(document.querySelectorAll('header nav a')).map((link) => link.textContent?.trim() ?? ''),
  theme: document.documentElement.dataset.siteTheme || null,
  locale: document.documentElement.dataset.siteLocale || null
}));

if (homePageState.heading !== 'Trasforma qualsiasi tastiera del computer in un mini piano giocoso per piccole mani curiose.') {
  throw new Error('Home page did not switch to the Italian heading.');
}

if (homePageState.navLabels.join('|') !== 'Home|Modalita|Chi siamo|Contatti') {
  throw new Error(`Unexpected Italian nav labels: ${homePageState.navLabels.join('|')}`);
}

await page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForSelector('[data-testid="keyboard-playground"]', { timeout: 30000 });

const reloadedHomeState = await page.evaluate(() => ({
  heading: document.querySelector('[data-testid="route-home"] h1')?.textContent ?? null,
  navLabels: Array.from(document.querySelectorAll('header nav a')).map((link) => link.textContent?.trim() ?? ''),
  theme: document.documentElement.dataset.siteTheme || null,
  locale: document.documentElement.dataset.siteLocale || null
}));

if (reloadedHomeState.heading !== homePageState.heading) {
  throw new Error('Home page heading did not persist after reload.');
}

if (reloadedHomeState.navLabels.join('|') !== 'Home|Modalita|Chi siamo|Contatti') {
  throw new Error(`Reload lost Italian nav labels: ${reloadedHomeState.navLabels.join('|')}`);
}

if (reloadedHomeState.theme !== 'dark' || reloadedHomeState.locale !== 'it') {
  throw new Error('Stored site theme/locale did not persist after reload.');
}

await page.getByRole('button', { name: /Start Kid Mode|Avvia modalita bimbo/i }).click();
await page.waitForTimeout(600);

await page.keyboard.press('a');
await page.waitForTimeout(320);
await page.keyboard.press('s');
await page.waitForTimeout(220);

const kidModeState = await page.evaluate(() => ({
  playMode: document.documentElement.dataset.playMode || null,
  shellHeaderOpacity: getComputedStyle(document.querySelector('header')).opacity,
  headerContactNumberVisible: Boolean(Array.from(document.querySelectorAll('header a')).find((link) => /\(\d{3}\)|\+\d/.test(link.textContent ?? ''))),
  siteTelLinkCount: document.querySelectorAll('a[href^="tel:"]').length,
  playgroundClientHeight: document.querySelector('[data-testid="keyboard-playground"]')?.clientHeight ?? null,
  playgroundScrollHeight: document.querySelector('[data-testid="keyboard-playground"]')?.scrollHeight ?? null,
  playgroundLocaleToggleCount:
    Array.from(document.querySelectorAll('[data-testid="keyboard-playground"] button')).filter((button) =>
      /Switch website to Italian|Switch website to English|Passa il sito in italiano|Passa il sito in inglese/i.test(button.getAttribute('aria-label') ?? '')
    ).length ?? null,
  playgroundThemeToggleCount:
    Array.from(document.querySelectorAll('[data-testid="keyboard-playground"] button')).filter((button) =>
      /Switch website to dark mode|Switch website to light mode|Passa al tema scuro|Passa al tema chiaro/i.test(button.getAttribute('aria-label') ?? '')
    ).length ?? null,
  snapshot: window.render_game_to_text ? JSON.parse(window.render_game_to_text()) : null
}));

if (kidModeState.playgroundLocaleToggleCount !== 0) {
  throw new Error('Language toggle should stay outside the fullscreen play mode.');
}

if (kidModeState.playgroundThemeToggleCount !== 0) {
  throw new Error('Theme toggle should stay outside the fullscreen play mode.');
}

if (kidModeState.headerContactNumberVisible) {
  throw new Error('Header contact number should be removed.');
}

if (kidModeState.siteTelLinkCount !== 0) {
  throw new Error('Education preset should not expose phone links on the website.');
}

await page.screenshot({ path: `${outputDir}/keyboard-kid-mode-on.png`, fullPage: true });

await page.evaluate(() => document.exitFullscreen());
await page.waitForTimeout(250);

const guardState = await page.evaluate(() => ({
  playMode: document.documentElement.dataset.playMode || null,
  snapshot: window.render_game_to_text ? JSON.parse(window.render_game_to_text()) : null
}));

await page.screenshot({ path: `${outputDir}/keyboard-kid-mode-lock.png`, fullPage: true });

await page.getByRole('button', { name: /Return to full screen|Torna a schermo intero/i }).click();
await page.waitForTimeout(500);

const restoredState = await page.evaluate(() => ({
  playMode: document.documentElement.dataset.playMode || null,
  snapshot: window.render_game_to_text ? JSON.parse(window.render_game_to_text()) : null
}));

await page.waitForTimeout(1700);

const cooledState = await page.evaluate(() => ({
  snapshot: window.render_game_to_text ? JSON.parse(window.render_game_to_text()) : null
}));

const exitButton = page.getByRole('button', { name: /Hold to exit|Tieni premuto per uscire/i });
const box = await exitButton.boundingBox();

if (box == null) {
  throw new Error('Exit button not found for hold gesture');
}

await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.waitForTimeout(1900);
await page.mouse.up();
await page.waitForTimeout(250);

const exitedState = await page.evaluate(() => ({
  playMode: document.documentElement.dataset.playMode || null,
  snapshot: window.render_game_to_text ? JSON.parse(window.render_game_to_text()) : null
}));

await page.screenshot({ path: `${outputDir}/keyboard-kid-mode-off.png`, fullPage: true });

await page.locator('header nav').getByRole('link', { name: 'Modalita', exact: true }).click();
await page.waitForSelector('[data-testid="route-services"]', { timeout: 30000 });

const servicesPageState = await page.evaluate(() => ({
  heading: document.querySelector('[data-testid="route-services"] h1')?.textContent ?? null
}));

if (servicesPageState.heading !== 'Come i bambini possono giocare con TinyKeys') {
  throw new Error('Services page did not switch to the Italian heading.');
}

await page.locator('header nav').getByRole('link', { name: 'Chi siamo', exact: true }).click();
await page.waitForSelector('[data-testid="route-about"]', { timeout: 30000 });

const aboutPageState = await page.evaluate(() => ({
  heading: document.querySelector('[data-testid="route-about"] h1')?.textContent ?? null
}));

if (aboutPageState.heading !== 'Un gioco musicale semplice e immediato, pensato per i bambini che vogliono premere ogni tasto che trovano.') {
  throw new Error('About page did not switch to the Italian heading.');
}

await page.locator('header nav').getByRole('link', { name: /Contatti|Contact/i, exact: true }).click();
await page.waitForSelector('[data-testid="route-contact"]', { timeout: 30000 });
await page.waitForTimeout(700);

const contactPageState = await page.evaluate(() => ({
  routeHeading: document.querySelector('[data-testid="route-contact"] h1')?.textContent ?? null,
  telLinkCount: document.querySelectorAll('a[href^="tel:"]').length,
  phoneInputVisible: Boolean(document.querySelector('input[name="phone"]')),
  theme: document.documentElement.dataset.siteTheme || null
}));

if (contactPageState.telLinkCount !== 0) {
  throw new Error('Contact page should not show a phone link for the education preset.');
}

if (contactPageState.phoneInputVisible) {
  throw new Error('Contact page should not show a phone input.');
}

await page.getByRole('button', { name: 'Invia richiesta' }).click();
await page.waitForTimeout(200);

const contactValidationState = await page.evaluate(() => ({
  errorText: Array.from(document.querySelectorAll('form span, form p'))
    .map((node) => node.textContent?.trim() ?? '')
    .filter(Boolean)
}));

for (const expectedError of [
  'Controlla i campi evidenziati e riprova.',
  'Inserisci il tuo nome.',
  'Inserisci un indirizzo email valido.',
  'Seleziona un opzione.',
  'Aggiungi un breve messaggio per aiutarci a capire di cosa hai bisogno.',
  'Conferma il consenso per essere ricontattato.'
]) {
  if (!contactValidationState.errorText.includes(expectedError)) {
    throw new Error(`Missing localized contact-form error: ${expectedError}`);
  }
}

await page.screenshot({ path: `${outputDir}/website-contact-no-phone.png`, fullPage: true });

console.log(
  JSON.stringify(
    {
      baseUrl,
      homePageState,
      reloadedHomeState,
      kidModeState,
      guardState,
      restoredState,
      cooledState,
      exitedState,
      servicesPageState,
      aboutPageState,
      contactPageState,
      contactValidationState
    },
    null,
    2
  )
);

await browser.close();
