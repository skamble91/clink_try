import { FastifyInstance } from "fastify";
import { answerQuestion, DataSouce } from "./questionService.js";

interface ChatRequest {
  message: string;
  questionSource: DataSouce;
}

/**
 * Encapsulates the payment routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
export async function chatRoutes(fastify: FastifyInstance, options: Object) {
  fastify.post("/sendMessage", {}, async (request, response) => {
    const body = request.body as ChatRequest;

    const answer = await answerQuestion(body.message, "stock");

    console.log("converting answer to chart");
    const data = convertAnswerToChart(answer.rows);
    console.log("returning answer");

    console.log(answer);
    console.log(1);
    console.log(data);
    console.log(2);
    console.log(answer.query);
    console.log(3);

    return { message: answer, data, query: answer.query };
  });
}

export function convertAnswerToChart(data: any[]) {
  const categories: string[] = [];
  const series: number[] = [];

  for (const row of data) {
    let addedCategory = false;
    let addedSeries = false;
    for (const key in row) {
      if (
        (typeof row[key] === "string" && !addedCategory) ||
        key.toLowerCase() === "month" ||
        key.toLowerCase() === "year" ||
        key.toLowerCase() === "date" ||
        key.toLowerCase() === "day"
      ) {
        categories.push(row[key]);
        addedCategory = true;
      } else if (
        (typeof row[key] === "number" || !Number.isNaN(row[key])) &&
        !addedSeries
      ) {
        series.push(row[key]);
        addedSeries = true;
      }
    }
  }

  return { categories, series };
}
