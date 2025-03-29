const puppeteer = require('puppeteer');
const { defineFeature, loadFeature } = require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;
const feature = loadFeature('./features/register-form.feature');

let page;
let browser;

defineFeature(feature, (test) => {
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
});