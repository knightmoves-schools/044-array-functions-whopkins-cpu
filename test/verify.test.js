const http = require("http");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { assert } = require("console");

let server;
let browser;
let page;

beforeAll(async () => {
  server = http.createServer(function (req, res) {
    fs.readFile(__dirname + "/.." + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(process.env.PORT || 3000);
});

afterAll(() => {
  server.close();
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  page = await browser.newPage();
  await page.goto("http://localhost:3000/index.html");
});

afterEach(async () => {
  await browser.close();
});

describe('the index.js file', () => {
  it('should create a variable named automobiles that contains car, truck, motorcycle', async function() {
    const automobiles = await page.evaluate(() => automobiles);
    expect(automobiles).toBeDefined();
    expect(automobiles.length).toBe(5);
    expect(automobiles[1]).toBe('car');
    expect(automobiles[2]).toBe('truck');
    expect(automobiles[3]).toBe('motorcycle');
  });

  it('should add airplane and skateboard to the end of automobiles', async function() {
    const automobiles = await page.evaluate(() => automobiles);
    expect(automobiles[4]).toBe('airplane');
  });

  it('should add helicopter and bike to the front of the automobiles', async function() {
    const automobiles = await page.evaluate(() => automobiles);
    expect(automobiles[0]).toBe('helicopter');
  });

  it('should define a new variable called automobilesCopy and set it equal to a string template that contains the variable automobiles', async function() {
    const automobilesCopy = await page.evaluate(() => automobilesCopy);
     expect(automobilesCopy).toBeDefined();
     expect(automobilesCopy).toContain('bike,helicopter,car,truck,motorcycle,airplane,skateboard');
  });

  it('should remove skateboard from the end of the the automobiles', async function() {
    const automobiles = await page.evaluate(() => automobiles);
    expect(automobiles).not.toContain('skateboard');
  });

  it('should remove bike from the front of the automobiles', async function() {
    const automobiles = await page.evaluate(() => automobiles);
    expect(automobiles).not.toContain('bike');
  });

  it('should assign the innerHTML of the HTML element with the id result to automobiles', async function() {
    const automobiles = await page.evaluate(() => automobiles);
    const innerHtml = await page.$eval("#result", (result) => {
      return result.innerHTML;
    });

    expect(innerHtml).toBe(automobiles.toString());
  });
});

