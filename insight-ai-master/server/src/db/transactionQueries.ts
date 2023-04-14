import dayjs from "dayjs";
import { isMain } from "../helpers.js";
import { executeQuery, getPool } from "./helper.js";

export async function backfillTransactions() {
  // todo write a sql query to inserts a bunch of random transactions

  const TRANSACTIONS_TO_ADD = 994;

  let query = `INSERT INTO Transactions 
  (customer_id, customer_name, credit_card_type, time, product_id, product_name, transaction_cost, profit) 
  VALUES
  `;

  for (let i = 0; i < TRANSACTIONS_TO_ADD; i++) {
    query += generateTransactionRow(i === TRANSACTIONS_TO_ADD - 1);
  }

  await executeQuery(query);
}

function generateTransactionRow(isLast: boolean) {
  const customer = getRandomCustomer();
  const creditCardName = getRandomCreditCardName();
  const date = getRandomDate();
  const product = getRandomProduct();

  return `(${customer.id}, '${customer.name}',
     '${creditCardName}', '${date}', ${product.id}, '${product.name}', ${
    product.price
  }, ${product.profit})${isLast ? "" : ","}`;
}

function getRandomCustomer() {
  const customers = [
    { id: 1, name: "Parker" },
    { id: 2, name: "Hank" },
    { id: 3, name: "Molly" },
    { id: 4, name: "Maggie" },
    { id: 5, name: "Bobby" },
    { id: 6, name: "Sally" },
    { id: 7, name: "Bob" },
    { id: 8, name: "Sam" },
    { id: 9, name: "Sue" },
    { id: 10, name: "Tim" },
    { id: 11, name: "Tom" },
    { id: 12, name: "Tammy" },
    { id: 13, name: "Terry" },
    { id: 14, name: "Tina" },
    { id: 15, name: "Tara" },
    { id: 16, name: "Tessa" },
    { id: 17, name: "Tiffany" },
    { id: 18, name: "Tucker" },
    { id: 19, name: "Troy" },
    { id: 20, name: "Tracy" },
    { id: 21, name: "Trevor" },
    { id: 22, name: "Trey" },
    { id: 23, name: "Tyler" },
    { id: 24, name: "Tyson" },
    { id: 25, name: "Tony" },
  ];

  return customers[Math.floor(Math.random() * customers.length)];
}

function getRandomCreditCardName() {
  const creditCardNames = [
    "Visa",
    "Mastercard",
    "American Express",
    "Discover",
  ];

  return creditCardNames[Math.floor(Math.random() * creditCardNames.length)];
}

function getRandomDate() {
  const rightNow = dayjs();
  const twoYearsAgo = rightNow.subtract(2, "year");

  const randomOffsetMillis =
    Math.random() * (rightNow.valueOf() - twoYearsAgo.valueOf());

  const randomMillis = rightNow.valueOf() - randomOffsetMillis;
  return dayjs(randomMillis).format("YYYY-MM-DD HH:mm:ss");
}

function getRandomProduct() {
  const products = [
    { id: 1, name: "Great Expectaions", price: 12, profit: 2 },
    { id: 2, name: "The Grapes of Wrath", price: 26, profit: 2 },
    { id: 3, name: "The Great Gatsby", price: 22, profit: 2 },
    { id: 4, name: "The Catcher in the Rye", price: 7, profit: 2 },
    { id: 5, name: "To Kill a Mockingbird", price: 16, profit: 3 },
    { id: 6, name: "Pride and Prejudice", price: 11, profit: 3 },
    { id: 7, name: "The Lord of the Rings", price: 29, profit: 3 },
    { id: 8, name: "The Hobbit", price: 9, profit: 4 },
    {
      id: 9,
      name: "Harry Potter and the Sorcerers Stone",
      price: 13,
      profit: 4,
    },
    {
      id: 10,
      name: "Harry Potter and the Chamber of Secrets",
      price: 24,
      profit: 4,
    },
    { id: 11, name: "The Giver", price: 26, profit: 2 },
    { id: 12, name: "The Hunger Games", price: 7, profit: 2 },
    { id: 13, name: "The Sun Also Rises", price: 29, profit: 5 },
    { id: 14, name: "The Pearl", price: 12, profit: 5 },
    { id: 15, name: "The Old Man and the Sea", price: 26, profit: 1 },
    { id: 16, name: "The Metamorphosis", price: 22, profit: 1 },
    { id: 17, name: "The Kite Runner", price: 10, profit: 1 },
    { id: 18, name: "The Scarlet Letter", price: 20, profit: 7 },
  ];

  return products[Math.floor(Math.random() * products.length)];
}

export async function updateDates() {
  console.log("updating dates");
  const pool = await getPool();
  let id = 101;
  let finalId = 1000;
  while (id <= finalId) {
    const randomDate = getRandomDate();
    const query = `UPDATE Transactions SET time = '${randomDate}' WHERE id = ${id}`;
    await pool.execute(query);

    console.log("updated date", id);
    id++;
  }
}

if (isMain(import.meta.url)) {
  (async () => {
    await executeQuery(`SELECT MONTH(time) AS month, SUM(transaction_cost) AS revenue
FROM Transactions
WHERE time BETWEEN DATE_SUB(NOW(), INTERVAL 6 MONTH) AND NOW()
GROUP BY MONTH(time)
ORDER BY month ASC;`);
    process.exit(0);
  })();
}
