import { createYoga } from "graphql-yoga";
import { schema } from "./schema.js";

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/graphql",
  logging: true,
  cors: { origin: "*", methods: ["POST", "GET", "OPTIONS"] }
});

export default {
  async fetch(request: Request) {
    return yoga.handle(request);
  }
};
