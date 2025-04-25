const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/menu.feature');

let page;
let browser;

defineFeature(feature, test => {
  beforeAll(async () => {
    jest.setTimeout(80000);
    browser = await puppeteer.launch({ headless: false, slowMo: 0 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 60000 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  });

  beforeEach(async () => {
    await page.reload({ waitUntil: 'networkidle0' });
  });

  test('The user logs in and accesses the FAQ', ({ given, when, then }) => {
    given('I am on the login page', async () => {
      await page.waitForSelector('input[type="email"]', { visible: true });
    });

    when('I log in with valid credentials and open the FAQ menu', async () => {
      await page.type('input[type="email"]', 'dani@dani');
      await page.type('input[type="password"]', 'dani');

      await page.waitForSelector('button.login-button', { visible: true });
      await page.click('button.login-button');

      await page.waitForNavigation({ waitUntil: 'networkidle0' });

      await expect(page).toClick('button', { text: 'HELP' });
      await page.waitForSelector('li', { visible: true });
      await expect(page).toClick('li', { text: 'FAQ' });
    });

    then('I should see the FAQ page with the questions', async () => {
      await page.waitForSelector('body', { visible: true });
      const content = await page.content();
      expect(content).toMatch(/preguntas frecuentes/i);
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
