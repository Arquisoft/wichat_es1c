const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/register-form.feature');

let page;
let browser;

defineFeature(feature, (test) => {
  beforeAll(async () => {

    jest.setTimeout(80000);

    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      : await puppeteer.launch({ headless: false, slowMo: 0 });

    page = await browser.newPage();
    setDefaultOptions({ timeout: 60000 });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' }).catch(() => {});
  });

  beforeEach(async () => {
    await page.reload({ waitUntil: 'networkidle0' });
  });

  test('The user navigates to the register page and completes registration', ({ given, when, then, and }) => {
    given('The user is on the login page', async () => {
      await page.waitForSelector('.login-container', { visible: true });
      await expect(page).toMatchElement('h5', { text: 'Login' });
    });

    when('The user clicks on the register link', async () => {
      await page.waitForSelector('a[href="/register"]', { visible: true });
      await page.click('a[href="/register"]');
    });

    then('The user should be redirected to the register page', async () => {
      await page.waitForSelector('.register-container', { visible: true });
      await expect(page).toMatchElement('h5', { text: 'Registro' });
    });

    and('The user fills the form and clicks "Registrarse"', async () => {
      await page.type('[data-testid="nombre-input"]', 'Test E2E');
      const randomEmail = `test${Math.floor(Math.random() * 10000)}@e2e.com`;
      await page.type('[data-testid="email-input"]', randomEmail);
      await page.type('[data-testid="pass-input"]', 'testpassword');

      const registerButton = await page.$x("//button[contains(., 'Registrarse')]");
      if (registerButton.length > 0) {
        await registerButton[0].click();
      }
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
