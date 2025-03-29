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
      : await puppeteer.launch({ headless: false, slowMo: 100 });
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

  test('The user is registered in the site and is redirected to /home', ({ given, when, then }) => {
    let email, password;
    given('A registered user', async () => {
      email = 'test@test2';
      password = 'test';
    });
    when('I fill the data in the login form and press submit', async () => {
      await page.waitForSelector('input[type="email"]', { visible: true });
      await page.type('input[type="email"]', email);
      
      await page.waitForSelector('input[type="password"]', { visible: true });
      await page.type('input[type="password"]', password);
  
      await page.waitForSelector('button.login-button', { visible: true });
      await page.click('button.login-button');
    });
    then('I should be redirected to the /home page', async () => {
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      const currentUrl = await page.url();
      expect(currentUrl).toBe('http://localhost:3000/home');
    });
  });
});

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
      : await puppeteer.launch({ headless: false, slowMo: 100 });
    page = await browser.newPage();
    
    setDefaultOptions({ timeout: 10000 });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' }).catch(() => {});
  });

  test('The user tries to register with an already existing email', ({ given, when, then }) => {
    let name, email, password;

    given('A user with the email "test@tet2" exists', async () => {
      // Simular que el usuario con el correo ya está registrado en el sistema.
      // En un test real, puedes simular esto usando una base de datos mock o haciendo una llamada a una API para registrar el usuario previamente.
      email = 'test@tet2';
      name = 'Test User';
      password = 'testpassword';
    });

    when('I fill the registration form with the email "test@test2", a name, and a password and press submit', async () => {
      await page.waitForSelector('a[href="/register"]', { visible: true });
      await page.click('a[href="/register"]');

      await page.waitForSelector('input[name="name"]', { visible: true });
      await page.type('input[name="name"]', name);

      await page.waitForSelector('input[type="email"]', { visible: true });
      await page.type('input[type="email"]', 'test@test2');

      await page.waitForSelector('input[type="password"]', { visible: true });
      await page.type('input[type="password"]', password);

      await page.waitForSelector('button.register-button', { visible: true });
      await page.click('button.register-button');
    });

    then('An error message should be shown indicating that the email is already registered', async () => {
      // Esperar y verificar que el error sea mostrado
      await page.waitForSelector('.MuiSnackbar-root', { visible: true });
      await expect(page).toMatchElement('.MuiSnackbar-root', { text: 'El correo electrónico ya está registrado' });
    });
  });

  test('The user registers successfully', ({ given, when, then }) => {
    let name, email, password;

    given('A user does not exist with the email "newuser@example.com"', async () => {
      // Asumimos que el correo no está registrado
      email = 'newuser@example.com';
      name = 'New User';
      password = 'newpassword';
    });

    when('I fill the registration form with the email "newuser@example.com", a name, and a password and press submit', async () => {
      await page.waitForSelector('a[href="/register"]', { visible: true });
      await page.click('a[href="/register"]');

      await page.waitForSelector('input[name="name"]', { visible: true });
      await page.type('input[name="name"]', name);

      await page.waitForSelector('input[type="email"]', { visible: true });
      await page.type('input[type="email"]', email);

      await page.waitForSelector('input[type="password"]', { visible: true });
      await page.type('input[type="password"]', password);

      await page.waitForSelector('button.register-button', { visible: true });
      await page.click('button.register-button');
    });

    then('I should be redirected to the /home page', async () => {
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      const currentUrl = await page.url();
      expect(currentUrl).toBe('http://localhost:3000/home');
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
