import { createSchema } from "graphql-yoga";
import { buildBabyResponse } from "./responses/responseBuilder.js";
import { createBabyTips } from "./responses/guides.js";
import { requestBabyCareAnswer } from "./services/openai.js";
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
            tips: (_parent, { ageMonths }) => createBabyTips(ageMonths)
        },
        Mutation: {
            sendChat: async (_parent, { text, ageMonths }, { env }) => {
                const cleanedQuestion = (text ?? "").trim();
                const safeAge = Math.max(0, Math.floor(ageMonths ?? 0));
                try {
                    const aiText = await requestBabyCareAnswer(cleanedQuestion, safeAge, env.OPENAI_API_KEY);
                    return { text: aiText };
                }
                catch (error) {
                    console.error("OpenAI request failed, falling back:", error);
                    return { text: buildBabyResponse(cleanedQuestion, safeAge) };
                }
            }
        }
    }
});
