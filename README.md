# dsh-bili-taskmaster

在 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 的 Web GUI 里，挂一个可拖动、可缩放的 B 站随机视频小窗 —— 让鲸鱼在你打工的时候刷视频，「完事儿了」它会停下来喊你来验收。

> 🐳 Bilibili 鲸鱼监工

它是一个 **DSH 动态 Cordis 插件**（dual-half：`host.js` + `client.js`），由两部分组成：

- **Host 半**（`host.js`）：跑在 DSH 的 Node 进程里，负责访问 B 站 API、开一个 `/bili-proxy` 流式代理、处理登录 / 弹幕 / 收藏 / 画质等，并通过 `harness.handle` 暴露 RPC 给浏览器。
- **Client 半**（`client.js`）：跑在浏览器页面里，把可拖拽播放器渲染进 `shell.overlay` 插槽，用 `host.call` 调用 Host 半。

---

## 功能

- 📺 **随机推荐流**：B 站个性化推荐（WBI 签名），未登录走匿名推荐，登录后自动个性化。
- 🔐 **扫码登录**：站内生成二维码、轮询登录态，登录信息持久化到 `~/.dsh/.credentials.yaml`（`credentials` 服务），**源码里不硬编码任何密钥**。
- 🎞️ **多档画质**：1080P（DASH + MediaSource/MSE 双 SourceBuffer 拼接）、720P / 480P / 360P（MP4 流式代理），画质选择跨视频记住。
- 🚀 **流式代理**：`/bili-proxy` 用 `subprocess` 起 curl 直接转发，**不落盘、不占临时文件**，带 Range 支持（拖动进度条）和 moov 快启缓存。
- 💬 **弹幕**：新 `x/v2/dm/list/seg.so` protobuf 接口 + 手写解析器；字号 / 密度滑杆，暂停冻结，滚动弹幕轨道避让（lane-busy 防重叠）。
- 🐳 **鲸鱼彩蛋**：约每 26 秒有 55% 概率刷一条橙色鲸鱼弹幕。
- ✅ **任务联动**：监听 `agent/status`，DSH 本轮任务结束（running→idle）时弹出 🎉 验收动画；开启「任务完成后自动暂停」会自动暂停视频。
- ⭐ **收藏**：一键收藏到默认收藏夹（`fav-video`）。
- 🔁 **自动连播**：`onEnded` 自动下一个，预载队列（10 个）+ moov 缓存。
- 🖱️ **交互**：拖动标题栏移动、右下角拖拽缩放、播放 / 静音 / 音量 / 进度 / 倍速 / 画质、账号面板、设置侧栏。

---

## 文件结构

```
dsh-bili-taskmaster/
├── host.js            # Host 半（code.host 函数体）
├── client.js          # Client 半（code.client 函数体）
├── preset/            # agent preset 脚手架（见下）
│   ├── preset.yml
│   ├── agent.cordis.yml
│   └── README.md
├── LICENSE
└── README.md
```

---

## 工作原理（架构）

```
浏览器 (client.js)                         Node (host.js)
┌────────────────────────┐  host.call()  ┌─────────────────────────────┐
│ 可拖拽播放器 UI          │ ───────────▶ │ get-status / next / login-* │
│ 弹幕渲染 / MSE 拼接     │ ◀─────────── │ get-playurl / get-dash / ... │
│ React.createElement    │   (JSON)      │                             │
└────────────────────────┘               │  curl → B 站 API            │
        │  <video src=...>               │  /bili-proxy → 流式转发     │
        └──────────── /bili-proxy ──────▶│  (Range / moov 快启)        │
                                         └─────────────────────────────┘
```

- **Host 半**通过 `ctx.get('shell' | 'web' | 'subprocess' | 'credentials' | 'webServer')` 消费 DSH 服务；通过 `ctx.on('agent/status')` 感知任务状态；通过 `harness.handle(...)` 暴露只含 JSON 的 RPC。
- **Client 半**声明 `inject: ['timer']`，用 `ctx.interval` / `ctx.timeout` 替代被沙箱屏蔽的浏览器定时器；用 `styles.insert` 注入 CSS（卸载时自动移除）；用 `React.createElement` 构建 UI（禁止 JSX / import）。
- **弹幕**走 `subprocess.spawn`（curl 二进制流）拿到 protobuf，再用纯 JS 手写 varint / utf8 解析，规避旧 XML 接口失效的问题。

---

## 安装

### 方式一：动态插件（当前可用，推荐）

动态插件是会话级的（进程重启即失效）。把 `host.js` 和 `client.js` 的内容喂给 DSH：

1. 打开 DSH Web GUI（`http://127.0.0.1:3080`）。
2. 通过插件卡片，或在支持 Cordis 插件工具的会话里执行：
   - `cordis_define`：`code.host` = `host.js` 全文，`code.client` = `client.js` 全文。
   - `cordis_run`：激活刚定义的包，按提示在 UI 里批准。
3. 页面刷新后，右下角出现「📺 Bilibili 鲸鱼监工」小窗。

> 也可以直接让一个 DSH 会话帮你定义：把 `host.js` / `client.js` 的内容粘给它，让它执行 `cordis_define` + `cordis_run`。

### 方式二：永久化（agent preset / 静态包，待办）

要让它在重启后依然存在，需要把**动态函数体**移植成**静态 npm 包**：

- Host 半 → 一个 ESM 模块，`export function apply(ctx)`，包 `main` 指向它；
- Client 半 → 打包（如 `tsdown`）成浏览器 bundle，放在 `exports["./client"]`，并在 `package.json` 里声明：

  ```json
  { "dsh": { "client": { "inject": ["..."], "platform": "web" } } }
  ```

- 在组合文件里加一行 `name: '<包名>'` 引用它。

这一步涉及几处实质改动：动态插件的 `harness.handle` / `host.call` 是一套轻量的「单包私有 RPC」，静态插件要改用 DSH 的 api-proxy / 远程服务层；Client 半还要接入 `@deepseek-ai/dsh-client-runtime` 等模块并打包。**这个移植还没做**，`preset/` 里是脚手架和说明。需要的话我可以继续完成这个移植。

> 平面归属提示：这个插件是「跨会话的浏览器浮层 + 流式代理」，按 DSH 的 plane 规则，永久的家更接近 **host composition**（`base.cordis.yml` / `web.cordis.yml`）而非 agent preset；不过它不发布任何 service（只消费），所以也能以松散行存在。

---

## 隐私与安全

- 登录态（`SESSDATA` / `bili_jct`）只写入 DSH 的 `credentials` 服务，落盘在 `~/.dsh/.credentials.yaml`，**不会写进本仓库**。
- 所有网络请求经 Host 半转发，浏览器半不直接 `fetch` B 站。
- 代理只回放 MP4 流，不做鉴权校验 —— 假设在本地回环（`127.0.0.1`）使用。若要对公网开放，请自行加访问控制。

---

## License

[MIT](./LICENSE)
