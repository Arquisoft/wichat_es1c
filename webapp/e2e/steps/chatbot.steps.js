const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;

const feature = loadFeature('./features/chatbot.feature');

let page;
let browser;

defineFeature(feature, test => {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 0 });
    page = await browser.newPage();
    setDefaultOptions({ timeout: 20000 });

    await page.goto('http://localhost:3000/home', { waitUntil: 'networkidle0' });
  });

  test('User interacts with the chatbot and receives a response', ({ given, when, then, and }) => {
    given('The user is on the game page', async () => {
        await page.goto('http://localhost:3000/game', { waitUntil: 'networkidle0' });
      });

    when('The user opens the chatbot', async () => {
      // Esperar a que aparezca el botón flotante o ventana del chatbot
      await page.waitForSelector('.cb-floating-container', { visible: true });
      await page.click('.cb-floating-container');
    });

    and('The user types a question and submits it', async () => {
      await page.waitForSelector('input[type="text"]', { visible: true });
      await page.type('input[type="text"]', '¿Me das una pista?');
      await page.keyboard.press('Enter');
    });

    then('The chatbot should return a helpful response', async () => {
      await page.waitForFunction(
        () => {
          const bubbles = Array.from(document.querySelectorAll('.cb-bubble'));
          return bubbles.some(b => b.innerText.includes('pista') || b.innerText.length > 10);
        },
        { timeout: 15000 }
      );
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
