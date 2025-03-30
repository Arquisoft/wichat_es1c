const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/home-form.feature');

let page;
let browser;

defineFeature(feature, test => {
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      : await puppeteer.launch({ headless: false, slowMo: 100 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 10000 });
  });

  beforeEach(async () => {
    await page.goto('http://localhost:3000/home', { waitUntil: 'networkidle0' });
  });

  test('User is welcomed on the home page', ({ given, when, then }) => {
    let token;

    given('A logged-in user with a valid token', async () => {
      token = JSON.stringify({ name: 'TestUser' });
      await page.evaluate(token => {
        localStorage.setItem('token', token);
      }, token);
    });

    when('I visit the home page', async () => {
      await page.reload({ waitUntil: 'networkidle0' });
    });

    then('I should see a welcome message', async () => {
      await page.waitForSelector('h2', { visible: true });
      await expect(page).toMatch('¡Bienvenido de nuevo, TestUser!');
    });
  });

  test('Home page loads required components', ({ given, when, then }) => {
    given('A logged-in user', async () => {
      const token = JSON.stringify({ name: 'TestUser' });
      await page.evaluate(token => {
        localStorage.setItem('token', token);
      }, token);
    });

    when('I visit the home page', async () => {
      await page.reload({ waitUntil: 'networkidle0' });
    });

    then('I should see the OptionsDropdown and PersonalRanking components', async () => {
      await page.waitForSelector('button.options-dropdown', { visible: true });
      await page.waitForSelector('.personal-ranking', { visible: true });
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
