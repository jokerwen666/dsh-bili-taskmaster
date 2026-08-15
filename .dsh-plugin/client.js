window.__ModuleLoader__.load({
	id: "dsh-bili-taskmaster",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// .dsh-plugin/client/index.mjs
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(index_exports);
var import_react = __toESM(require("react"), 1);
var name = "dsh-bili-taskmaster";
var inject = ["slots"];
function injectCss(cssList) {
  var tag = document.createElement("style");
  tag.dataset.plugin = "dsh-bili-taskmaster";
  tag.textContent = Array.isArray(cssList) ? cssList.join("\n") : cssList;
  document.head.appendChild(tag);
  return function() {
    tag.remove();
  };
}
function biliCall(method, args) {
  var qs = "";
  if (args) {
    var parts = [];
    for (var k in args) {
      if (args[k] === void 0 || args[k] === null) continue;
      parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(String(args[k])));
    }
    if (parts.length) qs = "?" + parts.join("&");
  }
  return fetch("/bili-api/" + encodeURIComponent(method) + qs).then(function(res) {
    return res.json();
  });
}
function apply(ctx) {
  const slots = ctx.get("slots");
  if (slots === void 0) return;
  ctx.effect(function() {
    return injectCss([
      '.bili-win{position:fixed;z-index:100000;background:#ffffff;color:#1f2328;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,0.28);border:1px solid rgba(0,0,0,0.08);overflow:hidden;display:flex;flex-direction:column;pointer-events:auto;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif}',
      ".bili-head{display:flex;align-items:center;gap:5px;padding:8px 10px;cursor:move;user-select:none;background:linear-gradient(90deg,#fb7299,#fc9bb7);color:#fff;font-size:13px;font-weight:600;position:relative;z-index:30}",
      ".bili-title{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".bili-status{font-size:11px;font-weight:600;white-space:nowrap;background:rgba(255,255,255,0.28);border-radius:10px;padding:1px 6px}",
      ".bili-btn{border:none;background:rgba(255,255,255,0.22);color:#fff;border-radius:6px;padding:3px 7px;font-size:12px;cursor:pointer;line-height:1.4}",
      ".bili-btn:hover{background:rgba(255,255,255,0.42)}",
      ".bili-frame{width:100%;background:#000;overflow:hidden;position:relative}",
      ".bili-video{width:100%;height:100%;display:block;background:#000;object-fit:contain}",
      ".bili-dm-layer{position:absolute;inset:0;overflow:hidden;pointer-events:none}",
      ".bili-dm-layer.paused .bili-dm-item{animation-play-state:paused !important}",
      ".bili-dm-item{position:absolute;white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,0.9);font-weight:600;line-height:1.2}",
      ".bili-dm-scroll{animation:biliScroll 8s linear forwards}",
      ".bili-dm-static{left:0;right:0;text-align:center}",
      "@keyframes biliScroll{from{left:100%}to{left:-100%}}",
      ".bili-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;pointer-events:none}",
      ".bili-ctrl{display:flex;align-items:center;gap:6px;padding:6px 10px;background:#fff;border-top:1px solid #f0f0f0;flex-wrap:wrap}",
      ".bili-playbtn{width:32px;height:32px;border-radius:50%;border:none;background:#fb7299;color:#fff;font-size:12px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;line-height:1;flex:none}",
      ".bili-playbtn:hover{background:#fc85a0}",
      ".bili-mutebtn{width:26px;height:26px;border-radius:50%;border:1px solid #e4e7eb;background:#f6f8fa;color:#57606a;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex:none;padding:0}",
      ".bili-mutebtn:hover{background:#eceff2}",
      ".bili-vol{width:56px;accent-color:#fb7299;height:16px;margin:0;flex:none}",
      ".bili-seek{flex:1;min-width:48px;accent-color:#fb7299;height:18px;margin:0}",
      ".bili-time{font-size:11px;color:#8c959f;white-space:nowrap;font-variant-numeric:tabular-nums}",
      ".bili-csel{border:1px solid #fb7299;background:#fff;border-radius:14px;padding:4px 8px;font-size:12px;color:#fb7299;cursor:pointer;font-family:inherit}",
      ".bili-meta{padding:8px 10px;font-size:12px;color:#57606a;background:#fff}",
      ".bili-t{font-size:13px;color:#1f2328;font-weight:600;margin-bottom:3px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}",
      ".bili-err{padding:8px 10px;font-size:11px;color:#c0392b;background:#fdecea;line-height:1.5;word-break:break-all}",
      ".bili-panel{padding:8px 10px 10px;border-top:1px dashed rgba(0,0,0,0.08);background:#fafbfc}",
      ".bili-hint{font-size:11px;color:#8c959f;line-height:1.5;margin-top:6px}",
      ".bili-row{display:flex;gap:6px;margin-top:8px}",
      ".bili-ghost{background:#e4e7eb;color:#333}",
      ".bili-lv{font-size:11px;color:#fb7299;font-weight:600;margin-top:2px}",
      ".bili-favbtn{border:1px solid #fb7299;background:#fff;color:#fb7299;border-radius:12px;padding:2px 8px;font-size:11px;cursor:pointer;font-family:inherit}",
      ".bili-celebrate{position:absolute;inset:0;z-index:40;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.55);animation:biliFadeIn 0.3s ease}",
      ".bili-celebrate-text{font-size:17px;font-weight:700;color:#fff;background:linear-gradient(90deg,#fb7299,#fc9bb7);padding:12px 20px;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,0.4);text-align:center;animation:biliPop 0.5s ease}",
      ".bili-celebrate-confetti{font-size:22px;letter-spacing:6px;margin-bottom:8px;animation:biliConfetti 1.2s ease infinite}",
      "@keyframes biliPop{0%{transform:scale(0.6);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}",
      "@keyframes biliFadeIn{from{opacity:0}to{opacity:1}}",
      "@keyframes biliConfetti{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-6px) rotate(10deg)}}",
      ".bili-resize{position:absolute;right:0;bottom:0;width:18px;height:18px;cursor:nwse-resize;background:linear-gradient(315deg,transparent 50%,rgba(0,0,0,0.28) 50%);z-index:30}",
      ".bili-sidebar{position:absolute;top:0;right:0;bottom:0;width:250px;z-index:25;background:rgba(255,255,255,0.82);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);box-shadow:-8px 0 24px rgba(0,0,0,0.12);display:flex;flex-direction:column;color:#1f2328;transform:translateX(100%);transition:transform 0.22s ease}",
      ".bili-sidebar.open{transform:translateX(0)}",
      ".bili-shead{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid rgba(0,0,0,0.06);font-size:15px;font-weight:600}",
      ".bili-sbody{padding:14px 16px;overflow-y:auto}",
      ".bili-setrow{display:flex;align-items:center;gap:8px;font-size:13px;color:#1f2328;padding:8px 0;cursor:pointer}",
      ".bili-setgroup{font-size:11px;color:#8c959f;text-transform:uppercase;letter-spacing:0.5px;margin:10px 0 4px}",
      ".bili-slider{flex:1;accent-color:#fb7299}",
      ".bili-pill{position:fixed;z-index:100000;bottom:16px;right:16px;background:linear-gradient(90deg,#fb7299,#fc9bb7);color:#fff;border-radius:999px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,0.25);pointer-events:auto;user-select:none;display:inline-flex;align-items:center;gap:6px}"
    ].join("\n"));
  });
  let lastTurn = 0;
  let dragState = null;
  let resizeState = null;
  let prevAgentStatus = null;
  let autoPauseEnabled = false;
  let currentBvid = "";
  let videoEl = null;
  let dmShown = 0;
  let dmId = 0;
  let laneBusyUntil = [];
  let currentVolume = 1;
  let currentMuted = false;
  let mediaSource = null;
  let setActiveDmRef = null;
  let whaleCount = 0;
  const WHALE_PHRASES = [
    "\u{1F433} \u8001\u5927\uFF0C\u7B2C {n} \u4E2A\u89C6\u9891\u4E86\u54E6\uFF1F",
    "\u{1F433} \u9CB8\u9C7C\u57CB\u5934\u82E6\u5E72\u4E2D\uFF0C\u8001\u5927\u770B\u5F97\u633A\u5F00\u5FC3\u561B",
    "\u{1F433} \u8FD9\u4E2A\u89C6\u9891\u4E0D\u9519\uFF0C\u9CB8\u9C7C\u4E5F\u60F3\u6478\u9C7C\u4E86\u2026",
    "\u{1F433} \u76D1\u5DE5\u76D1\u5DE5\uFF0C\u5149\u76D1\u4E0D\u5DE5\u53EF\u4E0D\u884C",
    "\u{1F433} \u5E72\u5B8C\u558A\u6211\uFF0C\u6211\u5148\u966A\u4F60\u5237\u4F1A\u513F",
    "\u{1F433} \u9CB8\u9C7C\u63D0\u9192\uFF1A\u8FDB\u5EA6\u6761\u5DF2\u7ECF\u51FA\u5356\u4F60\u4E86",
    "\u{1F433} \u8001\u5927\uFF0C\u9A8C\u6536\u5355\u6512\u4E86\u4E00\u5806\u5566"
  ];
  function whalePhrase() {
    const p = WHALE_PHRASES[Math.floor(Math.random() * WHALE_PHRASES.length)];
    return p.replace("{n}", String(whaleCount));
  }
  function spawnWhaleDmImpl() {
    if (!videoEl || videoEl.paused) return;
    const id = dmId;
    dmId += 1;
    const item = { id, text: whalePhrase(), color: 16757575, size: 26, mode: 1, lane: Math.floor(Math.random() * 5) };
    if (setActiveDmRef) setActiveDmRef(function(prev) {
      return prev.concat([item]);
    });
    setTimeout(function() {
      if (setActiveDmRef) setActiveDmRef(function(prev) {
        return prev.filter(function(x) {
          return x.id !== id;
        });
      });
    }, 8e3);
  }
  const QUALITY_OPTIONS = [
    { qn: 80, desc: "1080P \u9AD8\u6E05" },
    { qn: 64, desc: "720P \u9AD8\u6E05" },
    { qn: 32, desc: "480P \u6E05\u6670" },
    { qn: 16, desc: "360P \u6D41\u7545" }
  ];
  function qualityName(qn) {
    const map = { 120: "4K", 116: "1080P 60\u5E27", 112: "1080P \u9AD8\u7801\u7387", 80: "1080P", 74: "720P 60\u5E27", 64: "720P", 32: "480P", 16: "360P" };
    return map[qn] || "\u6E05\u6670\u5EA6 " + qn;
  }
  function fmtView(n) {
    if (!n) return "";
    if (n >= 1e8) return (n / 1e8).toFixed(1) + "\u4EBF";
    if (n >= 1e4) return (n / 1e4).toFixed(1) + "\u4E07";
    return String(n);
  }
  function fmtTime(s) {
    if (!isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ":" + (sec < 10 ? "0" + sec : sec);
  }
  function colorToCss(n) {
    const r = n >> 16 & 255;
    const g = n >> 8 & 255;
    const b = n & 255;
    return "rgb(" + r + "," + g + "," + b + ")";
  }
  function dmFontSize(sz, scale) {
    const px = Math.round((sz || 25) * scale);
    if (px < 9) return 9;
    if (px > 44) return 44;
    return px;
  }
  function tvIcon(excited) {
    return import_react.default.createElement(
      "svg",
      { viewBox: "0 0 24 24", width: 16, height: 16, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
      import_react.default.createElement("path", { d: "M8 2.5l4 4 4-4" }),
      import_react.default.createElement("rect", { x: 3, y: 7, width: 18, height: 14, rx: 2 }),
      import_react.default.createElement("circle", { cx: 9, cy: 13, r: 0.6, fill: "currentColor" }),
      import_react.default.createElement("circle", { cx: 15, cy: 13, r: 0.6, fill: "currentColor" }),
      import_react.default.createElement("path", { d: excited ? "M9.5 16 Q12 18.5 14.5 16" : "M10.5 16 Q12 17 13.5 16" }),
      excited ? import_react.default.createElement("path", { d: "M21 2v3.5M19.25 3.75h3.5", strokeWidth: 1.6 }) : null
    );
  }
  function speakerIcon(muted) {
    return import_react.default.createElement(
      "svg",
      { viewBox: "0 0 24 24", width: 14, height: 14, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" },
      import_react.default.createElement("path", { d: "M11 5L6 9H2v6h4l5 4V5z", fill: "currentColor", stroke: "none" }),
      muted ? import_react.default.createElement("path", { d: "M22 9l-6 6M16 9l6 6" }) : import_react.default.createElement("path", { d: "M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12" })
    );
  }
  function proxyUrl(u, sz) {
    return "/bili-proxy?url=" + encodeURIComponent(u) + (sz ? "&size=" + sz : "");
  }
  function proxyMseUrl(u) {
    return "/bili-proxy?url=" + encodeURIComponent(u) + "&mse=1";
  }
  function xhrChunk(url, start, end) {
    return new Promise(function(resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer";
      xhr.setRequestHeader("Range", "bytes=" + start + "-" + end);
      xhr.onload = function() {
        if (xhr.status === 206 || xhr.status === 200) resolve(xhr.response);
        else reject(new Error("HTTP " + xhr.status));
      };
      xhr.onerror = function() {
        reject(new Error("\u7F51\u7EDC\u9519\u8BEF"));
      };
      xhr.send();
    });
  }
  function appendBuf(sb, buf) {
    return new Promise(function(resolve, reject) {
      function onEnd() {
        sb.removeEventListener("updateend", onEnd);
        sb.removeEventListener("error", onErr);
        resolve();
      }
      function onErr() {
        sb.removeEventListener("updateend", onEnd);
        sb.removeEventListener("error", onErr);
        reject(new Error("append error"));
      }
      sb.addEventListener("updateend", onEnd);
      sb.addEventListener("error", onErr);
      try {
        sb.appendBuffer(buf);
      } catch (e) {
        reject(e);
      }
    });
  }
  function sleep(ms) {
    return new Promise(function(resolve) {
      setTimeout(resolve, ms);
    });
  }
  function removeRange(sb, start, end) {
    return new Promise(function(resolve) {
      function onEnd() {
        sb.removeEventListener("updateend", onEnd);
        resolve();
      }
      sb.addEventListener("updateend", onEnd);
      try {
        sb.remove(start, end);
      } catch (e) {
        resolve();
      }
    });
  }
  async function streamM4s(url, sb, isVideo) {
    const CH = 2 * 1024 * 1024;
    let offset = 0;
    let first = true;
    while (true) {
      try {
        if (videoEl && sb.buffered && sb.buffered.length > 0) {
          const current = videoEl.currentTime || 0;
          const start = sb.buffered.start(0);
          const bufferedEnd = sb.buffered.end(sb.buffered.length - 1);
          const evictEnd = current - 60;
          if (evictEnd > start + 5) {
            await removeRange(sb, start, evictEnd);
          }
          if (bufferedEnd - current > 60) {
            await sleep(1e3);
            continue;
          }
        }
      } catch (e) {
      }
      const buf = await xhrChunk(url, offset, offset + CH - 1);
      if (!buf || buf.byteLength === 0) break;
      await appendBuf(sb, buf);
      offset += buf.byteLength;
      if (first && isVideo && videoEl) {
        first = false;
        try {
          videoEl.play();
        } catch (e) {
        }
      }
      if (buf.byteLength < CH) break;
    }
  }
  function BiliPlayer() {
    const m = import_react.default.useState("open");
    const mode = m[0];
    const setMode = m[1];
    const vs = import_react.default.useState(null);
    const video = vs[0];
    const setVideo = vs[1];
    const ps = import_react.default.useState(null);
    const pos = ps[0];
    const setPos = ps[1];
    const so = import_react.default.useState(false);
    const settingsOpen = so[0];
    const setSettingsOpen = so[1];
    const ao = import_react.default.useState(false);
    const accountOpen = ao[0];
    const setAccountOpen = ao[1];
    const ld = import_react.default.useState(false);
    const loading = ld[0];
    const setLoading = ld[1];
    const er = import_react.default.useState("");
    const error = er[0];
    const setError = er[1];
    const ac = import_react.default.useState(null);
    const account = ac[0];
    const setAccount = ac[1];
    const lo = import_react.default.useState(false);
    const loginOpen = lo[0];
    const setLoginOpen = lo[1];
    const qr = import_react.default.useState(null);
    const qrData = qr[0];
    const setQrData = qr[1];
    const lm = import_react.default.useState("");
    const loginMsg = lm[0];
    const setLoginMsg = lm[1];
    const pl = import_react.default.useState(false);
    const polling = pl[0];
    const setPolling = pl[1];
    const sz = import_react.default.useState(340);
    const width = sz[0];
    const setWidth = sz[1];
    const ap = import_react.default.useState(false);
    const autoPause = ap[0];
    const setAutoPause = ap[1];
    const sp = import_react.default.useState(true);
    const showPill = sp[0];
    const setShowPill = sp[1];
    const fs = import_react.default.useState(1);
    const dmFontScale = fs[0];
    const setDmFontScale = fs[1];
    const dd = import_react.default.useState(1);
    const dmDensity = dd[0];
    const setDmDensity = dd[1];
    const ag = import_react.default.useState("idle");
    const agentStatus = ag[0];
    const setAgentStatus = ag[1];
    const fv = import_react.default.useState(false);
    const faved = fv[0];
    const setFaved = fv[1];
    const ce = import_react.default.useState(false);
    const celebrate = ce[0];
    const setCelebrate = ce[1];
    const vo = import_react.default.useState(1);
    const volume = vo[0];
    const setVolume = vo[1];
    const mu = import_react.default.useState(false);
    const muted = mu[0];
    const setMuted = mu[1];
    const pu = import_react.default.useState(null);
    const playurl = pu[0];
    const setPlayurl = pu[1];
    const mu2 = import_react.default.useState("");
    const mseUrl = mu2[0];
    const setMseUrl = mu2[1];
    const dm = import_react.default.useState([]);
    const danmaku = dm[0];
    const setDanmaku = dm[1];
    const ad = import_react.default.useState([]);
    const activeDm = ad[0];
    const setActiveDm = ad[1];
    const ip = import_react.default.useState(false);
    const isPlaying = ip[0];
    const setIsPlaying = ip[1];
    const bf = import_react.default.useState(false);
    const buffering = bf[0];
    const setBuffering = bf[1];
    const ct = import_react.default.useState(0);
    const currentTime = ct[0];
    const setCurrentTime = ct[1];
    const du = import_react.default.useState(0);
    const duration = du[0];
    const setDuration = du[1];
    const sp2 = import_react.default.useState(1);
    const speed = sp2[0];
    const setSpeed = sp2[1];
    const qn = import_react.default.useState(0);
    const qnState = qn[0];
    const setQn = qn[1];
    setActiveDmRef = setActiveDm;
    function syncAccount(s) {
      if (!s) return;
      setAccount(function(prev) {
        const next2 = s.account;
        if (!next2) return prev ? null : prev;
        if (prev && prev.nickname === next2.nickname && prev.avatar === next2.avatar && prev.level === next2.level) return prev;
        return next2;
      });
    }
    function cleanupMSE() {
      if (mediaSource) {
        try {
          if (mediaSource.readyState === "open") {
            const sbs = mediaSource.sourceBuffers;
            for (let i = sbs.length - 1; i >= 0; i--) {
              try {
                mediaSource.removeSourceBuffer(sbs[i]);
              } catch (e) {
              }
            }
            mediaSource.endOfStream();
          }
        } catch (e) {
        }
        mediaSource = null;
      }
      if (mseUrl) {
        try {
          URL.revokeObjectURL(mseUrl);
        } catch (e) {
        }
        setMseUrl("");
      }
    }
    function applyQuality(v, q) {
      if (!v) return;
      if (q === 80) {
        setBuffering(true);
        if (v.dash && v.dash.videoUrl) {
          startMSE(v.dash);
        } else {
          biliCall("get-dash", { bvid: v.bvid, cid: v.cid }).then(function(d) {
            if (d && d.videoUrl) {
              if (v.bvid === currentBvid) startMSE(d);
            }
          }).catch(function() {
          });
        }
      } else if (q > 0) {
        biliCall("get-playurl", { bvid: v.bvid, cid: v.cid, qn: q }).then(function(r) {
          if (r && r.url && v.bvid === currentBvid) setPlayurl(r);
        }).catch(function() {
        });
      }
    }
    function noteVideo(v) {
      if (v && v.bvid && v.bvid !== currentBvid) {
        currentBvid = v.bvid;
        whaleCount += 1;
        cleanupMSE();
        setPlayurl(v.playurl || null);
        setDanmaku([]);
        setActiveDm([]);
        dmShown = 0;
        laneBusyUntil = [];
        setBuffering(false);
        setCurrentTime(0);
        setDuration(0);
        setFaved(false);
      }
      setVideo(v);
      if (v && v.bvid) applyQuality(v, qn);
    }
    async function getStatus() {
      try {
        return await biliCall("get-status", {});
      } catch (e) {
        return null;
      }
    }
    async function next() {
      setLoading(true);
      setError("");
      try {
        const r = await biliCall("next", {});
        if (r && r.video && r.video.bvid) {
          noteVideo(r.video);
          lastTurn = r.turn || 0;
          setMode("open");
        } else if (r && r.error) {
          setError(r.error);
        }
        syncAccount(r);
      } catch (e) {
        console.error("[bili] next failed:", e);
        setError("RPC \u8C03\u7528\u5931\u8D25");
      }
      setLoading(false);
    }
    async function loadDanmaku(v) {
      const bvid = v.bvid;
      const d = await biliCall("get-danmaku", { cid: v.cid });
      if (bvid !== currentBvid) return;
      if (d && Array.isArray(d)) {
        d.sort(function(a, b) {
          return a.time - b.time;
        });
        setDanmaku(d);
        dmShown = 0;
      }
    }
    import_react.default.useEffect(function() {
      if (!video || !video.bvid || !video.cid) return;
      loadDanmaku(video);
    }, [video ? video.bvid : null]);
    function videoSrc() {
      if (mseUrl) return mseUrl;
      return playurl && playurl.url ? proxyUrl(playurl.url, playurl.size) : "";
    }
    import_react.default.useEffect(function() {
      if (videoEl && videoSrc()) {
        videoEl.volume = currentVolume;
        videoEl.muted = currentMuted;
        try {
          const p = videoEl.play();
          if (p && typeof p.catch === "function") p.catch(function() {
          });
        } catch (e) {
        }
      }
    }, [playurl ? playurl.url : null, mseUrl]);
    function startMSE(dash) {
      if (typeof MediaSource === "undefined") {
        setError("\u6D4F\u89C8\u5668\u4E0D\u652F\u6301 MSE");
        setBuffering(false);
        return;
      }
      cleanupMSE();
      let ms = null;
      let sbAdded = false;
      try {
        ms = new MediaSource();
        mediaSource = ms;
        const blobUrl = URL.createObjectURL(ms);
        ms.addEventListener("sourceopen", function() {
          if (ms.readyState !== "open") return;
          if (sbAdded) return;
          sbAdded = true;
          let vsb = null;
          let asb = null;
          try {
            vsb = ms.addSourceBuffer('video/mp4; codecs="' + dash.videoCodecs + '"');
            asb = ms.addSourceBuffer('audio/mp4; codecs="' + dash.audioCodecs + '"');
          } catch (e) {
            setError("MSE \u521D\u59CB\u5316\u5931\u8D25: " + (e.message || e));
            setBuffering(false);
            return;
          }
          let vDone = false;
          let aDone = false;
          function maybeEnd() {
            if (vDone && aDone) {
              try {
                if (ms.readyState === "open") ms.endOfStream();
              } catch (e) {
              }
            }
          }
          streamM4s(proxyMseUrl(dash.videoUrl), vsb, true).then(function() {
            vDone = true;
            maybeEnd();
          }).catch(function(e) {
            if (mediaSource !== ms) return;
            setError("\u89C6\u9891\u6D41\u52A0\u8F7D\u5931\u8D25: " + (e && e.message ? e.message : e));
            setBuffering(false);
          });
          streamM4s(proxyMseUrl(dash.audioUrl), asb, false).then(function() {
            aDone = true;
            maybeEnd();
          }).catch(function(e) {
            if (mediaSource !== ms) return;
            setError("\u97F3\u9891\u6D41\u52A0\u8F7D\u5931\u8D25: " + (e && e.message ? e.message : e));
            setBuffering(false);
          });
        });
        setMseUrl(blobUrl);
      } catch (e) {
        setError("MSE \u521B\u5EFA\u5931\u8D25: " + (e.message || e));
        setBuffering(false);
      }
    }
    async function favVideo() {
      if (!video || !video.aid) {
        setError("\u89C6\u9891\u4FE1\u606F\u4E0D\u5B8C\u6574");
        return;
      }
      const r = await biliCall("fav-video", { aid: video.aid });
      if (r && r.ok) {
        setFaved(true);
        setError("");
      } else {
        setError(r && r.error ? r.error : "\u6536\u85CF\u5931\u8D25");
      }
    }
    async function refresh(manual) {
      const s = await getStatus();
      if (!s) return;
      const changed = (s.turn || 0) > lastTurn;
      if ((s.turn || 0) > lastTurn) lastTurn = s.turn || 0;
      if (s.video && s.video.bvid) {
        if (s.video.bvid !== currentBvid) {
          currentBvid = s.video.bvid;
          whaleCount += 1;
          cleanupMSE();
          setPlayurl(s.video.playurl || null);
          setDanmaku([]);
          setActiveDm([]);
          dmShown = 0;
          laneBusyUntil = [];
          setFaved(false);
          setVideo(s.video);
          applyQuality(s.video, qn);
        }
      }
      if (s.error) setError(s.error);
      syncAccount(s);
      setAgentStatus(s.agentStatus || "idle");
      if (typeof s.dmFont === "number" && Math.abs(s.dmFont - dmFontScale) > 1e-3) {
        setDmFontScale(s.dmFont);
      }
      if (typeof s.dmDensity === "number" && Math.abs(s.dmDensity - dmDensity) > 1e-3) {
        setDmDensity(s.dmDensity);
      }
      if (typeof s.autoPause === "boolean" && s.autoPause !== autoPause) {
        autoPauseEnabled = s.autoPause;
        setAutoPause(s.autoPause);
      }
      if (typeof s.showPill === "boolean" && s.showPill !== showPill) {
        setShowPill(s.showPill);
      }
      if (s.agentStatus === "idle" && prevAgentStatus === "running") {
        setCelebrate(true);
        setTimeout(function() {
          setCelebrate(false);
        }, 5e3);
        if (autoPauseEnabled) {
          if (videoEl) {
            try {
              videoEl.pause();
            } catch (e) {
            }
          }
        }
      }
      prevAgentStatus = s.agentStatus;
      if (manual || changed && s.video && s.video.bvid) setMode("open");
    }
    async function startLogin() {
      setLoginOpen(true);
      setLoginMsg("\u6B63\u5728\u751F\u6210\u4E8C\u7EF4\u7801\u2026");
      setQrData(null);
      try {
        const r = await biliCall("login-start", {});
        if (r && r.qrcode_url) {
          setQrData({ url: r.qrcode_url });
          setLoginMsg("\u8BF7\u7528 B \u7AD9 App \u626B\u7801");
          setPolling(true);
        } else {
          setLoginMsg("\u751F\u6210\u4E8C\u7EF4\u7801\u5931\u8D25\uFF1A" + (r && r.error ? r.error : "\u672A\u77E5\u9519\u8BEF"));
        }
      } catch (e) {
        setLoginMsg("\u767B\u5F55\u8BF7\u6C42\u5931\u8D25");
      }
    }
    function logout() {
      biliCall("logout", {}).then(function(r) {
        if (r && r.video && r.video.bvid) {
          noteVideo(r.video);
        }
      }).catch(function() {
      });
      setAccount(null);
      setLoginOpen(false);
      setPolling(false);
      setQrData(null);
      setLoginMsg("");
    }
    function togglePlay() {
      if (!videoEl) return;
      if (videoEl.paused) {
        try {
          videoEl.play();
        } catch (e) {
        }
      } else {
        try {
          videoEl.pause();
        } catch (e) {
        }
      }
    }
    function toggleMute() {
      currentMuted = !currentMuted;
      setMuted(currentMuted);
      if (videoEl) {
        videoEl.muted = currentMuted;
      }
    }
    function onVolume(e) {
      const v = Number(e.target.value);
      currentVolume = v;
      setVolume(v);
      if (v > 0 && currentMuted) {
        currentMuted = false;
        setMuted(false);
      }
      if (videoEl) {
        videoEl.volume = v;
        videoEl.muted = currentMuted;
      }
    }
    function onSpeed(e) {
      const v = Number(e.target.value);
      setSpeed(v);
      if (videoEl) {
        try {
          videoEl.playbackRate = v;
        } catch (e2) {
        }
      }
    }
    function onQuality(e) {
      const q = Number(e.target.value);
      setQn(q);
      if (!video) return;
      if (q === 80) {
        setBuffering(true);
        if (video.dash && video.dash.videoUrl) {
          startMSE(video.dash);
        } else {
          biliCall("get-dash", { bvid: video.bvid, cid: video.cid }).then(function(d) {
            if (d && d.videoUrl) {
              if (video.bvid === currentBvid) startMSE(d);
            } else {
              setError(d && d.error ? d.error : "\u8BE5\u89C6\u9891\u65E0 1080P");
              setBuffering(false);
            }
          }).catch(function() {
            setError("\u83B7\u53D6 1080P \u5931\u8D25");
            setBuffering(false);
          });
        }
      } else {
        cleanupMSE();
        if (q === 0 && video.playurl) {
          setPlayurl(video.playurl);
        } else {
          biliCall("get-playurl", { bvid: video.bvid, cid: video.cid, qn: q }).then(function(r) {
            if (r && r.url && video.bvid === currentBvid) setPlayurl(r);
          }).catch(function() {
          });
        }
      }
    }
    function onSeek(e) {
      const t = Number(e.target.value);
      setCurrentTime(t);
      if (videoEl) {
        try {
          videoEl.currentTime = t;
        } catch (err) {
        }
      }
    }
    function onDmFont(e) {
      const v = Number(e.target.value);
      setDmFontScale(v);
      biliCall("set-dmfont", { value: v }).catch(function() {
      });
    }
    function onDmDensity(e) {
      const v = Number(e.target.value);
      setDmDensity(v);
      biliCall("set-dmdensity", { value: v }).catch(function() {
      });
    }
    function onAutoPause(e) {
      const v = e.target.checked;
      autoPauseEnabled = v;
      setAutoPause(v);
      biliCall("set-autopause", { value: v }).catch(function() {
      });
    }
    function onShowPill(e) {
      const v = e.target.checked;
      setShowPill(v);
      biliCall("set-showpill", { value: v }).catch(function() {
      });
    }
    function spawnDm(item) {
      const id = dmId;
      dmId += 1;
      if (item.mode === 1) {
        const laneCount = Math.max(1, Math.round(6 * dmDensity));
        const now = Date.now();
        let lane = -1;
        for (let i = 0; i < laneCount; i++) {
          if ((laneBusyUntil[i] || 0) <= now) {
            lane = i;
            break;
          }
        }
        if (lane < 0) return;
        const busyMs = Math.round(4500 / dmDensity);
        laneBusyUntil[lane] = now + busyMs;
        setActiveDm(function(prev) {
          return prev.concat([{ id, text: item.text, color: item.color, size: item.size, mode: 1, lane }]);
        });
        setTimeout(function() {
          setActiveDm(function(prev) {
            return prev.filter(function(x) {
              return x.id !== id;
            });
          });
        }, 8e3);
      } else {
        setActiveDm(function(prev) {
          return prev.concat([{ id, text: item.text, color: item.color, size: item.size, mode: item.mode, lane: -1 }]);
        });
        setTimeout(function() {
          setActiveDm(function(prev) {
            return prev.filter(function(x) {
              return x.id !== id;
            });
          });
        }, 4500);
      }
    }
    function onTimeUpdate() {
      if (!videoEl) return;
      setCurrentTime(videoEl.currentTime);
      if (!danmaku.length) return;
      const t = videoEl.currentTime;
      while (dmShown < danmaku.length && danmaku[dmShown].time <= t) {
        spawnDm(danmaku[dmShown]);
        dmShown += 1;
      }
    }
    import_react.default.useEffect(function() {
      async function init() {
        const s = await getStatus();
        if (s) {
          syncAccount(s);
          prevAgentStatus = s.agentStatus;
          setAgentStatus(s.agentStatus || "idle");
          if (typeof s.dmFont === "number") setDmFontScale(s.dmFont);
          if (typeof s.dmDensity === "number") setDmDensity(s.dmDensity);
          if (typeof s.autoPause === "boolean") {
            autoPauseEnabled = s.autoPause;
            setAutoPause(s.autoPause);
          }
          if (typeof s.showPill === "boolean") setShowPill(s.showPill);
        }
        if (s && s.video && s.video.bvid) {
          currentBvid = s.video.bvid;
          setPlayurl(s.video.playurl || null);
          setVideo(s.video);
          lastTurn = s.turn || 0;
          setMode("open");
        } else {
          await next();
        }
      }
      init();
      const iv = setInterval(function() {
        refresh(false);
      }, 1500);
      return function() {
        clearInterval(iv);
      };
    }, []);
    import_react.default.useEffect(function() {
      const iv = setInterval(function() {
        if (Math.random() < 0.55) spawnWhaleDmImpl();
      }, 26e3);
      return function() {
        clearInterval(iv);
      };
    }, []);
    import_react.default.useEffect(function() {
      if (!polling) return;
      let stop = false;
      async function tick() {
        if (stop) return;
        let r = null;
        try {
          r = await biliCall("login-poll", {});
        } catch (e) {
          return;
        }
        if (stop) return;
        if (r.status === "success") {
          if (r.account) {
            setAccount(r.account);
            setLoginOpen(false);
          }
          setLoginMsg("\u5DF2\u767B\u5F55");
          setPolling(false);
          next();
        } else if (r.status === "error") {
          setLoginMsg((r.message || "\u767B\u5F55\u5931\u8D25") + (r.detail ? " [" + r.detail + "]" : ""));
          setPolling(false);
          setQrData(null);
        } else if (r.status === "expired") {
          setLoginMsg("\u4E8C\u7EF4\u7801\u5DF2\u8FC7\u671F\uFF0C\u70B9\u300C\u91CD\u65B0\u751F\u6210\u300D\u91CD\u8BD5");
          setPolling(false);
          setQrData(null);
        } else if (r.status === "scanned") {
          setLoginMsg("\u5DF2\u626B\u7801\uFF0C\u8BF7\u5728\u624B\u673A\u4E0A\u786E\u8BA4");
        } else {
          setLoginMsg("\u8BF7\u7528 B \u7AD9 App \u626B\u7801");
        }
      }
      tick();
      const iv = setInterval(tick, 2e3);
      return function() {
        stop = true;
        clearInterval(iv);
      };
    }, [polling]);
    function onHeadDown(e) {
      const t = e.target;
      if (t && typeof t.closest === "function" && t.closest("button")) return;
      const win = e.currentTarget.parentNode;
      const rect = win.getBoundingClientRect();
      dragState = { sx: e.clientX, sy: e.clientY, left: rect.left, top: rect.top };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {
      }
    }
    function onHeadMove(e) {
      if (!dragState) return;
      const dx = e.clientX - dragState.sx;
      const dy = e.clientY - dragState.sy;
      setPos({ left: dragState.left + dx, top: dragState.top + dy });
    }
    function onHeadUp() {
      dragState = null;
    }
    function onResizeDown(e) {
      resizeState = { startX: e.clientX, startW: width };
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {
      }
    }
    function onResizeMove(e) {
      if (!resizeState) return;
      const dx = e.clientX - resizeState.startX;
      let w = resizeState.startW + dx;
      const maxW = Math.min(960, (window.innerWidth || 1200) - 32);
      if (w < 200) w = 200;
      if (w > maxW) w = maxW;
      setWidth(w);
    }
    function onResizeUp() {
      resizeState = null;
    }
    function renderAccountPanel() {
      if (account) {
        return import_react.default.createElement(
          "div",
          null,
          import_react.default.createElement(
            "div",
            { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 2 } },
            import_react.default.createElement("img", { src: account.avatar, referrerPolicy: "no-referrer", style: { width: 34, height: 34, borderRadius: "50%", background: "#f0f0f0", objectFit: "cover" }, onError: function(e) {
              e.currentTarget.style.display = "none";
            } }),
            import_react.default.createElement(
              "div",
              { style: { flex: 1, minWidth: 0 } },
              import_react.default.createElement("div", { style: { fontSize: 13, fontWeight: 600, color: "#1f2328", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, account.nickname),
              import_react.default.createElement("div", { className: "bili-lv" }, "Lv." + (account.level || 0))
            ),
            import_react.default.createElement("button", { className: "bili-btn bili-ghost", onClick: logout }, "\u9000\u51FA\u767B\u5F55")
          ),
          import_react.default.createElement("div", { className: "bili-hint" }, "\u5DF2\u767B\u5F55\uFF1A\u63A8\u8350\u6D41\u5DF2\u4E2A\u6027\u5316\u3002")
        );
      }
      if (loginOpen) {
        const qrSrc = qrData ? "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" + encodeURIComponent(qrData.url) : "";
        return import_react.default.createElement(
          "div",
          null,
          qrData ? import_react.default.createElement("img", { src: qrSrc, alt: "\u767B\u5F55\u4E8C\u7EF4\u7801", style: { width: 180, height: 180, display: "block", margin: "8px auto", borderRadius: 8, background: "#fff" } }) : null,
          import_react.default.createElement("div", { className: "bili-hint", style: { textAlign: "center" } }, loginMsg || "\u751F\u6210\u4E2D\u2026"),
          import_react.default.createElement(
            "div",
            { className: "bili-row", style: { justifyContent: "center" } },
            import_react.default.createElement("button", { className: "bili-btn", style: { background: "#fb7299", color: "#fff" }, onClick: startLogin }, "\u91CD\u65B0\u751F\u6210"),
            import_react.default.createElement("button", { className: "bili-btn bili-ghost", onClick: function() {
              setLoginOpen(false);
              setPolling(false);
            } }, "\u6536\u8D77")
          )
        );
      }
      return import_react.default.createElement(
        "div",
        null,
        import_react.default.createElement("div", { className: "bili-hint" }, "\u767B\u5F55 B \u7AD9\u8D26\u53F7\u540E\uFF0C\u968F\u673A\u63A8\u8350\u4F1A\u81EA\u52A8\u4E2A\u6027\u5316\u3002"),
        import_react.default.createElement(
          "div",
          { className: "bili-row" },
          import_react.default.createElement("button", { className: "bili-btn", style: { background: "#fb7299", color: "#fff" }, onClick: startLogin }, "\u626B\u7801\u767B\u5F55")
        )
      );
    }
    function renderSidebar() {
      return import_react.default.createElement(
        "div",
        { className: "bili-sidebar" + (settingsOpen ? " open" : "") },
        import_react.default.createElement(
          "div",
          { className: "bili-shead" },
          import_react.default.createElement("span", null, "\u8BBE\u7F6E"),
          import_react.default.createElement("button", { className: "bili-btn bili-ghost", onClick: function() {
            setSettingsOpen(false);
          } }, "\u2715")
        ),
        import_react.default.createElement(
          "div",
          { className: "bili-sbody" },
          import_react.default.createElement("div", { className: "bili-setgroup" }, "\u64AD\u653E"),
          import_react.default.createElement(
            "label",
            { className: "bili-setrow" },
            import_react.default.createElement("input", { type: "checkbox", checked: autoPause, onChange: onAutoPause }),
            import_react.default.createElement("span", null, "\u4EFB\u52A1\u5B8C\u6210\u540E\u81EA\u52A8\u6682\u505C")
          ),
          import_react.default.createElement("div", { className: "bili-hint" }, "\u5F00\u542F\u540E\uFF0C\u5F53 DSH \u672C\u8F6E\u4EFB\u52A1\u6267\u884C\u5B8C\u6BD5\uFF08\u72B6\u6001\u56DE\u5230\u7A7A\u95F2\uFF09\u65F6\uFF0C\u4F1A\u81EA\u52A8\u6682\u505C\u89C6\u9891\u3002"),
          import_react.default.createElement("div", { className: "bili-setgroup" }, "\u60AC\u6D6E"),
          import_react.default.createElement(
            "label",
            { className: "bili-setrow" },
            import_react.default.createElement("input", { type: "checkbox", checked: showPill, onChange: onShowPill }),
            import_react.default.createElement("span", null, "\u663E\u793A\u53F3\u4E0B\u89D2\u7F29\u7565\u56FE\u6807")
          ),
          import_react.default.createElement("div", { className: "bili-hint" }, "\u5173\u95ED\u540E\uFF0C\u6700\u5C0F\u5316 / \u5173\u95ED\u64AD\u653E\u5668\u65F6\u4E0D\u518D\u663E\u793A\u53F3\u4E0B\u89D2\u7684\u7F29\u7565\u56FE\u6807\u3002"),
          import_react.default.createElement("div", { className: "bili-setgroup" }, "\u5F39\u5E55"),
          import_react.default.createElement(
            "div",
            { className: "bili-setrow", style: { flexDirection: "column", alignItems: "stretch", cursor: "default" } },
            import_react.default.createElement(
              "div",
              { style: { display: "flex", justifyContent: "space-between" } },
              import_react.default.createElement("span", null, "\u5F39\u5E55\u5B57\u53F7"),
              import_react.default.createElement("span", { style: { color: "#fb7299" } }, Math.round(dmFontScale * 100) + "%")
            ),
            import_react.default.createElement("input", { className: "bili-slider", type: "range", min: 0.5, max: 2, step: 0.1, value: dmFontScale, onChange: onDmFont })
          ),
          import_react.default.createElement(
            "div",
            { className: "bili-setrow", style: { flexDirection: "column", alignItems: "stretch", cursor: "default" } },
            import_react.default.createElement(
              "div",
              { style: { display: "flex", justifyContent: "space-between" } },
              import_react.default.createElement("span", null, "\u5F39\u5E55\u5BC6\u5EA6"),
              import_react.default.createElement("span", { style: { color: "#fb7299" } }, Math.round(dmDensity * 100) + "%")
            ),
            import_react.default.createElement("input", { className: "bili-slider", type: "range", min: 0.3, max: 1, step: 0.1, value: dmDensity, onChange: onDmDensity })
          )
        )
      );
    }
    function renderWindow() {
      const wstyle = Object.assign({ width: width + "px" }, pos ? { left: pos.left + "px", top: pos.top + "px" } : { right: "16px", bottom: "16px" });
      const frameH = Math.round(width * 9 / 16);
      const baseScale = Math.max(0.42, Math.min(1.3, width / 500));
      const dmScale = baseScale * dmFontScale;
      const laneH = Math.round(26 * dmScale);
      const autoLabel = video && video.playurl && typeof video.playurl.quality === "number" ? "\u81EA\u52A8\uFF08" + qualityName(video.playurl.quality) + "\uFF09" : "\u81EA\u52A8";
      const media = video ? import_react.default.createElement(
        "div",
        { className: "bili-frame", style: { height: frameH + "px" } },
        import_react.default.createElement("video", {
          key: video.bvid,
          ref: function(el) {
            videoEl = el;
          },
          className: "bili-video",
          src: videoSrc(),
          autoPlay: true,
          onTimeUpdate,
          onLoadedMetadata: function(e) {
            setDuration(e.currentTarget.duration || 0);
          },
          onDurationChange: function(e) {
            setDuration(e.currentTarget.duration || 0);
          },
          onWaiting: function() {
            setBuffering(true);
          },
          onCanPlay: function() {
            setBuffering(false);
          },
          onPlay: function() {
            setIsPlaying(true);
          },
          onPlaying: function() {
            setIsPlaying(true);
            setBuffering(false);
          },
          onPause: function() {
            setIsPlaying(false);
          },
          onEnded: function() {
            next();
          },
          onError: function() {
            setError("\u89C6\u9891\u52A0\u8F7D\u5931\u8D25");
          }
        }),
        buffering ? import_react.default.createElement("div", { className: "bili-loading" }, "\u7F13\u51B2\u4E2D\u2026") : null,
        import_react.default.createElement(
          "div",
          { className: "bili-dm-layer" + (isPlaying ? "" : " paused") },
          activeDm.map(function(d) {
            if (d.mode === 1) {
              return import_react.default.createElement("div", {
                key: d.id,
                className: "bili-dm-item bili-dm-scroll",
                style: { top: Math.round(d.lane * laneH) + "px", color: colorToCss(d.color), fontSize: dmFontSize(d.size, dmScale) + "px" }
              }, d.text);
            }
            return import_react.default.createElement("div", {
              key: d.id,
              className: "bili-dm-item bili-dm-static",
              style: { top: d.mode === 5 ? "8px" : "auto", bottom: d.mode === 4 ? "8px" : "auto", color: colorToCss(d.color), fontSize: dmFontSize(d.size, dmScale) + "px" }
            }, d.text);
          })
        )
      ) : import_react.default.createElement("div", {
        className: "bili-frame",
        style: { height: frameH + "px", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }
      }, loading ? "\u52A0\u8F7D\u4E2D\u2026" : "\u83B7\u53D6\u89C6\u9891\u2026");
      const ctrl = video ? import_react.default.createElement(
        "div",
        { className: "bili-ctrl" },
        import_react.default.createElement("button", { className: "bili-playbtn", onClick: togglePlay, title: isPlaying ? "\u6682\u505C" : "\u64AD\u653E" }, isPlaying ? "\u23F8" : "\u25B6"),
        import_react.default.createElement("button", { className: "bili-mutebtn", onClick: toggleMute, title: muted ? "\u53D6\u6D88\u9759\u97F3" : "\u9759\u97F3" }, speakerIcon(muted)),
        import_react.default.createElement("input", { className: "bili-vol", type: "range", min: 0, max: 1, step: 0.05, value: muted ? 0 : volume, onChange: onVolume }),
        import_react.default.createElement("input", { className: "bili-seek", type: "range", min: 0, max: duration || 0, step: 0.1, value: Math.min(currentTime, duration || 0), onChange: onSeek }),
        import_react.default.createElement("span", { className: "bili-time" }, fmtTime(currentTime) + " / " + fmtTime(duration)),
        import_react.default.createElement(
          "select",
          { className: "bili-csel", value: String(speed), onChange: onSpeed },
          import_react.default.createElement("option", { value: "0.5" }, "0.5x"),
          import_react.default.createElement("option", { value: "0.75" }, "0.75x"),
          import_react.default.createElement("option", { value: "1" }, "1x"),
          import_react.default.createElement("option", { value: "1.25" }, "1.25x"),
          import_react.default.createElement("option", { value: "1.5" }, "1.5x"),
          import_react.default.createElement("option", { value: "2" }, "2x")
        ),
        import_react.default.createElement(
          "select",
          { className: "bili-csel", value: String(qnState), onChange: onQuality },
          import_react.default.createElement("option", { value: "0" }, autoLabel),
          QUALITY_OPTIONS.map(function(o) {
            return import_react.default.createElement("option", { key: String(o.qn), value: String(o.qn) }, o.desc);
          })
        )
      ) : null;
      const meta = video ? import_react.default.createElement(
        "div",
        { className: "bili-meta" },
        import_react.default.createElement("div", { className: "bili-t" }, video.title || "\uFF08\u65E0\u6807\u9898\uFF09"),
        import_react.default.createElement(
          "div",
          { style: { marginTop: "3px" } },
          (video.owner ? "UP\u4E3B\uFF1A" + video.owner + " \xB7 " : "") + (fmtView(video.view) ? fmtView(video.view) + " \u64AD\u653E" : "")
        ),
        import_react.default.createElement(
          "div",
          { style: { marginTop: "6px" } },
          import_react.default.createElement("button", { className: "bili-favbtn", onClick: favVideo }, faved ? "\u2605 \u5DF2\u6536\u85CF" : "\u2606 \u6536\u85CF")
        )
      ) : null;
      const errLine = error ? import_react.default.createElement("div", { className: "bili-err" }, error) : null;
      const accountPanel = accountOpen ? import_react.default.createElement("div", { className: "bili-panel" }, renderAccountPanel()) : null;
      const celebrateOverlay = celebrate ? import_react.default.createElement(
        "div",
        { className: "bili-celebrate" },
        import_react.default.createElement("div", { className: "bili-celebrate-confetti" }, "\u{1F389} \u2728 \u{1F38A}"),
        import_react.default.createElement("div", { className: "bili-celebrate-text" }, "\u{1F433} \u9CB8\u9C7C\u5E72\u5B8C\u5566\uFF0C\u8001\u5927\u6765\u9A8C\u6536\uFF01")
      ) : null;
      return import_react.default.createElement(
        "div",
        { className: "bili-win", style: wstyle },
        import_react.default.createElement(
          "div",
          { className: "bili-head", onPointerDown: onHeadDown, onPointerMove: onHeadMove, onPointerUp: onHeadUp, onPointerCancel: onHeadUp },
          import_react.default.createElement("span", { style: { display: "inline-flex" } }, tvIcon(agentStatus !== "running")),
          import_react.default.createElement("span", { className: "bili-status" }, agentStatus === "running" ? "\u{1F433} \u6253\u5DE5\u4E2D......" : "\u{1F433} \u5B8C\u4E8B\u513F\u4E86\uFF0C\u8001\u5927\u6765\u9A8C\u6536\uFF01"),
          import_react.default.createElement("span", { className: "bili-title" }, "Bilibili \u9CB8\u9C7C\u76D1\u5DE5"),
          import_react.default.createElement("button", { className: "bili-btn", onClick: next }, "\u6362\u4E00\u4E2A"),
          import_react.default.createElement("button", { className: "bili-btn", onClick: function() {
            setAccountOpen(!accountOpen);
          } }, account ? "\u8D26\u53F7" : "\u767B\u5F55"),
          import_react.default.createElement("button", { className: "bili-btn", onClick: function() {
            setSettingsOpen(!settingsOpen);
          } }, "\u8BBE\u7F6E"),
          import_react.default.createElement("button", { className: "bili-btn", onClick: function() {
            setMode("mini");
          } }, "\u2014"),
          import_react.default.createElement("button", { className: "bili-btn", onClick: function() {
            setMode("closed");
          } }, "\u2715")
        ),
        media,
        ctrl,
        meta,
        errLine,
        accountPanel,
        renderSidebar(),
        celebrateOverlay,
        import_react.default.createElement("div", { className: "bili-resize", onPointerDown: onResizeDown, onPointerMove: onResizeMove, onPointerUp: onResizeUp, onPointerCancel: onResizeUp })
      );
    }
    function renderPill() {
      return import_react.default.createElement(
        "div",
        { className: "bili-pill", onClick: function() {
          setMode("open");
        } },
        import_react.default.createElement("span", null, "\u{1F4FA}"),
        import_react.default.createElement("span", null, "Bilibili \u9CB8\u9C7C\u76D1\u5DE5")
      );
    }
    return import_react.default.createElement("div", null, mode === "open" ? renderWindow() : showPill ? renderPill() : null);
  }
  slots.inject("shell.overlay", function() {
    return slots.register(
      { name: "shell.overlay", id: "bili-mini-player", order: 100, label: "Bilibili \u9CB8\u9C7C\u76D1\u5DE5" },
      function() {
        return import_react.default.createElement(BiliPlayer);
      }
    );
  });
}
		return module.exports;
	}
});
