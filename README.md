# dsh-bili-taskmaster

DSH Web GUI 内的 B 站随机视频小窗 —— **Bilibili 鲸鱼监工**。这是一个可安装进 DeepSeek Harness (DSH) 的**静态 bundle 插件**（dual-half：Node 半 + 浏览器半）。

- 🐳 在你打工时随机播 B 站视频，任务跑完（`running → idle`）弹出 🎉 验收动画；开启「任务完成后自动暂停」会自动暂停。
- 📺 可拖拽、可缩放；弹幕（字号/密度、暂停冻结、轨道避让）；扫码登录；1080P/720P/480P/360P 多档画质；收藏；自动连播 + 预载队列。

## 目录结构

```
dsh-bili-taskmaster/
├── package.json              # bundle + client 声明
├── cordis.patch.yml          # bundle patch：向组合插入 bili-taskmaster 行
├── .dsh-plugin/
│   ├── index.mjs             # Node 半（/bili-proxy 流式代理 + /bili-api JSON RPC）
│   ├── client/
│   │   └── index.mjs         # 浏览器半源码（React + slots 浮层）
│   └── client.js             # 浏览器半产物（esbuild 生成，随插件分发）
└── scripts/
    └── build-client.mjs      # 生成 .dsh-plugin/client.js（--check 校验）
```

## 安装

本包声明了 `dsh.bundle.patch`（是 bundle），所以用 DSH 自带的插件管理即可：

```bash
# 本地路径安装（开发时）
dsh plugin --profile web add link:/绝对路径/dsh-bili-taskmaster

# 或发布到 npm 后
dsh plugin --profile web add dsh-bili-taskmaster
```

`dsh plugin add` 会把它加入 `~/.dsh/profiles/web/` 的 `dependencies`，并在 reconcile 时因为其 `dsh.bundle` 声明自动追加到 `dsh.profile.bundles`。然后重启 `dsh web`（组合变更需重启生效），刷新页面即可在右下角看到「📺 Bilibili 鲸鱼监工」。

> 手动等价步骤：把包 `link:` 进 profile 的 `node_modules`，把 `dsh-bili-taskmaster` 加进 `~/.dsh/profiles/web/package.json` 的 `dependencies` 与 `dsh.profile.bundles`，重启。

## 架构

```
浏览器 (.dsh-plugin/client.js)                Node (.dsh-plugin/index.mjs)
┌────────────────────────────┐  fetch()   ┌──────────────────────────────┐
│ 可拖拽播放器（slots 浮层）    │ ─────────▶ │ /bili-api/*  JSON RPC 分派    │
│ 弹幕渲染 / MSE 1080P       │ ◀───────── │ 登录/推荐/弹幕/收藏/画质       │
└────────────────────────────┘            │ /bili-proxy → curl 流式转发  │
        │  <video src=...>                 │  (Range / moov 快启，不落盘) │
        └────────── /bili-proxy ─────────▶└──────────────────────────────┘
```

- **Node 半**（`index.mjs`）：`ctx.get('shell' | 'credentials' | 'subprocess' | 'webServer')` 消费 DSH 服务；`ctx.on('agent/status')` 感知任务状态；`webServer.register` 注册 `/bili-api`（JSON RPC）与 `/bili-proxy`（MP4 流式代理，`subprocess` 起 curl 直转发，不落盘、带 Range 与 moov 快启缓存）。
- **浏览器半**（`client.js`）：`inject: ['slots']`，注册进 `shell.overlay`；用 `React` 构建浮层；用 `fetch('/bili-api/…')` 调 Node 半；`MediaSource` 拼 1080P DASH；弹幕走 `x/v2/dm/list/seg.so` protobuf（手写解析）。
- **登录态**：只写进 DSH 的 `credentials` 服务（`~/.dsh/.credentials.yaml`），源码不硬编码任何密钥。

## 改浏览器半

改 `.dsh-plugin/client/index.mjs`，然后重新生成产物并提交：

```bash
node scripts/build-client.mjs            # 生成 .dsh-plugin/client.js
node scripts/build-client.mjs --check    # 校验产物与生成器一致
```

## License

[MIT](./LICENSE)
