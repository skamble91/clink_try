import { isMain } from "../helpers.js";
import fetch from "node-fetch";
import { FMP_API_KEY } from "../config.js";
import { PromisePool } from "@supercharge/promise-pool/dist/promise-pool.js";
import { HistoricalPriceData, storePricesInDb } from "../db/fmpQueries.js";

export async function getHistoricalPrice(ticker: string) {
  const unparsedPrices = await fetch(
    `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?apikey=${FMP_API_KEY}`
  );

  const prices = JSON.parse(await unparsedPrices.text());
  return prices;
}

export async function getTickerSymbols(exchange: string) {
  const response = await fetch(
    `https://financialmodelingprep.com/api/v3/search?query=&exchange=${exchange}&apikey=${FMP_API_KEY}`
  );

  const symbolList = JSON.parse(await response.text());

  return symbolList as any[];
}

async function backfillStockPrices() {
  // const nasdaqTickers = await getTickerSymbols("NASDAQ");
  // const nyseTickers = await getTickerSymbols("NYSE");

  await PromisePool.for(exampleTickers)
    .withConcurrency(5)
    .process(async (ticker) => {
      const priceData = (await getHistoricalPrice(
        // ticker.symbol
        ticker
      )) as HistoricalPriceData;

      console.log(`Storing ${ticker} prices in db`);
      await storePricesInDb(priceData);
    });
}

const exampleTickers = [
  "AAPL",
  "MSFT",
  "GOOG",
  "AMZN",
  "BRK.A",
  "NVDA",
  "TSLA",
  "META",
  "UNH",
  "XOM",
  "V",
  "JNJ",
  "WMT",
  "JPM",
  "PG",
  "LLY",
  "MA",
  "CVX",
  "HD",
  "MRK",
  "ABBV",
  "KO",
  "AVGO",
  "ORCL",
  "PEP",
  "PFE",
  "BAC",
  "TMO",
  "COST",
  "CSCO",
  "MCD",
  "CRM",
  "ACN",
  "NKE",
  "DIS",
  "ABT",
  "DHR",
  "LIN",
  "ADBE",
  "VZ",
  "TXN",
  "UPS",
  "NEE",
  "CMCSA",
  "PM",
  "NFLX",
  "AMD",
  "BMY",
  "WFC",
  "MS",
];

if (isMain(import.meta.url)) {
  (async () => {
    await backfillStockPrices();
    process.exit(0);
  })();
}
