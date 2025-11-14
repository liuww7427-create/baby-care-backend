import { createYoga } from "graphql-yoga";
import { schema } from "./schema.js";
const DEFAULT_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];
const ALLOWED_METHODS = "POST,GET,OPTIONS";
const ALLOWED_HEADERS = "Content-Type, Authorization";
const yoga = createYoga({
    schema,
    graphqlEndpoint: "/graphql",
    logging: true,
    cors: false
});
const normalizeOriginList = (env) => {
    const envOrigins = env?.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? [];
    return new Set([...DEFAULT_ORIGINS, ...envOrigins]);
};
const determineAccessControlOrigin = (origin, allowedOrigins) => {
    if (!origin) {
        return "*";
    }
    if (allowedOrigins.has("*") || allowedOrigins.has(origin)) {
        return origin;
    }
    return null;
};
const attachCorsHeaders = (headers, allowOrigin) => {
    headers.set("Access-Control-Allow-Origin", allowOrigin);
    headers.set("Access-Control-Allow-Methods", ALLOWED_METHODS);
    headers.set("Access-Control-Allow-Headers", ALLOWED_HEADERS);
    headers.set("Access-Control-Allow-Credentials", "true");
};
const buildCorsResponse = (allowOrigin) => {
    const headers = new Headers();
    attachCorsHeaders(headers, allowOrigin);
    return new Response(null, {
        status: 204,
        headers
    });
};
const rebuildResponseWithCors = (response, allowOrigin) => {
    const headers = new Headers(response.headers);
    attachCorsHeaders(headers, allowOrigin);
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
    });
};
export default {
    async fetch(request, env, ctx) {
        const origin = request.headers.get("Origin");
        const allowedOrigins = normalizeOriginList(env);
        const allowOrigin = determineAccessControlOrigin(origin, allowedOrigins);
        if (!allowOrigin) {
            return new Response("CORS origin not allowed", { status: 403 });
        }
        if (request.method === "OPTIONS") {
            return buildCorsResponse(allowOrigin);
        }
        const response = await yoga.handle(request, { env, ctx });
        return rebuildResponseWithCors(response, allowOrigin);
    }
};
