# BabyCare Backend

这是为 BabyCare 前端重新编写的一个轻量级 GraphQL 后端，模拟婴幼儿护理专家的建议。它提供：

- `sendChat` mutation：接受用户问题 (`text`) 与宝宝月龄 (`ageMonths`)，返回一段整合喂养、睡眠、辅食、风险、哭闹的建议文本。
- `_health` 查询：简单返回 `ok`，可用于探针/部署检查。
- `tips(ageMonths: Int!)` 查询：返回按月龄划分的详细建议片段（喂养、睡眠、辅食、风险、哭闹）。

## 🚀 快速开始

```bash
cd backend
npm install
npm run build
npm run dev    # 使用 tsx 本地热重载
```

## ☁️ Cloudflare Workers 部署

```bash
npm run build
wrangler publish
```

先在 `wrangler.toml` 中填入属于你的 `account_id`（占位符 `<YOUR_ACCOUNT_ID>`），然后 `wrangler publish` 会编译 `src/index.ts`（`npm run build`）并将 `dist/index.js` 发布到 Cloudflare Workers，服务仍然监听 `/graphql`。

```bash
wrangler dev
```

`wrangler dev` 会监听 8787，方便本地调试 Cloudflare Workers 版本。

服务默认暴露 `/graphql` 路径，可直接被前端使用：

```graphql
mutation SendChat($text: String!, $ageMonths: Int!) {
  sendChat(text: $text, ageMonths: $ageMonths) {
    text
  }
}
```

## ✅ 运行检查

- `GET http://localhost:8787/graphql` 打开 GraphiQL 进行交互。
- 查询：
  ```graphql
  query {
    _health
  }
  ```

## 🛠️ 可扩展点

- `src/responses/guides.ts` 控制所有阶段性建议。
- `src/responses/responseBuilder.ts` 中的关键词映射决定哪个主题会被强调。
- `process.env.PORT` 可用来在生产环境中改端口。
