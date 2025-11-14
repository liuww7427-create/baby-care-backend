import { createSchema } from "graphql-yoga";
import { buildBabyResponse } from "./responses/responseBuilder.js";
import { createBabyTips } from "./responses/guides.js";

export const schema = createSchema({
  typeDefs: `
    type ChatResponse {
      text: String!
    }

    type Tips {
      feeding: String!
      sleep: String!
      food: String!
      risk: String!
      cry: String!
    }

    type Query {
      _health: String!
      tips(ageMonths: Int!): Tips!
    }

    type Mutation {
      sendChat(text: String!, ageMonths: Int!): ChatResponse!
    }
  `,
  resolvers: {
    Query: {
      _health: () => "ok",
      tips: (_parent, { ageMonths }: { ageMonths: number }) => createBabyTips(ageMonths)
    },
    Mutation: {
      sendChat: (_parent, { text, ageMonths }: { text: string; ageMonths: number }) => ({
        text: buildBabyResponse(text, ageMonths)
      })
    }
  }
});
