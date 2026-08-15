# 关于这个 preset 脚手架

这个目录是 `dsh-bili-taskmaster` 的 **agent preset 脚手架**，不是可直接启用的成品。

## 现状

- `host.js` / `client.js` 是**动态插件**的源码（函数体形式），当前在 DSH 里以会话级方式运行，重启即失效。
- 动态插件的源码**不通过组合文件加载**，所以没法直接写进 `agent.cordis.yml` 引用它。

## 要让它永久生效，需要一次静态移植

1. **Host 半**：把 `host.js` 里的逻辑改写成一个 ESM 模块：

   ```js
   export function apply(ctx) {
     // 把 ctx.get('shell') / ctx.on(...) / harness.handle(...) 等，
     // 改写为静态插件的 API（注入 + 远程服务层）。
   }
   ```

   包的 `main` 指向该文件。

2. **Client 半**：把 `client.js` 里的 `React.createElement` UI 改写为可打包的 TS/TSX 模块，接入
   `@deepseek-ai/dsh-client-runtime` 等依赖，打包（如 `tsdown`）成 `lib/client.js`，
   并在 `package.json` 声明：

   ```json
   {
     "exports": { "./client": "./lib/client.js" },
     "dsh": { "client": { "inject": ["..."], "platform": "web" } }
   }
   ```

3. 发布 / 安装该 npm 包，然后在 `agent.cordis.yml` 里启用对应行（删掉 `disabled: true`）。

## 平面归属提示

这个插件是「跨会话的浏览器浮层 + 流式代理」，按 DSH 的 plane 规则，永久的家更接近
**host composition**（`base.cordis.yml` / `web.cordis.yml`），而非 agent preset。
不过它不发布任何 service（只消费 host 服务），所以也能以松散行存在。

详见仓库根目录的 [README](../README.md)。
