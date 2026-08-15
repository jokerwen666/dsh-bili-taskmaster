import React from 'react'

export const name = 'dsh-bili-taskmaster'
export const inject = ['slots']


// Inject the plugin's stylesheet; removed automatically on unload.
function injectCss(cssList) {
  var tag = document.createElement("style");
  tag.dataset.plugin = "dsh-bili-taskmaster";
  tag.textContent = Array.isArray(cssList) ? cssList.join("\n") : cssList;
  document.head.appendChild(tag);
  return function () { tag.remove(); };
}

// Client<->Host JSON RPC: GET /bili-api/<method>?key=value&...
function biliCall(method, args) {
  var qs = "";
  if (args) {
    var parts = [];
    for (var k in args) {
      if (args[k] === undefined || args[k] === null) continue;
      parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(String(args[k])));
    }
    if (parts.length) qs = "?" + parts.join("&");
  }
  return fetch("/bili-api/" + encodeURIComponent(method) + qs).then(function (res) {
    return res.json();
  });
}

export function apply(ctx) {
  const slots = ctx.get('slots')
  if (slots === undefined) return

  ctx.effect(function () {
    return injectCss([
      '.bili-win{position:fixed;z-index:100000;background:#ffffff;color:#1f2328;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,0.28);border:1px solid rgba(0,0,0,0.08);overflow:hidden;display:flex;flex-direction:column;pointer-events:auto;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif}',
      '.bili-head{display:flex;align-items:center;gap:5px;padding:8px 10px;cursor:move;user-select:none;background:linear-gradient(90deg,#fb7299,#fc9bb7);color:#fff;font-size:13px;font-weight:600;position:relative;z-index:30}',
      '.bili-title{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.bili-status{font-size:11px;font-weight:600;white-space:nowrap;background:rgba(255,255,255,0.28);border-radius:10px;padding:1px 6px}',
      '.bili-btn{border:none;background:rgba(255,255,255,0.22);color:#fff;border-radius:6px;padding:3px 7px;font-size:12px;cursor:pointer;line-height:1.4}',
      '.bili-btn:hover{background:rgba(255,255,255,0.42)}',
      '.bili-frame{width:100%;background:#000;overflow:hidden;position:relative}',
      '.bili-video{width:100%;height:100%;display:block;background:#000;object-fit:contain}',
      '.bili-dm-layer{position:absolute;inset:0;overflow:hidden;pointer-events:none}',
      '.bili-dm-layer.paused .bili-dm-item{animation-play-state:paused !important}',
      '.bili-dm-item{position:absolute;white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,0.9);font-weight:600;line-height:1.2}',
      '.bili-dm-scroll{animation:biliScroll 8s linear forwards}',
      '.bili-dm-static{left:0;right:0;text-align:center}',
      '@keyframes biliScroll{from{left:100%}to{left:-100%}}',
      '.bili-loading{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;pointer-events:none}',
      '.bili-ctrl{display:flex;align-items:center;gap:6px;padding:6px 10px;background:#fff;border-top:1px solid #f0f0f0;flex-wrap:wrap}',
      '.bili-playbtn{width:32px;height:32px;border-radius:50%;border:none;background:#fb7299;color:#fff;font-size:12px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;line-height:1;flex:none}',
      '.bili-playbtn:hover{background:#fc85a0}',
      '.bili-mutebtn{width:26px;height:26px;border-radius:50%;border:1px solid #e4e7eb;background:#f6f8fa;color:#57606a;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex:none;padding:0}',
      '.bili-mutebtn:hover{background:#eceff2}',
      '.bili-vol{width:56px;accent-color:#fb7299;height:16px;margin:0;flex:none}',
      '.bili-seek{flex:1;min-width:48px;accent-color:#fb7299;height:18px;margin:0}',
      '.bili-time{font-size:11px;color:#8c959f;white-space:nowrap;font-variant-numeric:tabular-nums}',
      '.bili-csel{border:1px solid #fb7299;background:#fff;border-radius:14px;padding:4px 8px;font-size:12px;color:#fb7299;cursor:pointer;font-family:inherit}',
      '.bili-meta{padding:8px 10px;font-size:12px;color:#57606a;background:#fff}',
      '.bili-t{font-size:13px;color:#1f2328;font-weight:600;margin-bottom:3px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '.bili-err{padding:8px 10px;font-size:11px;color:#c0392b;background:#fdecea;line-height:1.5;word-break:break-all}',
      '.bili-panel{padding:8px 10px 10px;border-top:1px dashed rgba(0,0,0,0.08);background:#fafbfc}',
      '.bili-hint{font-size:11px;color:#8c959f;line-height:1.5;margin-top:6px}',
      '.bili-row{display:flex;gap:6px;margin-top:8px}',
      '.bili-ghost{background:#e4e7eb;color:#333}',
      '.bili-lv{font-size:11px;color:#fb7299;font-weight:600;margin-top:2px}',
      '.bili-favbtn{border:1px solid #fb7299;background:#fff;color:#fb7299;border-radius:12px;padding:2px 8px;font-size:11px;cursor:pointer;font-family:inherit}',
      '.bili-celebrate{position:absolute;inset:0;z-index:40;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,0.55);animation:biliFadeIn 0.3s ease}',
      '.bili-celebrate-text{font-size:17px;font-weight:700;color:#fff;background:linear-gradient(90deg,#fb7299,#fc9bb7);padding:12px 20px;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,0.4);text-align:center;animation:biliPop 0.5s ease}',
      '.bili-celebrate-confetti{font-size:22px;letter-spacing:6px;margin-bottom:8px;animation:biliConfetti 1.2s ease infinite}',
      '@keyframes biliPop{0%{transform:scale(0.6);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}',
      '@keyframes biliFadeIn{from{opacity:0}to{opacity:1}}',
      '@keyframes biliConfetti{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-6px) rotate(10deg)}}',
      '.bili-resize{position:absolute;right:0;bottom:0;width:18px;height:18px;cursor:nwse-resize;background:linear-gradient(315deg,transparent 50%,rgba(0,0,0,0.28) 50%);z-index:30}',
      '.bili-sidebar{position:absolute;top:0;right:0;bottom:0;width:250px;z-index:25;background:rgba(255,255,255,0.82);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);box-shadow:-8px 0 24px rgba(0,0,0,0.12);display:flex;flex-direction:column;color:#1f2328;transform:translateX(100%);transition:transform 0.22s ease}',
      '.bili-sidebar.open{transform:translateX(0)}',
      '.bili-shead{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid rgba(0,0,0,0.06);font-size:15px;font-weight:600}',
      '.bili-sbody{padding:14px 16px;overflow-y:auto}',
      '.bili-setrow{display:flex;align-items:center;gap:8px;font-size:13px;color:#1f2328;padding:8px 0;cursor:pointer}',
      '.bili-setgroup{font-size:11px;color:#8c959f;text-transform:uppercase;letter-spacing:0.5px;margin:10px 0 4px}',
      '.bili-slider{flex:1;accent-color:#fb7299}',
      '.bili-pill{position:fixed;z-index:100000;bottom:16px;right:16px;background:linear-gradient(90deg,#fb7299,#fc9bb7);color:#fff;border-radius:999px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,0.25);pointer-events:auto;user-select:none;display:inline-flex;align-items:center;gap:6px}',
    ].join('\n'))
  })

  let lastTurn = 0
  let dragState = null
  let resizeState = null
  let prevAgentStatus = null
  let autoPauseEnabled = false
  let currentBvid = ''
  let videoEl = null
  let dmShown = 0
  let dmId = 0
  let laneBusyUntil = []
  let currentVolume = 1
  let currentMuted = false
  let mediaSource = null
  let setActiveDmRef = null
  let whaleCount = 0

  const WHALE_PHRASES = [
    '🐳 老大，第 {n} 个视频了哦？',
    '🐳 鲸鱼埋头苦干中，老大看得挺开心嘛',
    '🐳 这个视频不错，鲸鱼也想摸鱼了…',
    '🐳 监工监工，光监不工可不行',
    '🐳 干完喊我，我先陪你刷会儿',
    '🐳 鲸鱼提醒：进度条已经出卖你了',
    '🐳 老大，验收单攒了一堆啦',
  ]

  function whalePhrase() {
    const p = WHALE_PHRASES[Math.floor(Math.random() * WHALE_PHRASES.length)]
    return p.replace('{n}', String(whaleCount))
  }

  function spawnWhaleDmImpl() {
    if (!videoEl || videoEl.paused) return
    const id = dmId
    dmId += 1
    const item = { id: id, text: whalePhrase(), color: 0xFFB347, size: 26, mode: 1, lane: Math.floor(Math.random() * 5) }
    if (setActiveDmRef) setActiveDmRef(function (prev) { return prev.concat([item]) })
    setTimeout(function () {
      if (setActiveDmRef) setActiveDmRef(function (prev) { return prev.filter(function (x) { return x.id !== id }) })
    }, 8000)
  }

  const QUALITY_OPTIONS = [
    { qn: 80, desc: '1080P 高清' },
    { qn: 64, desc: '720P 高清' },
    { qn: 32, desc: '480P 清晰' },
    { qn: 16, desc: '360P 流畅' },
  ]

  function qualityName(qn) {
    const map = { 120: '4K', 116: '1080P 60帧', 112: '1080P 高码率', 80: '1080P', 74: '720P 60帧', 64: '720P', 32: '480P', 16: '360P' }
    return map[qn] || ('清晰度 ' + qn)
  }

  function fmtView(n) {
    if (!n) return ''
    if (n >= 100000000) return (n / 100000000).toFixed(1) + '亿'
    if (n >= 10000) return (n / 10000).toFixed(1) + '万'
    return String(n)
  }

  function fmtTime(s) {
    if (!isFinite(s) || s < 0) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return m + ':' + (sec < 10 ? '0' + sec : sec)
  }

  function colorToCss(n) {
    const r = (n >> 16) & 255
    const g = (n >> 8) & 255
    const b = n & 255
    return 'rgb(' + r + ',' + g + ',' + b + ')'
  }

  function dmFontSize(sz, scale) {
    const px = Math.round((sz || 25) * scale)
    if (px < 9) return 9
    if (px > 44) return 44
    return px
  }

  function tvIcon(excited) {
    return React.createElement('svg', { viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
      React.createElement('path', { d: 'M8 2.5l4 4 4-4' }),
      React.createElement('rect', { x: 3, y: 7, width: 18, height: 14, rx: 2 }),
      React.createElement('circle', { cx: 9, cy: 13, r: 0.6, fill: 'currentColor' }),
      React.createElement('circle', { cx: 15, cy: 13, r: 0.6, fill: 'currentColor' }),
      React.createElement('path', { d: excited ? 'M9.5 16 Q12 18.5 14.5 16' : 'M10.5 16 Q12 17 13.5 16' }),
      excited ? React.createElement('path', { d: 'M21 2v3.5M19.25 3.75h3.5', strokeWidth: 1.6 }) : null,
    )
  }

  function speakerIcon(muted) {
    return React.createElement('svg', { viewBox: '0 0 24 24', width: 14, height: 14, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
      React.createElement('path', { d: 'M11 5L6 9H2v6h4l5 4V5z', fill: 'currentColor', stroke: 'none' }),
      muted
        ? React.createElement('path', { d: 'M22 9l-6 6M16 9l6 6' })
        : React.createElement('path', { d: 'M15.5 8.5a5 5 0 0 1 0 7M18.5 6a9 9 0 0 1 0 12' }),
    )
  }

  function proxyUrl(u, sz) {
    return '/bili-proxy?url=' + encodeURIComponent(u) + (sz ? '&size=' + sz : '')
  }

  function proxyMseUrl(u) {
    return '/bili-proxy?url=' + encodeURIComponent(u) + '&mse=1'
  }

  function xhrChunk(url, start, end) {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'arraybuffer'
      xhr.setRequestHeader('Range', 'bytes=' + start + '-' + end)
      xhr.onload = function () {
        if (xhr.status === 206 || xhr.status === 200) resolve(xhr.response)
        else reject(new Error('HTTP ' + xhr.status))
      }
      xhr.onerror = function () { reject(new Error('网络错误')) }
      xhr.send()
    })
  }

  function appendBuf(sb, buf) {
    return new Promise(function (resolve, reject) {
      function onEnd() { sb.removeEventListener('updateend', onEnd); sb.removeEventListener('error', onErr); resolve() }
      function onErr() { sb.removeEventListener('updateend', onEnd); sb.removeEventListener('error', onErr); reject(new Error('append error')) }
      sb.addEventListener('updateend', onEnd)
      sb.addEventListener('error', onErr)
      try { sb.appendBuffer(buf) } catch (e) { reject(e) }
    })
  }

  function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms) })
  }

  function removeRange(sb, start, end) {
    return new Promise(function (resolve) {
      function onEnd() { sb.removeEventListener('updateend', onEnd); resolve() }
      sb.addEventListener('updateend', onEnd)
      try { sb.remove(start, end) } catch (e) { resolve() }
    })
  }

  async function streamM4s(url, sb, isVideo) {
    const CH = 2 * 1024 * 1024
    let offset = 0
    let first = true
    while (true) {
      try {
        if (videoEl && sb.buffered && sb.buffered.length > 0) {
          const current = videoEl.currentTime || 0
          const start = sb.buffered.start(0)
          const bufferedEnd = sb.buffered.end(sb.buffered.length - 1)
          const evictEnd = current - 60
          if (evictEnd > start + 5) {
            await removeRange(sb, start, evictEnd)
          }
          if (bufferedEnd - current > 60) {
            await sleep(1000)
            continue
          }
        }
      } catch (e) {}
      const buf = await xhrChunk(url, offset, offset + CH - 1)
      if (!buf || buf.byteLength === 0) break
      await appendBuf(sb, buf)
      offset += buf.byteLength
      if (first && isVideo && videoEl) {
        first = false
        try { videoEl.play() } catch (e) {}
      }
      if (buf.byteLength < CH) break
    }
  }

  function BiliPlayer() {
    const m = React.useState('open')
    const mode = m[0]
    const setMode = m[1]
    const vs = React.useState(null)
    const video = vs[0]
    const setVideo = vs[1]
    const ps = React.useState(null)
    const pos = ps[0]
    const setPos = ps[1]
    const so = React.useState(false)
    const settingsOpen = so[0]
    const setSettingsOpen = so[1]
    const ao = React.useState(false)
    const accountOpen = ao[0]
    const setAccountOpen = ao[1]
    const ld = React.useState(false)
    const loading = ld[0]
    const setLoading = ld[1]
    const er = React.useState('')
    const error = er[0]
    const setError = er[1]
    const ac = React.useState(null)
    const account = ac[0]
    const setAccount = ac[1]
    const lo = React.useState(false)
    const loginOpen = lo[0]
    const setLoginOpen = lo[1]
    const qr = React.useState(null)
    const qrData = qr[0]
    const setQrData = qr[1]
    const lm = React.useState('')
    const loginMsg = lm[0]
    const setLoginMsg = lm[1]
    const pl = React.useState(false)
    const polling = pl[0]
    const setPolling = pl[1]
    const sz = React.useState(340)
    const width = sz[0]
    const setWidth = sz[1]
    const ap = React.useState(false)
    const autoPause = ap[0]
    const setAutoPause = ap[1]
    const fs = React.useState(1)
    const dmFontScale = fs[0]
    const setDmFontScale = fs[1]
    const dd = React.useState(1)
    const dmDensity = dd[0]
    const setDmDensity = dd[1]
    const ag = React.useState('idle')
    const agentStatus = ag[0]
    const setAgentStatus = ag[1]
    const fv = React.useState(false)
    const faved = fv[0]
    const setFaved = fv[1]
    const ce = React.useState(false)
    const celebrate = ce[0]
    const setCelebrate = ce[1]
    const vo = React.useState(1)
    const volume = vo[0]
    const setVolume = vo[1]
    const mu = React.useState(false)
    const muted = mu[0]
    const setMuted = mu[1]
    const pu = React.useState(null)
    const playurl = pu[0]
    const setPlayurl = pu[1]
    const mu2 = React.useState('')
    const mseUrl = mu2[0]
    const setMseUrl = mu2[1]
    const dm = React.useState([])
    const danmaku = dm[0]
    const setDanmaku = dm[1]
    const ad = React.useState([])
    const activeDm = ad[0]
    const setActiveDm = ad[1]
    const ip = React.useState(false)
    const isPlaying = ip[0]
    const setIsPlaying = ip[1]
    const bf = React.useState(false)
    const buffering = bf[0]
    const setBuffering = bf[1]
    const ct = React.useState(0)
    const currentTime = ct[0]
    const setCurrentTime = ct[1]
    const du = React.useState(0)
    const duration = du[0]
    const setDuration = du[1]
    const sp2 = React.useState(1)
    const speed = sp2[0]
    const setSpeed = sp2[1]
    const qn = React.useState(0)
    const qnState = qn[0]
    const setQn = qn[1]

    setActiveDmRef = setActiveDm

    function syncAccount(s) {
      if (!s) return
      setAccount(function (prev) {
        const next = s.account
        if (!next) return prev ? null : prev
        if (prev && prev.nickname === next.nickname && prev.avatar === next.avatar && prev.level === next.level) return prev
        return next
      })
    }

    function cleanupMSE() {
      if (mediaSource) {
        try {
          if (mediaSource.readyState === 'open') {
            const sbs = mediaSource.sourceBuffers
            for (let i = sbs.length - 1; i >= 0; i--) {
              try { mediaSource.removeSourceBuffer(sbs[i]) } catch (e) {}
            }
            mediaSource.endOfStream()
          }
        } catch (e) {}
        mediaSource = null
      }
      if (mseUrl) {
        try { URL.revokeObjectURL(mseUrl) } catch (e) {}
        setMseUrl('')
      }
    }

    function applyQuality(v, q) {
      if (!v) return
      if (q === 80) {
        setBuffering(true)
        if (v.dash && v.dash.videoUrl) {
          startMSE(v.dash)
        } else {
          biliCall('get-dash', { bvid: v.bvid, cid: v.cid }).then(function (d) {
            if (d && d.videoUrl) { if (v.bvid === currentBvid) startMSE(d) }
          }).catch(function () {})
        }
      } else if (q > 0) {
        biliCall('get-playurl', { bvid: v.bvid, cid: v.cid, qn: q }).then(function (r) {
          if (r && r.url && v.bvid === currentBvid) setPlayurl(r)
        }).catch(function () {})
      }
    }

    function noteVideo(v) {
      if (v && v.bvid && v.bvid !== currentBvid) {
        currentBvid = v.bvid
        whaleCount += 1
        cleanupMSE()
        setPlayurl(v.playurl || null)
        setDanmaku([])
        setActiveDm([])
        dmShown = 0
        laneBusyUntil = []
        setBuffering(false)
        setCurrentTime(0)
        setDuration(0)
        setFaved(false)
      }
      setVideo(v)
      if (v && v.bvid) applyQuality(v, qn)
    }

    async function getStatus() {
      try { return await biliCall('get-status', {}) } catch (e) { return null }
    }

    async function next() {
      setLoading(true)
      setError('')
      try {
        const r = await biliCall('next', {})
        if (r && r.video && r.video.bvid) {
          noteVideo(r.video)
          lastTurn = r.turn || 0
          setMode('open')
        } else if (r && r.error) {
          setError(r.error)
        }
        syncAccount(r)
      } catch (e) { console.error('[bili] next failed:', e); setError('RPC 调用失败') }
      setLoading(false)
    }

    async function loadDanmaku(v) {
      const bvid = v.bvid
      const d = await biliCall('get-danmaku', { cid: v.cid })
      if (bvid !== currentBvid) return
      if (d && Array.isArray(d)) {
        d.sort(function (a, b) { return a.time - b.time })
        setDanmaku(d)
        dmShown = 0
      }
    }

    React.useEffect(function () {
      if (!video || !video.bvid || !video.cid) return
      loadDanmaku(video)
    }, [video ? video.bvid : null])

    function videoSrc() {
      if (mseUrl) return mseUrl
      return playurl && playurl.url ? proxyUrl(playurl.url, playurl.size) : ''
    }

    React.useEffect(function () {
      if (videoEl && videoSrc()) {
        videoEl.volume = currentVolume
        videoEl.muted = currentMuted
        try {
          const p = videoEl.play()
          if (p && typeof p.catch === 'function') p.catch(function () {})
        } catch (e) {}
      }
    }, [playurl ? playurl.url : null, mseUrl])

    function startMSE(dash) {
      if (typeof MediaSource === 'undefined') { setError('浏览器不支持 MSE'); setBuffering(false); return }
      cleanupMSE()
      let ms = null
      let sbAdded = false
      try {
        ms = new MediaSource()
        mediaSource = ms
        const blobUrl = URL.createObjectURL(ms)
        ms.addEventListener('sourceopen', function () {
          if (ms.readyState !== 'open') return
          if (sbAdded) return
          sbAdded = true
          let vsb = null
          let asb = null
          try {
            vsb = ms.addSourceBuffer('video/mp4; codecs="' + dash.videoCodecs + '"')
            asb = ms.addSourceBuffer('audio/mp4; codecs="' + dash.audioCodecs + '"')
          } catch (e) { setError('MSE 初始化失败: ' + (e.message || e)); setBuffering(false); return }
          let vDone = false
          let aDone = false
          function maybeEnd() {
            if (vDone && aDone) {
              try { if (ms.readyState === 'open') ms.endOfStream() } catch (e) {}
            }
          }
          streamM4s(proxyMseUrl(dash.videoUrl), vsb, true).then(function () { vDone = true; maybeEnd() }).catch(function (e) { if (mediaSource !== ms) return; setError('视频流加载失败: ' + (e && e.message ? e.message : e)); setBuffering(false) })
          streamM4s(proxyMseUrl(dash.audioUrl), asb, false).then(function () { aDone = true; maybeEnd() }).catch(function (e) { if (mediaSource !== ms) return; setError('音频流加载失败: ' + (e && e.message ? e.message : e)); setBuffering(false) })
        })
        setMseUrl(blobUrl)
      } catch (e) { setError('MSE 创建失败: ' + (e.message || e)); setBuffering(false) }
    }

    async function favVideo() {
      if (!video || !video.aid) { setError('视频信息不完整'); return }
      const r = await biliCall('fav-video', { aid: video.aid })
      if (r && r.ok) { setFaved(true); setError('') }
      else { setError(r && r.error ? r.error : '收藏失败') }
    }

    async function refresh(manual) {
      const s = await getStatus()
      if (!s) return
      const changed = (s.turn || 0) > lastTurn
      if ((s.turn || 0) > lastTurn) lastTurn = s.turn || 0
      if (s.video && s.video.bvid) {
        if (s.video.bvid !== currentBvid) {
          currentBvid = s.video.bvid
          whaleCount += 1
          cleanupMSE()
          setPlayurl(s.video.playurl || null)
          setDanmaku([])
          setActiveDm([])
          dmShown = 0
          laneBusyUntil = []
          setFaved(false)
          setVideo(s.video)
          applyQuality(s.video, qn)
        }
      }
      if (s.error) setError(s.error)
      syncAccount(s)
      setAgentStatus(s.agentStatus || 'idle')
      if (typeof s.dmFont === 'number' && Math.abs(s.dmFont - dmFontScale) > 0.001) {
        setDmFontScale(s.dmFont)
      }
      if (typeof s.dmDensity === 'number' && Math.abs(s.dmDensity - dmDensity) > 0.001) {
        setDmDensity(s.dmDensity)
      }
      if (typeof s.autoPause === 'boolean' && s.autoPause !== autoPause) {
        autoPauseEnabled = s.autoPause
        setAutoPause(s.autoPause)
      }
      if (s.agentStatus === 'idle' && prevAgentStatus === 'running') {
        setCelebrate(true)
        setTimeout(function () { setCelebrate(false) }, 5000)
        if (autoPauseEnabled) {
          if (videoEl) { try { videoEl.pause() } catch (e) {} }
        }
      }
      prevAgentStatus = s.agentStatus
      if (manual || (changed && s.video && s.video.bvid)) setMode('open')
    }

    async function startLogin() {
      setLoginOpen(true)
      setLoginMsg('正在生成二维码…')
      setQrData(null)
      try {
        const r = await biliCall('login-start', {})
        if (r && r.qrcode_url) {
          setQrData({ url: r.qrcode_url })
          setLoginMsg('请用 B 站 App 扫码')
          setPolling(true)
        } else {
          setLoginMsg('生成二维码失败：' + (r && r.error ? r.error : '未知错误'))
        }
      } catch (e) { setLoginMsg('登录请求失败') }
    }

    function logout() {
      biliCall('logout', {}).then(function (r) {
        if (r && r.video && r.video.bvid) {
          noteVideo(r.video)
        }
      }).catch(function () {})
      setAccount(null)
      setLoginOpen(false)
      setPolling(false)
      setQrData(null)
      setLoginMsg('')
    }

    function togglePlay() {
      if (!videoEl) return
      if (videoEl.paused) { try { videoEl.play() } catch (e) {} } else { try { videoEl.pause() } catch (e) {} }
    }

    function toggleMute() {
      currentMuted = !currentMuted
      setMuted(currentMuted)
      if (videoEl) { videoEl.muted = currentMuted }
    }

    function onVolume(e) {
      const v = Number(e.target.value)
      currentVolume = v
      setVolume(v)
      if (v > 0 && currentMuted) {
        currentMuted = false
        setMuted(false)
      }
      if (videoEl) {
        videoEl.volume = v
        videoEl.muted = currentMuted
      }
    }

    function onSpeed(e) {
      const v = Number(e.target.value)
      setSpeed(v)
      if (videoEl) { try { videoEl.playbackRate = v } catch (e) {} }
    }

    function onQuality(e) {
      const q = Number(e.target.value)
      setQn(q)
      if (!video) return
      if (q === 80) {
        setBuffering(true)
        if (video.dash && video.dash.videoUrl) {
          startMSE(video.dash)
        } else {
          biliCall('get-dash', { bvid: video.bvid, cid: video.cid }).then(function (d) {
            if (d && d.videoUrl) {
              if (video.bvid === currentBvid) startMSE(d)
            } else {
              setError(d && d.error ? d.error : '该视频无 1080P')
              setBuffering(false)
            }
          }).catch(function () { setError('获取 1080P 失败'); setBuffering(false) })
        }
      } else {
        cleanupMSE()
        if (q === 0 && video.playurl) {
          setPlayurl(video.playurl)
        } else {
          biliCall('get-playurl', { bvid: video.bvid, cid: video.cid, qn: q }).then(function (r) {
            if (r && r.url && video.bvid === currentBvid) setPlayurl(r)
          }).catch(function () {})
        }
      }
    }

    function onSeek(e) {
      const t = Number(e.target.value)
      setCurrentTime(t)
      if (videoEl) { try { videoEl.currentTime = t } catch (err) {} }
    }

    function onDmFont(e) {
      const v = Number(e.target.value)
      setDmFontScale(v)
      biliCall('set-dmfont', { value: v }).catch(function () {})
    }

    function onDmDensity(e) {
      const v = Number(e.target.value)
      setDmDensity(v)
      biliCall('set-dmdensity', { value: v }).catch(function () {})
    }

    function onAutoPause(e) {
      const v = e.target.checked
      autoPauseEnabled = v
      setAutoPause(v)
      biliCall('set-autopause', { value: v }).catch(function () {})
    }

    function spawnDm(item) {
      const id = dmId
      dmId += 1
      if (item.mode === 1) {
        const laneCount = Math.max(1, Math.round(6 * dmDensity))
        const now = Date.now()
        let lane = -1
        for (let i = 0; i < laneCount; i++) {
          if ((laneBusyUntil[i] || 0) <= now) { lane = i; break }
        }
        if (lane < 0) return
        const busyMs = Math.round(4500 / dmDensity)
        laneBusyUntil[lane] = now + busyMs
        setActiveDm(function (prev) {
          return prev.concat([{ id: id, text: item.text, color: item.color, size: item.size, mode: 1, lane: lane }])
        })
        setTimeout(function () {
          setActiveDm(function (prev) { return prev.filter(function (x) { return x.id !== id }) })
        }, 8000)
      } else {
        setActiveDm(function (prev) {
          return prev.concat([{ id: id, text: item.text, color: item.color, size: item.size, mode: item.mode, lane: -1 }])
        })
        setTimeout(function () {
          setActiveDm(function (prev) { return prev.filter(function (x) { return x.id !== id }) })
        }, 4500)
      }
    }

    function onTimeUpdate() {
      if (!videoEl) return
      setCurrentTime(videoEl.currentTime)
      if (!danmaku.length) return
      const t = videoEl.currentTime
      while (dmShown < danmaku.length && danmaku[dmShown].time <= t) {
        spawnDm(danmaku[dmShown])
        dmShown += 1
      }
    }

    React.useEffect(function () {
      async function init() {
        const s = await getStatus()
        if (s) {
          syncAccount(s)
          prevAgentStatus = s.agentStatus
          setAgentStatus(s.agentStatus || 'idle')
          if (typeof s.dmFont === 'number') setDmFontScale(s.dmFont)
          if (typeof s.dmDensity === 'number') setDmDensity(s.dmDensity)
          if (typeof s.autoPause === 'boolean') { autoPauseEnabled = s.autoPause; setAutoPause(s.autoPause) }
        }
        if (s && s.video && s.video.bvid) {
          currentBvid = s.video.bvid
          setPlayurl(s.video.playurl || null)
          setVideo(s.video)
          lastTurn = s.turn || 0
          setMode('open')
        } else {
          await next()
        }
      }
      init()
      const iv = setInterval(function () { refresh(false) }, 1500)
      return function () { clearInterval(iv) }
    }, [])

    React.useEffect(function () {
      const iv = setInterval(function () {
        if (Math.random() < 0.55) spawnWhaleDmImpl()
      }, 26000)
      return function () { clearInterval(iv) }
    }, [])

    React.useEffect(function () {
      if (!polling) return
      let stop = false
      async function tick() {
        if (stop) return
        let r = null
        try { r = await biliCall('login-poll', {}) } catch (e) { return }
        if (stop) return
        if (r.status === 'success') {
          if (r.account) { setAccount(r.account); setLoginOpen(false) }
          setLoginMsg('已登录')
          setPolling(false)
          next()
        } else if (r.status === 'error') {
          setLoginMsg((r.message || '登录失败') + (r.detail ? ' [' + r.detail + ']' : ''))
          setPolling(false)
          setQrData(null)
        } else if (r.status === 'expired') {
          setLoginMsg('二维码已过期，点「重新生成」重试')
          setPolling(false)
          setQrData(null)
        } else if (r.status === 'scanned') {
          setLoginMsg('已扫码，请在手机上确认')
        } else {
          setLoginMsg('请用 B 站 App 扫码')
        }
      }
      tick()
      const iv = setInterval(tick, 2000)
      return function () { stop = true; clearInterval(iv) }
    }, [polling])

    function onHeadDown(e) {
      const t = e.target
      if (t && typeof t.closest === 'function' && t.closest('button')) return
      const win = e.currentTarget.parentNode
      const rect = win.getBoundingClientRect()
      dragState = { sx: e.clientX, sy: e.clientY, left: rect.left, top: rect.top }
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) {}
    }
    function onHeadMove(e) {
      if (!dragState) return
      const dx = e.clientX - dragState.sx
      const dy = e.clientY - dragState.sy
      setPos({ left: dragState.left + dx, top: dragState.top + dy })
    }
    function onHeadUp() { dragState = null }

    function onResizeDown(e) {
      resizeState = { startX: e.clientX, startW: width }
      try { e.currentTarget.setPointerCapture(e.pointerId) } catch (err) {}
    }
    function onResizeMove(e) {
      if (!resizeState) return
      const dx = e.clientX - resizeState.startX
      let w = resizeState.startW + dx
      const maxW = Math.min(960, (window.innerWidth || 1200) - 32)
      if (w < 200) w = 200
      if (w > maxW) w = maxW
      setWidth(w)
    }
    function onResizeUp() { resizeState = null }

    function renderAccountPanel() {
      if (account) {
        return React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 } },
            React.createElement('img', { src: account.avatar, referrerPolicy: 'no-referrer', style: { width: 34, height: 34, borderRadius: '50%', background: '#f0f0f0', objectFit: 'cover' }, onError: function (e) { e.currentTarget.style.display = 'none' } }),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { fontSize: 13, fontWeight: 600, color: '#1f2328', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, account.nickname),
              React.createElement('div', { className: 'bili-lv' }, 'Lv.' + (account.level || 0)),
            ),
            React.createElement('button', { className: 'bili-btn bili-ghost', onClick: logout }, '退出登录'),
          ),
          React.createElement('div', { className: 'bili-hint' }, '已登录：推荐流已个性化。'),
        )
      }
      if (loginOpen) {
        const qrSrc = qrData ? 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(qrData.url) : ''
        return React.createElement('div', null,
          qrData ? React.createElement('img', { src: qrSrc, alt: '登录二维码', style: { width: 180, height: 180, display: 'block', margin: '8px auto', borderRadius: 8, background: '#fff' } }) : null,
          React.createElement('div', { className: 'bili-hint', style: { textAlign: 'center' } }, loginMsg || '生成中…'),
          React.createElement('div', { className: 'bili-row', style: { justifyContent: 'center' } },
            React.createElement('button', { className: 'bili-btn', style: { background: '#fb7299', color: '#fff' }, onClick: startLogin }, '重新生成'),
            React.createElement('button', { className: 'bili-btn bili-ghost', onClick: function () { setLoginOpen(false); setPolling(false) } }, '收起')),
        )
      }
      return React.createElement('div', null,
        React.createElement('div', { className: 'bili-hint' }, '登录 B 站账号后，随机推荐会自动个性化。'),
        React.createElement('div', { className: 'bili-row' },
          React.createElement('button', { className: 'bili-btn', style: { background: '#fb7299', color: '#fff' }, onClick: startLogin }, '扫码登录')),
      )
    }

    function renderSidebar() {
      return React.createElement('div', { className: 'bili-sidebar' + (settingsOpen ? ' open' : '') },
        React.createElement('div', { className: 'bili-shead' },
          React.createElement('span', null, '设置'),
          React.createElement('button', { className: 'bili-btn bili-ghost', onClick: function () { setSettingsOpen(false) } }, '✕'),
        ),
        React.createElement('div', { className: 'bili-sbody' },
          React.createElement('div', { className: 'bili-setgroup' }, '播放'),
          React.createElement('label', { className: 'bili-setrow' },
            React.createElement('input', { type: 'checkbox', checked: autoPause, onChange: onAutoPause }),
            React.createElement('span', null, '任务完成后自动暂停'),
          ),
          React.createElement('div', { className: 'bili-hint' }, '开启后，当 DSH 本轮任务执行完毕（状态回到空闲）时，会自动暂停视频。'),
          React.createElement('div', { className: 'bili-setgroup' }, '弹幕'),
          React.createElement('div', { className: 'bili-setrow', style: { flexDirection: 'column', alignItems: 'stretch', cursor: 'default' } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
              React.createElement('span', null, '弹幕字号'),
              React.createElement('span', { style: { color: '#fb7299' } }, Math.round(dmFontScale * 100) + '%'),
            ),
            React.createElement('input', { className: 'bili-slider', type: 'range', min: 0.5, max: 2, step: 0.1, value: dmFontScale, onChange: onDmFont }),
          ),
          React.createElement('div', { className: 'bili-setrow', style: { flexDirection: 'column', alignItems: 'stretch', cursor: 'default' } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
              React.createElement('span', null, '弹幕密度'),
              React.createElement('span', { style: { color: '#fb7299' } }, Math.round(dmDensity * 100) + '%'),
            ),
            React.createElement('input', { className: 'bili-slider', type: 'range', min: 0.3, max: 1, step: 0.1, value: dmDensity, onChange: onDmDensity }),
          ),
        ),
      )
    }

    function renderWindow() {
      const wstyle = Object.assign({ width: width + 'px' }, pos ? { left: pos.left + 'px', top: pos.top + 'px' } : { right: '16px', bottom: '16px' })
      const frameH = Math.round(width * 9 / 16)
      const baseScale = Math.max(0.42, Math.min(1.3, width / 500))
      const dmScale = baseScale * dmFontScale
      const laneH = Math.round(26 * dmScale)

      const autoLabel = (video && video.playurl && typeof video.playurl.quality === 'number')
        ? '自动（' + qualityName(video.playurl.quality) + '）'
        : '自动'

      const media = video
        ? React.createElement('div', { className: 'bili-frame', style: { height: frameH + 'px' } },
            React.createElement('video', {
              key: video.bvid,
              ref: function (el) { videoEl = el },
              className: 'bili-video',
              src: videoSrc(),
              autoPlay: true,
              onTimeUpdate: onTimeUpdate,
              onLoadedMetadata: function (e) { setDuration(e.currentTarget.duration || 0) },
              onDurationChange: function (e) { setDuration(e.currentTarget.duration || 0) },
              onWaiting: function () { setBuffering(true) },
              onCanPlay: function () { setBuffering(false) },
              onPlay: function () { setIsPlaying(true) },
              onPlaying: function () { setIsPlaying(true); setBuffering(false) },
              onPause: function () { setIsPlaying(false) },
              onEnded: function () { next() },
              onError: function () { setError('视频加载失败') },
            }),
            buffering ? React.createElement('div', { className: 'bili-loading' }, '缓冲中…') : null,
            React.createElement('div', { className: 'bili-dm-layer' + (isPlaying ? '' : ' paused') },
              activeDm.map(function (d) {
                if (d.mode === 1) {
                  return React.createElement('div', {
                    key: d.id,
                    className: 'bili-dm-item bili-dm-scroll',
                    style: { top: Math.round(d.lane * laneH) + 'px', color: colorToCss(d.color), fontSize: dmFontSize(d.size, dmScale) + 'px' },
                  }, d.text)
                }
                return React.createElement('div', {
                  key: d.id,
                  className: 'bili-dm-item bili-dm-static',
                  style: { top: d.mode === 5 ? '8px' : 'auto', bottom: d.mode === 4 ? '8px' : 'auto', color: colorToCss(d.color), fontSize: dmFontSize(d.size, dmScale) + 'px' },
                }, d.text)
              }),
            ),
          )
        : React.createElement('div', {
            className: 'bili-frame',
            style: { height: frameH + 'px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
          }, loading ? '加载中…' : '获取视频…')

      const ctrl = video
        ? React.createElement('div', { className: 'bili-ctrl' },
            React.createElement('button', { className: 'bili-playbtn', onClick: togglePlay, title: isPlaying ? '暂停' : '播放' }, isPlaying ? '⏸' : '▶'),
            React.createElement('button', { className: 'bili-mutebtn', onClick: toggleMute, title: muted ? '取消静音' : '静音' }, speakerIcon(muted)),
            React.createElement('input', { className: 'bili-vol', type: 'range', min: 0, max: 1, step: 0.05, value: muted ? 0 : volume, onChange: onVolume }),
            React.createElement('input', { className: 'bili-seek', type: 'range', min: 0, max: duration || 0, step: 0.1, value: Math.min(currentTime, duration || 0), onChange: onSeek }),
            React.createElement('span', { className: 'bili-time' }, fmtTime(currentTime) + ' / ' + fmtTime(duration)),
            React.createElement('select', { className: 'bili-csel', value: String(speed), onChange: onSpeed },
              React.createElement('option', { value: '0.5' }, '0.5x'),
              React.createElement('option', { value: '0.75' }, '0.75x'),
              React.createElement('option', { value: '1' }, '1x'),
              React.createElement('option', { value: '1.25' }, '1.25x'),
              React.createElement('option', { value: '1.5' }, '1.5x'),
              React.createElement('option', { value: '2' }, '2x'),
            ),
            React.createElement('select', { className: 'bili-csel', value: String(qnState), onChange: onQuality },
              React.createElement('option', { value: '0' }, autoLabel),
              QUALITY_OPTIONS.map(function (o) {
                return React.createElement('option', { key: String(o.qn), value: String(o.qn) }, o.desc)
              }),
            ),
          )
        : null

      const meta = video
        ? React.createElement('div', { className: 'bili-meta' },
            React.createElement('div', { className: 'bili-t' }, video.title || '（无标题）'),
            React.createElement('div', { style: { marginTop: '3px' } },
              (video.owner ? 'UP主：' + video.owner + ' · ' : '') + (fmtView(video.view) ? fmtView(video.view) + ' 播放' : '')),
            React.createElement('div', { style: { marginTop: '6px' } },
              React.createElement('button', { className: 'bili-favbtn', onClick: favVideo }, faved ? '★ 已收藏' : '☆ 收藏'),
            ),
          )
        : null

      const errLine = error
        ? React.createElement('div', { className: 'bili-err' }, error)
        : null

      const accountPanel = accountOpen
        ? React.createElement('div', { className: 'bili-panel' }, renderAccountPanel())
        : null

      const celebrateOverlay = celebrate
        ? React.createElement('div', { className: 'bili-celebrate' },
            React.createElement('div', { className: 'bili-celebrate-confetti' }, '🎉 ✨ 🎊'),
            React.createElement('div', { className: 'bili-celebrate-text' }, '🐳 鲸鱼干完啦，老大来验收！'),
          )
        : null

      return React.createElement('div', { className: 'bili-win', style: wstyle },
        React.createElement('div', { className: 'bili-head', onPointerDown: onHeadDown, onPointerMove: onHeadMove, onPointerUp: onHeadUp, onPointerCancel: onHeadUp },
          React.createElement('span', { style: { display: 'inline-flex' } }, tvIcon(agentStatus !== 'running')),
          React.createElement('span', { className: 'bili-status' }, agentStatus === 'running' ? '🐳 打工中......' : '🐳 完事儿了，老大来验收！'),
          React.createElement('span', { className: 'bili-title' }, 'Bilibili 鲸鱼监工'),
          React.createElement('button', { className: 'bili-btn', onClick: next }, '换一个'),
          React.createElement('button', { className: 'bili-btn', onClick: function () { setAccountOpen(!accountOpen) } }, account ? '账号' : '登录'),
          React.createElement('button', { className: 'bili-btn', onClick: function () { setSettingsOpen(!settingsOpen) } }, '设置'),
          React.createElement('button', { className: 'bili-btn', onClick: function () { setMode('mini') } }, '—'),
          React.createElement('button', { className: 'bili-btn', onClick: function () { setMode('closed') } }, '✕'),
        ),
        media,
        ctrl,
        meta,
        errLine,
        accountPanel,
        renderSidebar(),
        celebrateOverlay,
        React.createElement('div', { className: 'bili-resize', onPointerDown: onResizeDown, onPointerMove: onResizeMove, onPointerUp: onResizeUp, onPointerCancel: onResizeUp }),
      )
    }

    function renderPill() {
      return React.createElement('div', { className: 'bili-pill', onClick: function () { setMode('open') } },
        React.createElement('span', null, '📺'),
        React.createElement('span', null, 'Bilibili 鲸鱼监工'),
      )
    }

    return React.createElement('div', null, mode === 'open' ? renderWindow() : renderPill())
  }

  slots.inject('shell.overlay', function () {
    return slots.register(
      { name: 'shell.overlay', id: 'bili-mini-player', order: 100, label: 'Bilibili 鲸鱼监工' },
      function () { return React.createElement(BiliPlayer) },
    )
  })
  }