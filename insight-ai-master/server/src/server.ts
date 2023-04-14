import Fastify from "fastify";
import { chatRoutes } from "./chatRoutes.js";
import cors from "@fastify/cors";
import { isMain } from "./helpers.js";

const server = Fastify({ logger: true });

server.register(cors, {
  origin: "*",
});

server.register(chatRoutes);

const start = async () => {
  const port: number = Number(process.env.PORT) || 3000;

  const host = "0.0.0.0";
  try {
    if (host == null) {
      await server.listen({ port });
    } else {
      await server.listen({ port, host });
    }
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

if (isMain(import.meta.url)) {
  (async () => {
    start();
  })();
}
