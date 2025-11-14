import { createYoga } from "graphql-yoga";
import { schema } from "./schema.js";

const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const allowedOrigins = [
  ...new Set(
    [
      ...defaultOrigins,
      ...(process.env.ALLOWED_ORIGINS ?? "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    ]
  )
];

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/graphql",
  logging: true,
  cors: {
    origin: allowedOrigins,
    methods: ["POST", "GET", "OPTIONS"]
  }
});

export default {
  async fetch(request: Request) {
    return yoga.handle(request);
  }
};
