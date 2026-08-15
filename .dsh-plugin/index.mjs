export const name = 'dsh-bili-taskmaster'

// dsh-bili-taskmaster — HOST half (static Cordis plugin, ESM).
// Serves the /bili-proxy streaming MP4 proxy and the /bili-api JSON RPC.

export function apply(ctx) {
    const shell = ctx.get('shell')
    const creds = ctx.get('credentials')
    const subprocess = ctx.get('subprocess')
    const ws = ctx.get('webServer')

    let turn = 0
    let video = null
    let sessdata = ''
    let biliJct = ''
    let account = null
    let loginKey = ''
    let lastError = ''
    let agentStatus = 'idle'
    let dmFont = 1
    let dmDensity = 1
    let autoPause = false
    let videoQueue = []
    let refilling = false
    let wbiMixinKey = ''
    const moovCache = {}
    const moovOrder = []
    const MOOV_CACHE_MAX = 6

    const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
    const RCMD = 'https://api.bilibili.com/x/web-interface/index/top/feed/rcmd?ps=20&fresh_type=3'
    const WBI_RCMD = 'https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd'
    const GEN = 'https://passport.bilibili.com/x/passport-login/web/qrcode/generate'
    const POLL = 'https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key='
    const NAV = 'https://api.bilibili.com/x/web-interface/nav'
    const PLAYURL = 'https://api.bilibili.com/x/player/playurl'
    const DMLIST = 'https://api.bilibili.com/x/v2/dm/list/seg.so'
    const FAV_FOLDERS = 'https://api.bilibili.com/x/v3/fav/folder/created/list-all'
    const FAV_DEAL = 'https://api.bilibili.com/x/v3/fav/resource/deal'
    const MIXIN_KEY_ENC_TAB = [46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52]
    const OUT_MAX = 1024 * 1024
    const MOOV_CHUNK = 2 * 1024 * 1024

    function sanitize(v) {
      return String(v || '').replace(/["\\$`\r\n]/g, '')
    }

    function parseQuery(s) {
      const out = {}
      const q = String(s || '').split('?')[1] || ''
      if (!q) return out
      const parts = q.split('&')
      for (let i = 0; i < parts.length; i++) {
        const idx = parts[i].indexOf('=')
        if (idx < 0) continue
        const k = parts[i].slice(0, idx)
        const raw = parts[i].slice(idx + 1)
        let v = raw
        try { v = decodeURIComponent(raw) } catch (e) {}
        out[k] = v
      }
      return out
    }

    async function curlJson(url, cookie) {
      if (!shell || typeof shell.resolve !== 'function' || typeof shell.run !== 'function') return null
      const cookiePart = cookie ? ' -H "Cookie: ' + cookie + '"' : ''
      const cmd = 'curl -sS -m 20 -A "' + UA + '" -H "Referer: https://www.bilibili.com/"' + cookiePart + ' "' + url + '"'
      const spec = shell.resolve({ command: cmd, timeoutMs: 25000, stdoutMaxBytes: OUT_MAX })
      const res = await shell.run(spec)
      if (res && res.exitCode === 0 && res.stdout && res.stdout.text) {
        try { return JSON.parse(res.stdout.text) } catch (e) { return null }
      }
      return null
    }

    async function curlPost(url, formData, cookie) {
      if (!shell || typeof shell.resolve !== 'function' || typeof shell.run !== 'function') return null
      const cookiePart = cookie ? ' -H "Cookie: ' + cookie + '"' : ''
      const cmd = 'curl -sS -m 20 -A "' + UA + '" -H "Referer: https://www.bilibili.com/"' + cookiePart + ' -X POST -d "' + formData + '" "' + url + '"'
      const spec = shell.resolve({ command: cmd, timeoutMs: 25000, stdoutMaxBytes: OUT_MAX })
      const res = await shell.run(spec)
      if (res && res.exitCode === 0 && res.stdout && res.stdout.text) {
        try { return JSON.parse(res.stdout.text) } catch (e) { return null }
      }
      return null
    }

    async function pollRaw(key) {
      if (!shell || typeof shell.resolve !== 'function' || typeof shell.run !== 'function') return null
      const cmd = 'curl -sS -i -m 20 -A "' + UA + '" -H "Referer: https://www.bilibili.com/" "' + POLL + key + '"'
      const spec = shell.resolve({ command: cmd, timeoutMs: 25000, stdoutMaxBytes: OUT_MAX })
      const res = await shell.run(spec)
      if (!res || res.exitCode !== 0 || !res.stdout || !res.stdout.text) return null
      const text = res.stdout.text
      const m = /\r?\n\r?\n/.exec(text)
      const sep = m ? m.index : -1
      const headerPart = sep >= 0 ? text.slice(0, sep) : ''
      const bodyPart = sep >= 0 ? text.slice(sep + m[0].length) : text
      let json = null
      try { json = JSON.parse(bodyPart) } catch (e) { json = null }
      const cookies = {}
      if (headerPart) {
        const lines = headerPart.split(/\r?\n/)
        for (let i = 0; i < lines.length; i++) {
          const mm = /^set-cookie:\s*([^=;\s]+)=([^;]*)/i.exec(lines[i])
          if (mm) cookies[mm[1]] = mm[2]
        }
      }
      return { json: json, cookies: cookies }
    }

    function parseJson(text) {
      try { return JSON.parse(text) } catch (e) { return null }
    }

    function pbVarint(bytes, offset) {
      let result = 0
      let shift = 0
      while (true) {
        const b = bytes[offset]
        offset += 1
        result |= (b & 0x7f) << shift
        if ((b & 0x80) === 0) break
        shift += 7
      }
      return { value: result, offset: offset }
    }

    function utf8Decode(bytes) {
      let result = ''
      let i = 0
      while (i < bytes.length) {
        const b = bytes[i]
        if (b < 0x80) {
          result += String.fromCharCode(b)
          i += 1
        } else if (b < 0xe0) {
          result += String.fromCharCode(((b & 0x1f) << 6) | (bytes[i + 1] & 0x3f))
          i += 2
        } else if (b < 0xf0) {
          result += String.fromCharCode(((b & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f))
          i += 3
        } else {
          const cp = ((b & 0x07) << 18) | ((bytes[i + 1] & 0x3f) << 12) | ((bytes[i + 2] & 0x3f) << 6) | (bytes[i + 3] & 0x3f)
          const c = cp - 0x10000
          result += String.fromCharCode(0xd800 + (c >> 10), 0xdc00 + (c & 0x3ff))
          i += 4
        }
      }
      return result
    }

    function parseDmElem(bytes) {
      let offset = 0
      let time = 0
      let mode = 1
      let size = 25
      let color = 16777215
      let text = ''
      while (offset < bytes.length) {
        const tag = pbVarint(bytes, offset)
        offset = tag.offset
        const field = tag.value >>> 3
        const wt = tag.value & 7
        if (wt === 0) {
          const v = pbVarint(bytes, offset)
          offset = v.offset
          if (field === 2) time = v.value / 1000
          else if (field === 3) mode = v.value
          else if (field === 4) size = v.value
          else if (field === 5) color = v.value & 0xffffff
        } else if (wt === 2) {
          const len = pbVarint(bytes, offset)
          offset = len.offset
          if (field === 7) text = utf8Decode(bytes.subarray(offset, offset + len.value))
          offset += len.value
        } else if (wt === 5) {
          offset += 4
        } else if (wt === 1) {
          offset += 8
        } else {
          break
        }
      }
      if (text) return { time: time, mode: mode, size: size, color: color, text: text }
      return null
    }

    function parseDmProto(bytes) {
      const out = []
      let offset = 0
      while (offset < bytes.length) {
        const tag = pbVarint(bytes, offset)
        offset = tag.offset
        const field = tag.value >>> 3
        const wt = tag.value & 7
        if (field === 1 && wt === 2) {
          const len = pbVarint(bytes, offset)
          offset = len.offset
          const elem = parseDmElem(bytes.subarray(offset, offset + len.value))
          offset += len.value
          if (elem) out.push(elem)
        } else if (wt === 0) {
          offset = pbVarint(bytes, offset).offset
        } else if (wt === 2) {
          const len = pbVarint(bytes, offset)
          offset = len.offset + len.value
        } else if (wt === 5) {
          offset += 4
        } else if (wt === 1) {
          offset += 8
        } else {
          break
        }
      }
      return out
    }

    function fetchDmProto(cid) {
      if (!subprocess) return Promise.resolve(null)
      return new Promise(function (resolve) {
        const url = DMLIST + '?type=1&oid=' + cid + '&segment_index=1'
        let handle = null
        try {
          handle = subprocess.spawn({
            argv: ['curl', '-sS', '--compressed', '-m', '20', '-A', UA, '-H', 'Referer: https://www.bilibili.com/', url],
            cwd: '/tmp',
            stdio: { stdin: 'ignore', stdout: 'pipe', stderr: 'pipe' },
            graceMs: 5000,
          })
        } catch (e) { resolve(null); return }
        const chunks = []
        let total = 0
        if (handle.stdout) {
          handle.stdout.on('data', function (chunk) { chunks.push(chunk); total += chunk.length })
          handle.stdout.on('end', function () {
            const buf = new Uint8Array(total)
            let pos = 0
            for (let i = 0; i < chunks.length; i++) { buf.set(chunks[i], pos); pos += chunks[i].length }
            resolve(buf)
          })
          handle.stdout.on('error', function () { resolve(null) })
        } else {
          resolve(null)
        }
      })
    }

    function pickFrom(list) {
      if (!Array.isArray(list)) return null
      const usable = []
      for (let i = 0; i < list.length; i++) {
        const it = list[i]
        if (it && typeof it.bvid === 'string' && it.bvid.length > 0) usable.push(it)
      }
      if (usable.length === 0) return null
      const it = usable[Math.floor(Math.random() * usable.length)]
      const owner = it.owner && typeof it.owner === 'object' ? String(it.owner.name || '') : ''
      const view = it.stat && typeof it.stat === 'object' ? Number(it.stat.view || 0) : 0
      const cid = Number(it.cid || 0)
      const aid = Number(it.id || 0)
      return { bvid: it.bvid, cid: cid, aid: aid, title: String(it.title || ''), owner: owner, view: view, pic: String(it.pic || '') }
    }

    function pickFromJson(j) {
      if (!j || typeof j !== 'object' || j.code !== 0 || !j.data) return null
      if (Array.isArray(j.data.item)) return pickFrom(j.data.item)
      if (Array.isArray(j.data.list)) return pickFrom(j.data.list)
      return null
    }

    function extractParam(url, name) {
      if (!url) return ''
      try {
        const qs = String(url).split('?')[1] || ''
        const parts = qs.split('&')
        for (let i = 0; i < parts.length; i++) {
          const kv = parts[i].split('=')
          if (kv[0] === name) return kv.slice(1).join('=')
        }
      } catch (e) {}
      return ''
    }

    function buildCookie(cookies, sess) {
      const parts = []
      if (cookies['DedeUserID']) parts.push('DedeUserID=' + sanitize(cookies['DedeUserID']))
      if (cookies['DedeUserID__ckMd5']) parts.push('DedeUserID__ckMd5=' + sanitize(cookies['DedeUserID__ckMd5']))
      if (sess) parts.push('SESSDATA=' + sanitize(sess))
      if (cookies['bili_jct']) parts.push('bili_jct=' + sanitize(cookies['bili_jct']))
      return parts.join('; ')
    }

    async function verifyLogin(cookies, urlSess) {
      const setSess = cookies['SESSDATA'] || ''
      const candidates = []
      if (setSess) candidates.push(setSess)
      if (urlSess && urlSess !== setSess) candidates.push(urlSess)
      const base = candidates.slice()
      for (let i = 0; i < base.length; i++) {
        try { const d1 = decodeURIComponent(base[i]); if (d1 !== base[i]) candidates.push(d1) } catch (e) {}
      }
      const seen = {}
      const uniq = []
      for (let i = 0; i < candidates.length; i++) {
        if (!seen[candidates[i]]) { seen[candidates[i]] = true; uniq.push(candidates[i]) }
      }
      let navCode = null
      for (let i = 0; i < uniq.length; i++) {
        const sess = uniq[i]
        if (!sess) continue
        const cookie = buildCookie(cookies, sess)
        const j = await curlJson(NAV, cookie)
        if (j) navCode = j.code
        if (j && j.code === 0 && j.data && j.data.isLogin) {
          const face = String(j.data.face || '').replace(/^http:/, 'https:')
          const lv = j.data.level_info && typeof j.data.level_info.current_level === 'number' ? j.data.level_info.current_level : 0
          return { valid: true, nickname: String(j.data.uname || ''), avatar: face, level: lv, mid: Number(j.data.mid || 0), sessdata: sess, biliJct: sanitize(cookies['bili_jct'] || '') }
        }
      }
      return { valid: false, navCode: navCode, found: Object.keys(cookies).join(',') }
    }

    function persistLogin() {
      if (!creds) return
      creds.set('bili_sessdata', sessdata).catch(function () {})
      creds.set('bili_jct', biliJct).catch(function () {})
      creds.set('bili_account', JSON.stringify(account || {})).catch(function () {})
    }

    function clearLogin() {
      if (!creds) return
      creds.unset('bili_sessdata').catch(function () {})
      creds.unset('bili_jct').catch(function () {})
      creds.unset('bili_account').catch(function () {})
    }

    if (creds) {
      (async function () {
        try {
          const s = await creds.resolve('bili_sessdata')
          const j = await creds.resolve('bili_jct')
          const a = await creds.resolve('bili_account')
          const f = await creds.resolve('bili_dmfont')
          const dd = await creds.resolve('bili_dmdensity')
          const ap = await creds.resolve('bili_autopause')
          if (s && s.value) sessdata = s.value
          if (j && j.value) biliJct = j.value
          if (a && a.value) { try { const p = JSON.parse(a.value); if (p && p.nickname) account = p } catch (e) {} }
          if (f && f.value) { const n = parseFloat(f.value); if (isFinite(n) && n >= 0.5 && n <= 2) dmFont = n }
          if (dd && dd.value) { const n = parseFloat(dd.value); if (isFinite(n) && n >= 0.3 && n <= 1) dmDensity = n }
          if (ap && ap.value === '1') autoPause = true
        } catch (e) { console.error('[bili] restore failed:', e) }
      })()
    }

    async function md5(s) {
      if (!shell) return ''
      const cmd = "printf '%s' '" + s.replace(/'/g, "'\\''") + "' | md5"
      const spec = shell.resolve({ command: cmd, timeoutMs: 10000 })
      const res = await shell.run(spec)
      if (res && res.exitCode === 0 && res.stdout && res.stdout.text) {
        const m = /([0-9a-fA-F]{32})/.exec(res.stdout.text.trim())
        if (m) return m[1].toLowerCase()
      }
      return ''
    }

    function extractWbiKey(url) {
      if (!url) return ''
      const m = /\/bfs\/wbi\/([0-9a-fA-F]+)\.png/.exec(url)
      if (m) return m[1]
      const parts = String(url).split('/')
      const last = parts[parts.length - 1] || ''
      return last.replace(/\.png$/i, '')
    }

    async function getWbiMixinKey() {
      if (wbiMixinKey) return wbiMixinKey
      const j = await curlJson(NAV, sessdata ? 'SESSDATA=' + sanitize(sessdata) : '')
      if (j && j.code === 0 && j.data && j.data.wbi_img) {
        const imgKey = extractWbiKey(j.data.wbi_img.img_url)
        const subKey = extractWbiKey(j.data.wbi_img.sub_url)
        if (imgKey && subKey) {
          let mixin = ''
          const combined = imgKey + subKey
          for (let i = 0; i < 32; i++) mixin += combined[MIXIN_KEY_ENC_TAB[i]]
          wbiMixinKey = mixin
          return mixin
        }
      }
      return ''
    }

    async function fetchRecommendWbi() {
      const mixin = await getWbiMixinKey()
      if (!mixin) return null
      const params = { fresh_type: '3', ps: '20', fresh_idx_1h: '1', fresh_idx: '1', brush: '0', homepage_ver: '1', web_location: '1430650' }
      const p = Object.assign({}, params, { wts: Math.floor(Date.now() / 1000) })
      const keys = Object.keys(p).sort()
      const parts = []
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i]
        const v = String(p[k]).replace(/[!'()*]/g, '')
        parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(v))
      }
      const query = parts.join('&')
      const hash = await md5(query + mixin)
      if (!hash) return null
      const url = WBI_RCMD + '?' + query + '&w_rid=' + hash
      return await curlJson(url, sessdata ? 'SESSDATA=' + sanitize(sessdata) : '')
    }

    async function fetchRecommend() {
      const wbi = await fetchRecommendWbi()
      if (wbi) return wbi
      return await curlJson(RCMD, sessdata ? 'SESSDATA=' + sanitize(sessdata) : '')
    }

    async function fetchPlayurl(bvid, cid, qn) {
      const q = qn > 0 ? '&qn=' + qn : ''
      const j = await curlJson(PLAYURL + '?bvid=' + bvid + '&cid=' + cid + '&fnval=0&fnver=0&fourk=1' + q, sessdata ? 'SESSDATA=' + sanitize(sessdata) : '')
      if (j && j.code === 0 && j.data && Array.isArray(j.data.durl) && j.data.durl.length > 0) {
        return {
          url: j.data.durl[0].url,
          size: Number(j.data.durl[0].size || 0),
          quality: j.data.quality,
          acceptQuality: j.data.accept_quality || [],
          acceptDesc: j.data.accept_description || [],
        }
      }
      return null
    }

    async function fetchDash(bvid, cid) {
      const j = await curlJson(PLAYURL + '?bvid=' + bvid + '&cid=' + cid + '&qn=80&fnval=16&fnver=0&fourk=1', sessdata ? 'SESSDATA=' + sanitize(sessdata) : '')
      if (j && j.code === 0 && j.data && j.data.dash) {
        const dash = j.data.dash
        const videos = dash.video || []
        let vtrack = null
        for (let i = 0; i < videos.length; i++) {
          if (videos[i].codecs && videos[i].codecs.indexOf('avc1') === 0) { vtrack = videos[i]; break }
        }
        if (!vtrack && videos.length > 0) vtrack = videos[0]
        const atrack = (dash.audio && dash.audio.length > 0) ? dash.audio[0] : null
        if (vtrack && atrack) {
          return {
            videoUrl: vtrack.baseUrl,
            videoCodecs: vtrack.codecs,
            audioUrl: atrack.baseUrl,
            audioCodecs: atrack.codecs,
            duration: Number(dash.duration || 0),
          }
        }
      }
      return null
    }

    function fetchMoovBytes(url) {
      if (!subprocess) return Promise.resolve(null)
      return new Promise(function (resolve) {
        let handle = null
        try {
          handle = subprocess.spawn({
            argv: ['curl', '-sS', '-m', '30', '-A', UA, '-H', 'Referer: https://www.bilibili.com/', '-r', '0-' + (MOOV_CHUNK - 1), url],
            cwd: '/tmp',
            stdio: { stdin: 'ignore', stdout: 'pipe', stderr: 'pipe' },
            graceMs: 5000,
          })
        } catch (e) { resolve(null); return }
        const chunks = []
        let total = 0
        if (handle.stdout) {
          handle.stdout.on('data', function (chunk) { chunks.push(chunk); total += chunk.length })
          handle.stdout.on('end', function () {
            const buf = new Uint8Array(total)
            let pos = 0
            for (let i = 0; i < chunks.length; i++) { buf.set(chunks[i], pos); pos += chunks[i].length }
            resolve(buf)
          })
          handle.stdout.on('error', function () { resolve(null) })
        } else {
          resolve(null)
        }
      })
    }

    function cacheMoov(url, bytes) {
      if (!bytes || bytes.length < 1024) return
      moovCache[url] = bytes
      moovOrder.push(url)
      while (moovOrder.length > MOOV_CACHE_MAX) {
        const old = moovOrder.shift()
        delete moovCache[old]
      }
    }

    async function prepareVideo() {
      const j = await fetchRecommend()
      const items = (j && j.data && Array.isArray(j.data.item)) ? j.data.item : []
      if (items.length === 0) return null
      const item = items[Math.floor(Math.random() * items.length)]
      const v = pickFrom([item])
      if (!v) return null
      const playurl = await fetchPlayurl(v.bvid, v.cid, 0)
      if (!playurl) return null
      const dash = await fetchDash(v.bvid, v.cid)
      if (playurl.url) {
        fetchMoovBytes(playurl.url).then(function (bytes) { if (bytes) cacheMoov(playurl.url, bytes) }).catch(function () {})
      }
      return { bvid: v.bvid, cid: v.cid, aid: v.aid, title: v.title, owner: v.owner, view: v.view, pic: v.pic, playurl: playurl, dash: dash }
    }

    async function refillQueue() {
      if (refilling) return
      refilling = true
      try {
        while (videoQueue.length < 10) {
          const p = await prepareVideo()
          if (p) videoQueue.push(p)
          else break
        }
      } catch (e) { console.error('[bili] refill failed:', e) }
      refilling = false
    }

    async function advance(t) {
      if (videoQueue.length === 0) {
        const p = await prepareVideo()
        if (p) videoQueue.push(p)
      }
      const nv = videoQueue.shift()
      if (nv) {
        video = { bvid: nv.bvid, cid: nv.cid, aid: nv.aid, title: nv.title, owner: nv.owner, view: nv.view, pic: nv.pic, turn: t, playurl: nv.playurl, dash: nv.dash }
        lastError = ''
      }
      refillQueue().catch(function () {})
    }

    refillQueue().catch(function () {})

    ctx.on('agent/status', function (payload) {
      if (payload) agentStatus = payload.status
      if (payload && payload.status === 'running') { turn += 1; advance(turn) }
    })

    ctx.on('agent/session-start', function () { turn += 1; advance(turn) })

    const handlers = {}
    handlers['get-status'] = function () {
      return { turn: turn, video: video, hasSessdata: sessdata.length > 0, account: account, error: lastError, agentStatus: agentStatus, dmFont: dmFont, dmDensity: dmDensity, autoPause: autoPause }
    }

    handlers['next'] = async function () {
      turn += 1
      await advance(turn)
      return { turn: turn, video: video, error: lastError, hasSessdata: sessdata.length > 0, account: account, agentStatus: agentStatus, dmFont: dmFont, dmDensity: dmDensity, autoPause: autoPause }
    }

    handlers['login-start'] = async function () {
      try {
        const j = await curlJson(GEN, '')
        if (j && j.code === 0 && j.data && j.data.qrcode_key) {
          loginKey = j.data.qrcode_key
          return { qrcode_url: j.data.url, qrcode_key: j.data.qrcode_key }
        }
        return { error: '生成二维码失败' }
      } catch (e) { return { error: String(e && e.message ? e.message : e) } }
    }

    handlers['login-poll'] = async function () {
      if (!loginKey) return { status: 'expired' }
      try {
        const pr = await pollRaw(loginKey)
        if (!pr || !pr.json || !pr.json.data) return { status: 'waiting' }
        const d = pr.json.data
        if (d.code === 0 && (d.url || pr.cookies['SESSDATA'])) {
          const urlSess = extractParam(d.url, 'SESSDATA')
          const result = await verifyLogin(pr.cookies, urlSess)
          if (result.valid) {
            sessdata = result.sessdata
            biliJct = result.biliJct
            account = { nickname: result.nickname, avatar: result.avatar, level: result.level, mid: result.mid }
            loginKey = ''
            persistLogin()
            return { status: 'success', account: account, hasSessdata: true }
          }
          loginKey = ''
          return { status: 'error', message: '登录态校验失败', detail: 'found=' + (result.found || '无') + ' nav=' + (result.navCode === null || result.navCode === undefined ? '无响应' : result.navCode) }
        }
        if (d.code === 86090) return { status: 'scanned' }
        if (d.code === 86038) { loginKey = ''; return { status: 'expired' } }
        return { status: 'waiting' }
      } catch (e) { return { status: 'waiting' } }
    }

    handlers['logout'] = async function () {
      sessdata = ''
      biliJct = ''
      account = null
      loginKey = ''
      videoQueue = []
      wbiMixinKey = ''
      clearLogin()
      await advance(turn)
      return { ok: true, hasSessdata: false, video: video }
    }

    handlers['set-dmfont'] = function (args) {
      let v = args && typeof args.value === 'number' ? args.value : 1
      if (v < 0.5) v = 0.5
      if (v > 2) v = 2
      dmFont = v
      if (creds) creds.set('bili_dmfont', String(v)).catch(function () {})
      return { ok: true, dmFont: dmFont }
    }

    handlers['set-dmdensity'] = function (args) {
      let v = args && typeof args.value === 'number' ? args.value : 1
      if (v < 0.3) v = 0.3
      if (v > 1) v = 1
      dmDensity = v
      if (creds) creds.set('bili_dmdensity', String(v)).catch(function () {})
      return { ok: true, dmDensity: dmDensity }
    }

    handlers['set-autopause'] = function (args) {
      autoPause = !!(args && args.value)
      if (creds) creds.set('bili_autopause', autoPause ? '1' : '0').catch(function () {})
      return { ok: true, autoPause: autoPause }
    }

    handlers['fav-video'] = async function (args) {
      const aid = args && typeof args.aid === 'number' ? args.aid : 0
      if (!aid) return { error: '缺少 aid' }
      if (!sessdata || !biliJct) return { error: '未登录' }
      const nav = await curlJson(NAV, 'SESSDATA=' + sanitize(sessdata))
      const mid = (nav && nav.data) ? Number(nav.data.mid || 0) : 0
      if (!mid) return { error: '获取用户信息失败' }
      const fl = await curlJson(FAV_FOLDERS + '?up_mid=' + mid, 'SESSDATA=' + sanitize(sessdata))
      const folders = (fl && fl.data && Array.isArray(fl.data.list)) ? fl.data.list : []
      if (folders.length === 0) return { error: '获取收藏夹失败' }
      const folderId = Number(folders[0].id || 0)
      if (!folderId) return { error: '收藏夹无效' }
      const form = 'rid=' + aid + '&type=2&add_media_ids=' + folderId + '&csrf=' + sanitize(biliJct)
      const r = await curlPost(FAV_DEAL, form, 'SESSDATA=' + sanitize(sessdata))
      if (r && r.code === 0) return { ok: true }
      return { error: (r && r.message) ? r.message : '收藏失败' }
    }

    handlers['get-playurl'] = async function (args) {
      const bvid = args && typeof args.bvid === 'string' ? sanitize(args.bvid) : ''
      const cid = args && typeof args.cid === 'number' ? args.cid : 0
      const qn = args && typeof args.qn === 'number' ? args.qn : 0
      if (!bvid || !cid) return { error: '缺少参数' }
      const pu = await fetchPlayurl(bvid, cid, qn)
      if (pu) return pu
      return { error: '获取播放地址失败' }
    }

    handlers['get-dash'] = async function (args) {
      const bvid = args && typeof args.bvid === 'string' ? sanitize(args.bvid) : ''
      const cid = args && typeof args.cid === 'number' ? args.cid : 0
      if (!bvid || !cid) return { error: '缺少参数' }
      const d = await fetchDash(bvid, cid)
      if (d) return d
      return { error: '获取 DASH 地址失败' }
    }

    handlers['get-danmaku'] = async function (args) {
      const cid = args && typeof args.cid === 'number' ? args.cid : 0
      if (!cid) return []
      const bytes = await fetchDmProto(cid)
      if (!bytes || bytes.length < 4) return []
      return parseDmProto(bytes)
    }

    // Client<->Host JSON RPC: the browser half calls GET /bili-api/<method>.
    if (ws) {
      ctx.effect(function () {
        return ws.register({
          kind: 'prefix',
          path: '/bili-api',
          handler: function (req, res) {
            const pathname = String(req.url || '').split('?')[0]
            const method = pathname.split('/').filter(Boolean).pop() || ''
            const q = parseQuery(req.url)
            const args = {}
            for (const k in q) {
              if (k === 'value' || k === 'aid' || k === 'cid' || k === 'qn') args[k] = Number(q[k])
              else args[k] = q[k]
            }
            const fn = handlers[method]
            if (!fn) { res.writeHead(404, { 'Content-Type': 'application/json' }); res.end('{"error":"unknown method"}'); return }
            Promise.resolve()
              .then(function () { return fn(args) })
              .then(function (result) {
                if (res.headersSent) return
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
                res.end(JSON.stringify(result === undefined ? null : result))
              })
              .catch(function (err) {
                if (res.headersSent) return
                res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
                res.end(JSON.stringify({ error: String(err && err.message ? err.message : err) }))
              })
          },
        })
      })
    }
    if (ws && subprocess) {
      ctx.effect(function () {
        return ws.register({
          kind: 'prefix',
          path: '/bili-proxy',
          handler: function (req, res) {
            try {
              const q = parseQuery(req.url)
              const target = q['url'] || ''
              const total = Number(q['size'] || 0)
              const mse = q['mse'] === '1'
              if (!target) { res.writeHead(400); res.end(); return }

              if (!mse) {
                const rh0 = req.headers.range
                if (rh0) {
                  const m0 = /bytes=(\d*)-(\d*)/.exec(rh0)
                  if (m0 && (m0[1] === '' || m0[1] === '0') && m0[2] === '') {
                    const cached = moovCache[target]
                    if (cached && cached.length > 0) {
                      const head = { 'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes', 'Cache-Control': 'public, max-age=600' }
                      if (total > 0) {
                        head['Content-Range'] = 'bytes 0-' + (total - 1) + '/' + total
                        head['Content-Length'] = String(total)
                      }
                      res.writeHead(206, head)
                      res.write(cached)
                      let restHandle = null
                      try {
                        restHandle = subprocess.spawn({
                          argv: ['curl', '-sS', '-m', '900', '-A', UA, '-H', 'Referer: https://www.bilibili.com/', '-r', cached.length + '-', target],
                          cwd: '/tmp',
                          stdio: { stdin: 'ignore', stdout: 'pipe', stderr: 'pipe' },
                          graceMs: 5000,
                        })
                      } catch (e) {}
                      if (restHandle && restHandle.stdout) {
                        restHandle.stdout.on('data', function (chunk) { try { res.write(chunk) } catch (e) {} })
                        restHandle.stdout.on('end', function () { try { res.end() } catch (e) {} })
                        restHandle.stdout.on('error', function () { try { res.destroy() } catch (e) {} })
                      } else {
                        try { res.end() } catch (e) {}
                      }
                      return
                    }
                  }
                }
              }

              const argv = ['curl', '-sS', '-m', '900', '-A', UA, '-H', 'Referer: https://www.bilibili.com/']
              let contentRange = null
              let contentLength = null
              const rh = req.headers.range
              if (rh) {
                const m = /bytes=(\d*)-(\d*)/.exec(rh)
                if (m) {
                  const start = m[1] ? parseInt(m[1], 10) : 0
                  const hasEnd = !!m[2]
                  const end = hasEnd ? parseInt(m[2], 10) : (total > 0 ? total - 1 : -1)
                  argv.push('-r', start + '-' + (hasEnd ? m[2] : ''))
                  if (end >= 0) {
                    contentRange = 'bytes ' + start + '-' + end + '/' + (total || '*')
                    contentLength = String(end - start + 1)
                  }
                }
              }
              argv.push(target)
              const handle = subprocess.spawn({
                argv: argv,
                cwd: '/tmp',
                stdio: { stdin: 'ignore', stdout: 'pipe', stderr: 'pipe' },
                graceMs: 5000,
              })
              if (mse) {
                res.writeHead(200, { 'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes' })
              } else {
                const head = { 'Content-Type': 'video/mp4', 'Accept-Ranges': 'bytes', 'Cache-Control': 'public, max-age=600' }
                if (contentRange) head['Content-Range'] = contentRange
                if (contentLength) head['Content-Length'] = contentLength
                res.writeHead(contentRange ? 206 : 200, head)
              }
              if (handle.stdout) {
                handle.stdout.on('data', function (chunk) { try { res.write(chunk) } catch (e) {} })
                handle.stdout.on('end', function () { try { res.end() } catch (e) {} })
                handle.stdout.on('error', function () { try { res.destroy() } catch (e) {} })
              } else {
                res.end()
              }
            } catch (e) {
              console.error('[bili-proxy] error:', e && e.stack ? e.stack : String(e))
              try {
                if (!res.headersSent) {
                  res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
                  res.end('[bili-proxy] ' + (e && e.message ? e.message : String(e)))
                }
              } catch (e2) {}
            }
          },
        })
      })
    }
}
