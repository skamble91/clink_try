import dayjs from "dayjs";
import { getPool } from "./helper.js";

interface DailyPriceData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

export interface HistoricalPriceData {
  symbol: string;
  historical: DailyPriceData[];
}

export async function storePricesInDb(priceData: HistoricalPriceData) {
  const pool = await getPool();

  const sqlPrefix = `INSERT INTO DailyStockPrices 
    (symbol, 
     date,
     highCents,
     lowCents,
     openCents,
     closeCents,
     volume) 
   `;

  let values = "Values ";

  for (let i = 0; i < priceData.historical.length; i++) {
    const price = priceData.historical[i];
    values += `('${priceData.symbol}', '${toDate(price.date)}',
     '${toCents(price.high)}', '${toCents(price.low)}', ${toCents(
      price.open
    )}, '${toCents(price.close)}',  ${price.volume})${
      i === priceData.historical.length - 1 ? "" : ","
    }`;
  }

  // console.log(values);
  const query = sqlPrefix + values;

  console.log(query);
  await pool.execute(query);
  console.log("executed query");
}

function toCents(price: number) {
  return Math.round(price * 100);
}

function fromCents(price: number) {
  return price / 100;
}

function toDate(date: string) {
  const dayjsDate = dayjs(date);
  return dayjsDate.format("YYYY-MM-DD HH:mm:ss");
}
