const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/game-enter.feature');

let page;
let browser;

defineFeature(feature, test => {

  beforeAll(async () => {
    jest.setTimeout(80000);
    browser = process.env.GITHUB_ACTIONS
          ? await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
          : await puppeteer.launch({ headless: false, slowMo: 0 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 60000 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  });

  beforeEach(async () => {
    await page.reload({ waitUntil: 'networkidle0' });
  });

  test('The user logs in and navigates to the game page', ({ given, when, then }) => {
    given('A valid user', async () => {
      // Pantalla inicial de login
    });

    when('I log in and click the Juego button', async () => {
      await page.waitForSelector('input[type="email"]', { visible: true });
      await page.type('input[type="email"]', 'test@test');

      await page.waitForSelector('input[type="password"]', { visible: true });
      await page.type('input[type="password"]', 'test');

      await page.waitForSelector('button.login-button', { visible: true });
      await page.click('button.login-button');

      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      await expect(page).toClick('button', { text: 'Juego' });

      // Esperar que la ruta cambie a /game
      await page.waitForFunction(() => window.location.pathname === '/game');
    });

    then('I should see the game configuration screen', async () => {
      // Validamos el título del componente GameOptions
      await page.waitForSelector('h3', { visible: true });
      await expect(page).toMatchElement('h3', { text: /configuración del juego/i });
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
