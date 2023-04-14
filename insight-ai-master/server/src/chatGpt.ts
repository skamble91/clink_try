import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY } from "./config.js";

export async function generateTransactionQuestion(
  question: string
): Promise<string> {
  const context = `The following describes a mysql table I have: CREATE TABLE 'Transactions' (
  'id' int NOT NULL,
  'customer_id' int DEFAULT NULL,
  'customer_name' varchar(100) DEFAULT NULL,
  'credit_card_type' varchar(45) DEFAULT NULL,
  'time' datetime DEFAULT NULL,
  'product_id' int DEFAULT NULL,
  'product_name' varchar(50) DEFAULT NULL,
  'transaction_cost' int DEFAULT NULL,
  'profit' int DEFAULT NULL,
  PRIMARY KEY ('id')); Write me a mysql query (keeping in mind that ONLY_FULL_GROUP_BY is enabled) that determines `;

  return askChatGptQuestionWithContext(context + question);
}

export async function generateStockQuestion(question: string): Promise<string> {
  const context = `The following describes a mysql table I have: CREATE TABLE 'DailyStockPrices' (
  'id' int NOT NULL AUTO_INCREMENT,
  'symbol' varchar(45) DEFAULT NULL,
  'date' date DEFAULT NULL,
  'highCents' int DEFAULT NULL,
  'lowCents' int DEFAULT NULL,
  'openCents' int DEFAULT NULL,
  'closeCents' int DEFAULT NULL,
  'volume' int DEFAULT NULL,
  PRIMARY KEY ('id')) Write me a mysql query (with only full group bys since ONLY_FULL_GROUP_BY is enabled) that determines the following (return the cent values as dollars) `;

  return askChatGptQuestionWithContext(context + question);
}

export async function reaskQuestion(query: string, errorMessage: string) {
  return askChatGptQuestionWithContext(
    `i ran the following query: ${query} and got the following error: ${errorMessage}} What is the correct sql query?`
  );
}

async function askChatGptQuestionWithContext(question: string) {
  const configuration = new Configuration({
    organization: "org-wypXWZRBP7VHeQ1qi3vPl2VS",
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: question,
    max_tokens: 100,
    temperature: 0.01,
  });

  if (completion.data.choices.length > 1) {
    console.log(completion.data.choices);
    throw new Error(`There were ${completion.data.choices.length} choices`);
  }

  return completion.data.choices[0].text!;
}
