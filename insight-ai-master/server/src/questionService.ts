import {
  generateStockQuestion,
  generateTransactionQuestion,
  reaskQuestion,
} from "./chatGpt.js";
import { isMain } from "./helpers.js";
import { executeQuery } from "./db/index.js";

export type DataSouce = "transactions" | "stock";

export interface QueryResponse {
  rows: any[];
  query: string;
}

export async function answerQuestion(
  question: string,
  dataSource: DataSouce
): Promise<QueryResponse> {
  let query: string;

  switch (dataSource) {
    case "stock":
      query = await generateStockQuestion(question);
      break;
    case "transactions":
      query = await generateTransactionQuestion(question);
      break;
    default:
      throw new Error("Invalid data source: " + dataSource);
  }

  let rows: any[] = [];
  try {
    rows = await executeQuery(query);
  } catch (e) {
    const typedError = e as { sqlMessage: string };

    console.log("Failed once");
    console.log(e);

    const retryQuery = await reaskQuestion(query, typedError.sqlMessage);
    console.log("Retrying with: " + retryQuery);
    rows = await executeQuery(retryQuery);
  }

  return {
    rows,
    query,
  };
}

if (isMain(import.meta.url)) {
  (async () => {
    await answerQuestion(
      "What percent of customers are repeat customers?",
      "transactions"
    );
    process.exit(0);
  })();
}
