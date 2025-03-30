const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/login-form.feature');

let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      : await puppeteer.launch({ headless: false, slowMo: 0 });
    page = await browser.newPage();
    
    setDefaultOptions({ timeout: 10000 });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' }).catch(() => {});
  });

  beforeEach(async () => {
    await page.reload({ waitUntil: 'networkidle0' });
  });
  

  test('The user is not registered in the site', ({ given, when, then }) => {
    let email, password;

    given('An unregistered user', async () => {
      email = 'unregistered@example.com';
      password = 'wrongpassword';
    });

    when('I fill the data in the login form and press submit', async () => {
      await page.waitForSelector('input[type="email"]', { visible: true });
      await page.type('input[type="email"]', email);
      
      await page.waitForSelector('input[type="password"]', { visible: true });
      await page.type('input[type="password"]', password);

      await page.waitForSelector('button.login-button', { visible: true });
      await page.click('button.login-button');
    });

    then('An error message should be shown in the screen', async () => {
      await page.waitForSelector('.MuiSnackbar-root', { visible: true });
      await expect(page).toMatchElement('.MuiSnackbar-root', { text: 'Error al iniciar sesión' });
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});


  