# 🐳 dsh-bili-taskmaster · Bilibili 鲸鱼监工

在 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) 的 Web GUI 里，养一只边干活边刷 B 站的鲸鱼——你打工时它随机播视频陪着你，任务一干完，它就停下来喊你来验收。

[![npm version](https://img.shields.io/npm/v/dsh-bili-taskmaster)](https://www.npmjs.com/package/dsh-bili-taskmaster)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

![Bilibili 鲸鱼监工](assets/bili-taskmaster.png)

## 功能

- 🐳 **真正的「监工」**：跟着你的任务节奏走——`running` 时刷视频陪你打工，`idle` 时弹出 🎉 验收动画；开启「任务完成后自动暂停」，干完活它自动噤声，不打扰。
- 📺 **随手可调的小窗**：拖动标题栏随处放，右下角拖拽缩放，最小化 / 关闭一键搞定。
- 🎞️ **画质不掉队**：1080P（DASH + MediaSource）到 360P 全档位，切换一次就记住，下次不用重选。
- 💬 **弹幕不打架**：字号 / 密度滑杆随心调，暂停即冻结，滚动轨道自动避让不重叠；约每 26 秒还有 55% 概率蹦出一条橙色鲸鱼彩蛋。
- 🔐 **登录即个性化**：扫码登录，登录态安全写进 DSH 的 `credentials`，源码零硬编码密钥。
- 🔁 **播不停**：自动连播 + 10 条预载队列 + moov 快启，换片几乎无感。
- ⭐ **顺手收藏**：一键收藏到默认收藏夹；播放 / 静音 / 音量 / 进度 / 倍速，一个不少。

## 🚀 安装

```bash
dsh plugin --profile web add dsh-bili-taskmaster
```

重启 `dsh web`，刷新页面，右下角那只 🐳 就出现了。

## 📄 License

[MIT](./LICENSE)
