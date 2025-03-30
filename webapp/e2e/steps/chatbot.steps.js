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
      // Asegurarte de que haya cargado una pregunta
      await page.waitForSelector('button', { visible: true, timeout: 10000 });

    });
    

    when('The user opens the chatbot', async () => {
      // Espera a que el juego cargue
      await page.waitForSelector('button', { visible: true, timeout: 10000 });
    
      // Espera y abre el chatbot
      await page.waitForSelector('.cb-floating-container', { visible: true, timeout: 10000 });
      await page.click('.cb-floating-container');
    });
    

    and('The user types a question and submits it', async () => {
      await page.waitForSelector('input[type="text"]', { visible: true });
      await page.type('input[type="text"]', '¿Me das una pista?');
      await page.keyboard.press('Enter');
    });

    then('The chatbot should show a welcome message', async () => {
      await page.waitForSelector('.cb-chat-bubble', { visible: true, timeout: 10000 });
      const text = await page.$eval('.cb-chat-bubble', el => el.textContent);
      expect(text).toMatch(/hola|pista/i);
    });
  });

  afterAll(async () => {
    await browser.close();
  });
});
