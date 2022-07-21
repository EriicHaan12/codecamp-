import puppeteer from "puppeteer";
import mongoose from "mongoose";

// Stock 모델 import
import { Starbuck } from "./models/starbucks.model.js";

//몽고DB 접속!!
mongoose.connect("mongodb://localhost:27017/myproject04");

// DB연결

async function startCrawling() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.goto("https://www.starbucks.co.kr/menu/drink_list.do");
  await page.waitForTimeout(1000);

  for (let i = 1; i <= 30; i++) {
    await page.waitForTimeout(3000);
    const name = await page.$eval(
      `#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(6) > 
        ul > li:nth-child(${i}) > dl > dd`,
      (el) => el.textContent
    );

    const image = await page.$eval(
      `#container > div.content > div.product_result_wrap.product_result_wrap01 > div > dl > dd:nth-child(2) > div.product_list > dl > dd:nth-child(6) >
         ul > li:nth-child(${i}) > dl > dt > a > img`,
      (el) => el.src
    );

    // DB에 저장
    const stock = new Starbuck({
      name: name,
      image: image,
    });
    await stock.save();
    console.log(`name: ${name}, image: ${image}`);
  }
  //////

  await browser.close();
}

startCrawling();
