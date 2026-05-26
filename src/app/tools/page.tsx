"use client";

import { useState, useEffect, useMemo, useCallback } from "react";

// ─── Shared helpers ────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className="px-2.5 py-1 text-xs border border-border rounded-md hover:border-accent/30 text-text-secondary hover:text-accent transition-colors"
    >
      {copied ? "已复制" : "复制"}
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-medium text-text-primary mb-4">{children}</h2>
  );
}

// ─── 1. JSON Formatter ────────────────────────────────────────────────────────

function JsonFormatter() {
  const [input, setInput] = useState('{"name":"example","version":1,"items":["a","b","c"],"nested":{"key":"value","num":42}}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "无效的 JSON");
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "无效的 JSON");
      setOutput("");
    }
  };

  // Simple syntax highlighting for JSON
  const highlightJson = (json: string) => {
    if (!json) return undefined;
    const escaped = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const highlighted = escaped
      .replace(
        /("(?:[^"\\]|\\.)*")\s*:/g,
        '<span class="text-blue-600 dark:text-blue-400">$1</span>:'
      )
      .replace(
        /:\s*("(?:[^"\\]|\\.)*")/g,
        ': <span class="text-emerald-600 dark:text-emerald-400">$1</span>'
      )
      .replace(
        /:\s*(true|false)/g,
        ': <span class="text-purple-600 dark:text-purple-400">$1</span>'
      )
      .replace(
        /:\s*(null)/g,
        ': <span class="text-red-500">$1</span>'
      )
      .replace(
        /:\s*(-?\d+\.?\d*(?:e[+-]?\d+)?)/gi,
        ': <span class="text-amber-600 dark:text-amber-400">$1</span>'
      );
    return { __html: highlighted };
  };

  return (
    <div className="space-y-4">
      <SectionTitle>JSON 格式化</SectionTitle>
      <textarea
        className="w-full h-40 p-3 font-mono text-sm border border-border rounded-lg bg-surface text-text-primary resize-y focus:outline-none focus:border-accent/50"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="粘贴 JSON..."
      />
      <div className="flex gap-2">
        <button onClick={format} className="px-3 py-1.5 text-sm bg-accent text-white rounded-md hover:bg-accent-hover transition-colors">格式化</button>
        <button onClick={minify} className="px-3 py-1.5 text-sm border border-border rounded-md text-text-secondary hover:border-accent/30 transition-colors">压缩</button>
        {output && <CopyButton text={output} />}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {output && (
        <pre className="p-3 font-mono text-sm border border-border rounded-lg bg-muted overflow-auto max-h-80">
          <code dangerouslySetInnerHTML={highlightJson(output)} />
        </pre>
      )}
    </div>
  );
}

// ─── 2. Base64 Encoder/Decoder ────────────────────────────────────────────────

function Base64Tool() {
  const [input, setInput] = useState("Hello, World! 你好世界");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  const process = () => {
    try {
      if (mode === "encode") {
        // Encode UTF-8 to Base64
        const encoded = btoa(
          encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCharCode(parseInt(p1, 16))
          )
        );
        setOutput(encoded);
      } else {
        // Decode Base64 to UTF-8
        const decoded = decodeURIComponent(
          atob(input)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        setOutput(decoded);
      }
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "处理失败");
      setOutput("");
    }
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <div className="space-y-4">
      <SectionTitle>Base64 编解码</SectionTitle>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setMode("encode")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mode === "encode" ? "bg-accent text-white" : "border border-border text-text-secondary hover:border-accent/30"}`}
        >
          编码
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mode === "decode" ? "bg-accent text-white" : "border border-border text-text-secondary hover:border-accent/30"}`}
        >
          解码
        </button>
      </div>
      <textarea
        className="w-full h-32 p-3 font-mono text-sm border border-border rounded-lg bg-surface text-text-primary resize-y focus:outline-none focus:border-accent/50"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "encode" ? "输入文本..." : "输入 Base64..."}
      />
      <div className="flex gap-2">
        <button onClick={process} className="px-3 py-1.5 text-sm bg-accent text-white rounded-md hover:bg-accent-hover transition-colors">
          {mode === "encode" ? "编码" : "解码"}
        </button>
        <button onClick={swap} className="px-3 py-1.5 text-sm border border-border rounded-md text-text-secondary hover:border-accent/30 transition-colors">交换</button>
        {output && <CopyButton text={output} />}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {output && (
        <textarea
          className="w-full h-32 p-3 font-mono text-sm border border-border rounded-lg bg-muted text-text-primary resize-y"
          value={output}
          readOnly
        />
      )}
    </div>
  );
}

// ─── 3. URL Encoder/Decoder ───────────────────────────────────────────────────

function UrlCodec() {
  const [input, setInput] = useState("https://example.com/path?q=你好&lang=zh cn");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  const process = () => {
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "处理失败");
      setOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <SectionTitle>URL 编解码</SectionTitle>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => { setMode("encode"); setOutput(""); }}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mode === "encode" ? "bg-accent text-white" : "border border-border text-text-secondary hover:border-accent/30"}`}
        >
          编码
        </button>
        <button
          onClick={() => { setMode("decode"); setOutput(""); }}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${mode === "decode" ? "bg-accent text-white" : "border border-border text-text-secondary hover:border-accent/30"}`}
        >
          解码
        </button>
      </div>
      <input
        className="w-full p-3 font-mono text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-accent/50"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入 URL 或编码后的文本..."
      />
      <div className="flex gap-2">
        <button onClick={process} className="px-3 py-1.5 text-sm bg-accent text-white rounded-md hover:bg-accent-hover transition-colors">
          {mode === "encode" ? "编码" : "解码"}
        </button>
        {output && <CopyButton text={output} />}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {output && (
        <div className="p-3 font-mono text-sm border border-border rounded-lg bg-muted break-all">{output}</div>
      )}
    </div>
  );
}

// ─── 4. Hash Generator ────────────────────────────────────────────────────────

function HashGenerator() {
  const [input, setInput] = useState("Hello, World!");
  const [hashes, setHashes] = useState<{ md5: string; sha1: string; sha256: string } | null>(null);

  // Simple MD5 implementation (RFC 1321)
  const md5 = useCallback((str: string): string => {
    function md5cycle(x: number[], k: number[]) {
      let a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
    }
    function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
      a = add32(add32(a, q), add32(x, t));
      return add32((a << s) | (a >>> (32 - s)), b);
    }
    function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
    function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | ~d), a, b, x, s, t); }
    function md5blk(s: string) {
      const md5blks: number[] = [];
      for (let i = 0; i < 64; i += 4) {
        md5blks[i >> 2] =
          s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) +
          (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
    }
    function add32(a: number, b: number) { return (a + b) & 0xffffffff; }
    function rhex(n: number) {
      const hex_chr = "0123456789abcdef";
      let s = "";
      for (let j = 0; j < 4; j++)
        s += hex_chr.charAt((n >> (j * 8 + 4)) & 0x0f) + hex_chr.charAt((n >> (j * 8)) & 0x0f);
      return s;
    }

    const n = str.length;
    let state = [1732584193, -271733879, -1732584194, 271733878];
    let i: number;
    for (i = 64; i <= n; i += 64) {
      md5cycle(state, md5blk(str.substring(i - 64, i)));
    }
    str = str.substring(i - 64);
    const tail = new Array(16).fill(0);
    for (i = 0; i < str.length; i++)
      tail[i >> 2] |= str.charCodeAt(i) << (i % 4 << 3);
    tail[i >> 2] |= 0x80 << (i % 4 << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return rhex(state[0]) + rhex(state[1]) + rhex(state[2]) + rhex(state[3]);
  }, []);

  const generate = async () => {
    const md5Hash = md5(input);

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const sha1Buffer = await crypto.subtle.digest("SHA-1", data);
    const sha1Hash = Array.from(new Uint8Array(sha1Buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const sha256Buffer = await crypto.subtle.digest("SHA-256", data);
    const sha256Hash = Array.from(new Uint8Array(sha256Buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    setHashes({ md5: md5Hash, sha1: sha1Hash, sha256: sha256Hash });
  };

  useEffect(() => {
    generate();
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = hashes
    ? [
        { label: "MD5", value: hashes.md5 },
        { label: "SHA-1", value: hashes.sha1 },
        { label: "SHA-256", value: hashes.sha256 },
      ]
    : [];

  return (
    <div className="space-y-4">
      <SectionTitle>哈希生成器</SectionTitle>
      <textarea
        className="w-full h-24 p-3 font-mono text-sm border border-border rounded-lg bg-surface text-text-primary resize-y focus:outline-none focus:border-accent/50"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入文本..."
      />
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <span className="text-xs text-text-tertiary w-16 shrink-0">{r.label}</span>
            <code className="flex-1 p-2 font-mono text-xs border border-border rounded-md bg-muted break-all text-text-primary">{r.value}</code>
            <CopyButton text={r.value} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 5. Color Picker ──────────────────────────────────────────────────────────

function ColorPicker() {
  const [hex, setHex] = useState("#1e3a5f");
  const [rgb, setRgb] = useState({ r: 30, g: 58, b: 95 });
  const [hsl, setHsl] = useState({ h: 214, s: 52, l: 25 });

  const hexToRgb = (h: string): { r: number; g: number; b: number } | null => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360; s /= 100; l /= 100;
    if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v }; }
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return {
      r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    };
  };

  const updateFromHex = (v: string) => {
    setHex(v);
    const c = hexToRgb(v);
    if (c) { setRgb(c); setHsl(rgbToHsl(c.r, c.g, c.b)); }
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    const clamped = { r: Math.max(0, Math.min(255, r)), g: Math.max(0, Math.min(255, g)), b: Math.max(0, Math.min(255, b)) };
    setRgb(clamped);
    setHex(rgbToHex(clamped.r, clamped.g, clamped.b));
    setHsl(rgbToHsl(clamped.r, clamped.g, clamped.b));
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    const clamped = { h: Math.max(0, Math.min(360, h)), s: Math.max(0, Math.min(100, s)), l: Math.max(0, Math.min(100, l)) };
    setHsl(clamped);
    const c = hslToRgb(clamped.h, clamped.s, clamped.l);
    setRgb(c);
    setHex(rgbToHex(c.r, c.g, c.b));
  };

  return (
    <div className="space-y-4">
      <SectionTitle>颜色选择器</SectionTitle>
      <div className="flex gap-4 items-start">
        <div className="flex flex-col items-center gap-2">
          <input
            type="color"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="w-20 h-20 border border-border rounded-lg cursor-pointer"
          />
          <div className="w-20 h-6 rounded border border-border text-center text-xs font-mono leading-6 text-text-secondary">{hex}</div>
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <label className="text-xs text-text-tertiary block mb-1">HEX</label>
            <input
              className="w-full p-2 font-mono text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-text-tertiary block mb-1">R</label>
              <input type="number" min={0} max={255} className="w-full p-2 font-mono text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50" value={rgb.r} onChange={(e) => updateFromRgb(+e.target.value, rgb.g, rgb.b)} />
            </div>
            <div>
              <label className="text-xs text-text-tertiary block mb-1">G</label>
              <input type="number" min={0} max={255} className="w-full p-2 font-mono text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50" value={rgb.g} onChange={(e) => updateFromRgb(rgb.r, +e.target.value, rgb.b)} />
            </div>
            <div>
              <label className="text-xs text-text-tertiary block mb-1">B</label>
              <input type="number" min={0} max={255} className="w-full p-2 font-mono text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50" value={rgb.b} onChange={(e) => updateFromRgb(rgb.r, rgb.g, +e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-text-tertiary block mb-1">H</label>
              <input type="number" min={0} max={360} className="w-full p-2 font-mono text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50" value={hsl.h} onChange={(e) => updateFromHsl(+e.target.value, hsl.s, hsl.l)} />
            </div>
            <div>
              <label className="text-xs text-text-tertiary block mb-1">S%</label>
              <input type="number" min={0} max={100} className="w-full p-2 font-mono text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50" value={hsl.s} onChange={(e) => updateFromHsl(hsl.h, +e.target.value, hsl.l)} />
            </div>
            <div>
              <label className="text-xs text-text-tertiary block mb-1">L%</label>
              <input type="number" min={0} max={100} className="w-full p-2 font-mono text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50" value={hsl.l} onChange={(e) => updateFromHsl(hsl.h, hsl.s, +e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            <CopyButton text={hex} />
            <CopyButton text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
            <CopyButton text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 6. QR Code Generator ─────────────────────────────────────────────────────

function QrCodeGenerator() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(200);

  const qrMatrix = useMemo(() => {
    if (!text) return null;
    // Generate a deterministic pattern based on input text
    // This creates a visually recognizable QR-like pattern, not a scannable QR code
    const modules = 21; // Version 1 QR code size
    const matrix: boolean[][] = Array.from({ length: modules }, () => Array(modules).fill(false));

    // Simple hash function for deterministic pattern
    const hash = (str: string, seed: number) => {
      let h = seed;
      for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h + str.charCodeAt(i)) | 0;
      }
      return Math.abs(h);
    };

    // Finder patterns (top-left, top-right, bottom-left)
    const drawFinder = (row: number, col: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          matrix[row + r][col + c] = isOuter || isInner;
        }
      }
    };
    drawFinder(0, 0);
    drawFinder(0, modules - 7);
    drawFinder(modules - 7, 0);

    // Timing patterns
    for (let i = 8; i < modules - 8; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }

    // Data area - fill based on text hash
    const h = hash(text, 42);
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        // Skip finder and timing pattern areas
        const inFinder =
          (r < 9 && c < 9) || (r < 9 && c >= modules - 8) || (r >= modules - 8 && c < 9);
        const inTiming = r === 6 || c === 6;
        if (!inFinder && !inTiming) {
          const cellHash = hash(text, r * modules + c + h);
          matrix[r][c] = cellHash % 3 !== 0;
        }
      }
    }

    return matrix;
  }, [text]);

  const renderQr = () => {
    if (!qrMatrix) return null;
    const modules = qrMatrix.length;
    const cellSize = size / modules;
    const rects: React.ReactNode[] = [];
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        if (qrMatrix[r][c]) {
          rects.push(
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.5}
              height={cellSize + 0.5}
              fill="currentColor"
            />
          );
        }
      }
    }
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="text-text-primary">
        {rects}
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      <SectionTitle>QR 码生成器</SectionTitle>
      <input
        className="w-full p-3 text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-accent/50"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入文本或 URL..."
      />
      <div className="flex items-center gap-3">
        <label className="text-xs text-text-tertiary">尺寸</label>
        <input
          type="range"
          min={100}
          max={400}
          step={10}
          value={size}
          onChange={(e) => setSize(+e.target.value)}
          className="flex-1"
        />
        <span className="text-xs text-text-secondary w-12">{size}px</span>
      </div>
      {text && (
        <div className="flex justify-center p-6 bg-white rounded-lg border border-border">
          {renderQr()}
        </div>
      )}
      <p className="text-xs text-text-tertiary">注意：此为可视化模式 QR 码，非标准 QR 编码，不可扫描。</p>
    </div>
  );
}

// ─── 7. UUID Generator ────────────────────────────────────────────────────────

function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);

  const generate = () => {
    const arr: string[] = [];
    for (let i = 0; i < count; i++) {
      arr.push(crypto.randomUUID());
    }
    setUuids(arr);
  };

  useEffect(() => {
    generate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <SectionTitle>UUID 生成器</SectionTitle>
      <div className="flex items-center gap-3">
        <label className="text-xs text-text-tertiary">数量</label>
        <input
          type="number"
          min={1}
          max={100}
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(100, +e.target.value)))}
          className="w-20 p-2 font-mono text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50"
        />
        <button onClick={generate} className="px-3 py-1.5 text-sm bg-accent text-white rounded-md hover:bg-accent-hover transition-colors">
          生成
        </button>
        {uuids.length > 0 && <CopyButton text={uuids.join("\n")} />}
      </div>
      <div className="space-y-1">
        {uuids.map((u, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-text-tertiary w-6">{i + 1}.</span>
            <code className="font-mono text-sm text-text-primary">{u}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 8. Timestamp Converter ───────────────────────────────────────────────────

function TimestampConverter() {
  const [timestamp, setTimestamp] = useState(Math.floor(Date.now() / 1000).toString());
  const [humanDate, setHumanDate] = useState("");
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ts = parseInt(timestamp);
    if (!isNaN(ts) && ts > 0) {
      // Auto-detect seconds vs milliseconds
      const ms = ts > 1e12 ? ts : ts * 1000;
      const d = new Date(ms);
      setHumanDate(d.toLocaleString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    }
  }, [timestamp]);

  const toTimestamp = () => {
    const d = new Date(humanDate);
    if (!isNaN(d.getTime())) {
      setTimestamp(Math.floor(d.getTime() / 1000).toString());
    }
  };

  const formats = useMemo(() => {
    const ts = parseInt(timestamp);
    if (isNaN(ts)) return [];
    const ms = ts > 1e12 ? ts : ts * 1000;
    const d = new Date(ms);
    return [
      { label: "Unix 时间戳 (秒)", value: Math.floor(ms / 1000).toString() },
      { label: "Unix 时间戳 (毫秒)", value: ms.toString() },
      { label: "ISO 8601", value: d.toISOString() },
      { label: "本地时间", value: d.toLocaleString("zh-CN") },
      { label: "UTC", value: d.toUTCString() },
    ];
  }, [timestamp]);

  return (
    <div className="space-y-4">
      <SectionTitle>时间戳转换</SectionTitle>
      <div className="p-3 bg-muted rounded-lg text-center">
        <span className="text-xs text-text-tertiary">当前时间戳</span>
        <div className="font-mono text-lg text-text-primary">{now}</div>
      </div>
      <div>
        <label className="text-xs text-text-tertiary block mb-1">时间戳</label>
        <input
          className="w-full p-3 font-mono text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-accent/50"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
          placeholder="Unix 时间戳..."
        />
      </div>
      <div>
        <label className="text-xs text-text-tertiary block mb-1">日期时间</label>
        <div className="flex gap-2">
          <input
            type="datetime-local"
            className="flex-1 p-3 font-mono text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-accent/50"
            value={humanDate ? new Date(parseInt(timestamp) > 1e12 ? parseInt(timestamp) : parseInt(timestamp) * 1000).toISOString().slice(0, 16) : ""}
            onChange={(e) => {
              const d = new Date(e.target.value);
              if (!isNaN(d.getTime())) setTimestamp(Math.floor(d.getTime() / 1000).toString());
            }}
          />
        </div>
      </div>
      {formats.length > 0 && (
        <div className="space-y-1">
          {formats.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <span className="text-xs text-text-tertiary w-28 shrink-0">{f.label}</span>
              <code className="flex-1 font-mono text-xs text-text-primary truncate">{f.value}</code>
              <CopyButton text={f.value} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 9. Regex Tester ──────────────────────────────────────────────────────────

function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [testStr, setTestStr] = useState("联系我们: user@example.com 或 admin@test.org，电话 13800138000");
  const [error, setError] = useState("");

  const result = useMemo(() => {
    if (!pattern || !testStr) return null;
    try {
      const regex = new RegExp(pattern, flags);
      const matches: { match: string; index: number; groups?: Record<string, string> }[] = [];
      let m: RegExpExecArray | null;

      if (flags.includes("g")) {
        while ((m = regex.exec(testStr)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: m.groups ? { ...m.groups } : undefined });
          if (!m[0]) regex.lastIndex++;
        }
      } else {
        m = regex.exec(testStr);
        if (m) matches.push({ match: m[0], index: m.index, groups: m.groups ? { ...m.groups } : undefined });
      }
      setError("");
      return matches;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "无效的正则表达式");
      return null;
    }
  }, [pattern, flags, testStr]);

  const highlightMatches = () => {
    if (!result || result.length === 0) return testStr;
    let highlighted = "";
    let lastIndex = 0;
    for (const m of result) {
      highlighted += testStr.slice(lastIndex, m.index);
      highlighted += `<mark class="bg-amber-200 dark:bg-amber-800 text-text-primary rounded px-0.5">${testStr.slice(m.index, m.index + m.match.length)}</mark>`;
      lastIndex = m.index + m.match.length;
    }
    highlighted += testStr.slice(lastIndex);
    return highlighted;
  };

  return (
    <div className="space-y-4">
      <SectionTitle>正则表达式测试</SectionTitle>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center border border-border rounded-lg bg-surface overflow-hidden">
          <span className="text-text-tertiary pl-3 font-mono text-sm">/</span>
          <input
            className="flex-1 p-2 font-mono text-sm bg-transparent text-text-primary focus:outline-none"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="正则表达式..."
          />
          <span className="text-text-tertiary font-mono text-sm">/</span>
          <input
            className="w-12 p-2 font-mono text-sm bg-transparent text-text-primary focus:outline-none text-center"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <textarea
        className="w-full h-32 p-3 font-mono text-sm border border-border rounded-lg bg-surface text-text-primary resize-y focus:outline-none focus:border-accent/50"
        value={testStr}
        onChange={(e) => setTestStr(e.target.value)}
        placeholder="测试文本..."
      />
      <div>
        <h3 className="text-xs text-text-tertiary mb-2">匹配结果</h3>
        <div
          className="p-3 text-sm border border-border rounded-lg bg-muted whitespace-pre-wrap break-all"
          dangerouslySetInnerHTML={{ __html: highlightMatches() }}
        />
      </div>
      {result && result.length > 0 && (
        <div>
          <h3 className="text-xs text-text-tertiary mb-2">找到 {result.length} 个匹配</h3>
          <div className="space-y-1">
            {result.map((m, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="text-xs text-text-tertiary w-6">#{i + 1}</span>
                <code className="font-mono text-text-primary bg-muted px-2 py-0.5 rounded">{m.match}</code>
                <span className="text-xs text-text-tertiary">位置: {m.index}</span>
                {m.groups && (
                  <span className="text-xs text-text-secondary">
                    捕获组: {Object.entries(m.groups).map(([k, v]) => `${k}="${v}"`).join(", ")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 10. Diff Viewer ──────────────────────────────────────────────────────────

function DiffViewer() {
  const [textA, setTextA] = useState("function hello() {\n  console.log('hello');\n  return true;\n}");
  const [textB, setTextB] = useState("function hello(name) {\n  console.log('hello ' + name);\n  console.log('done');\n  return true;\n}");

  const diff = useMemo(() => {
    const linesA = textA.split("\n");
    const linesB = textB.split("\n");
    const result: { type: "same" | "added" | "removed"; line: string; lineNumA?: number; lineNumB?: number }[] = [];

    // Simple LCS-based diff
    const m = linesA.length;
    const n = linesB.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = linesA[i - 1] === linesB[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }

    const backtrack = (i: number, j: number): { type: "same" | "added" | "removed"; line: string; aIdx: number; bIdx: number }[] => {
      if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
        return [...backtrack(i - 1, j - 1), { type: "same", line: linesA[i - 1], aIdx: i, bIdx: j }];
      }
      if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        return [...backtrack(i, j - 1), { type: "added", line: linesB[j - 1], aIdx: i, bIdx: j }];
      }
      if (i > 0) {
        return [...backtrack(i - 1, j), { type: "removed", line: linesA[i - 1], aIdx: i, bIdx: j }];
      }
      return [];
    };

    const raw = backtrack(m, n);
    return raw.map((r) => ({
      type: r.type,
      line: r.line,
      lineNumA: r.type !== "added" ? r.aIdx : undefined,
      lineNumB: r.type !== "removed" ? r.bIdx : undefined,
    }));
  }, [textA, textB]);

  return (
    <div className="space-y-4">
      <SectionTitle>差异对比</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-text-tertiary block mb-1">原始文本</label>
          <textarea
            className="w-full h-40 p-3 font-mono text-sm border border-border rounded-lg bg-surface text-text-primary resize-y focus:outline-none focus:border-accent/50"
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-text-tertiary block mb-1">修改后文本</label>
          <textarea
            className="w-full h-40 p-3 font-mono text-sm border border-border rounded-lg bg-surface text-text-primary resize-y focus:outline-none focus:border-accent/50"
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
          />
        </div>
      </div>
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="p-2 bg-muted text-xs text-text-tertiary font-mono flex gap-4">
          <span className="text-red-500">- {diff.filter((d) => d.type === "removed").length} 行删除</span>
          <span className="text-green-600">+ {diff.filter((d) => d.type === "added").length} 行添加</span>
        </div>
        <div className="font-mono text-sm">
          {diff.map((d, i) => (
            <div
              key={i}
              className={`flex ${
                d.type === "added"
                  ? "bg-green-50 dark:bg-green-950/30"
                  : d.type === "removed"
                  ? "bg-red-50 dark:bg-red-950/30"
                  : ""
              }`}
            >
              <span className="w-10 px-2 py-0.5 text-right text-xs text-text-tertiary shrink-0 select-none border-r border-border-subtle">
                {d.lineNumA ?? ""}
              </span>
              <span className="w-10 px-2 py-0.5 text-right text-xs text-text-tertiary shrink-0 select-none border-r border-border-subtle">
                {d.lineNumB ?? ""}
              </span>
              <span className="w-6 px-1 py-0.5 text-center shrink-0 select-none">
                {d.type === "added" ? (
                  <span className="text-green-600">+</span>
                ) : d.type === "removed" ? (
                  <span className="text-red-500">-</span>
                ) : (
                  <span className="text-text-tertiary"> </span>
                )}
              </span>
              <span className="px-2 py-0.5 whitespace-pre overflow-x-auto">{d.line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 11. Markdown Preview ─────────────────────────────────────────────────────

function MarkdownPreview() {
  const [md, setMd] = useState(
`# 标题一

## 标题二

这是一段 **加粗** 和 *斜体* 文本。

- 列表项 1
- 列表项 2
- 列表项 3

\`行内代码\` 示例。

> 引用文本

1. 有序列表
2. 第二项

[链接文字](https://example.com)

---

段落结尾。`
  );

  const renderMarkdown = (text: string): string => {
    let html = text;
    // Escape HTML
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded-md font-mono text-sm my-2 overflow-auto"><code>$1</code></pre>');
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
    // Headings
    html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-text-primary mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-text-primary mt-5 mb-2">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-text-primary mt-6 mb-3">$1</h1>');
    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr class="border-border my-4">');
    // Bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-text-primary">$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-accent hover:text-accent-hover underline" target="_blank" rel="noopener noreferrer">$1</a>');
    // Blockquote
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-3 border-accent pl-3 text-text-secondary my-2">$1</blockquote>');
    // Unordered list
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-text-secondary">$1</li>');
    // Ordered list
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-text-secondary">$1</li>');
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="text-text-secondary leading-relaxed my-2">');
    html = '<p class="text-text-secondary leading-relaxed my-2">' + html + '</p>';
    // Clean up empty paragraphs
    html = html.replace(/<p[^>]*><\/p>/g, "");
    // Line breaks within paragraphs
    html = html.replace(/([^>])\n([^<])/g, "$1<br>$2");
    return html;
  };

  return (
    <div className="space-y-4">
      <SectionTitle>Markdown 预览</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-text-tertiary block mb-1">Markdown 源码</label>
          <textarea
            className="w-full h-96 p-3 font-mono text-sm border border-border rounded-lg bg-surface text-text-primary resize-y focus:outline-none focus:border-accent/50"
            value={md}
            onChange={(e) => setMd(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-text-tertiary block mb-1">预览</label>
          <div
            className="w-full h-96 p-4 border border-border rounded-lg bg-muted overflow-auto prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(md) }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── 12. CSS Unit Converter ───────────────────────────────────────────────────

function CssUnitConverter() {
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [viewportWidth, setViewportWidth] = useState(1920);
  const [value, setValue] = useState(16);
  const [unit, setUnit] = useState<"px" | "rem" | "em" | "vw" | "vh" | "%">("px");

  const conversions = useMemo(() => {
    let px: number;
    switch (unit) {
      case "px": px = value; break;
      case "rem": px = value * baseFontSize; break;
      case "em": px = value * baseFontSize; break;
      case "vw": px = (value / 100) * viewportWidth; break;
      case "vh": px = (value / 100) * viewportWidth * 0.5625; break; // assume 16:9
      case "%": px = (value / 100) * baseFontSize; break;
      default: px = value;
    }
    return {
      px: +px.toFixed(4),
      rem: +(px / baseFontSize).toFixed(4),
      em: +(px / baseFontSize).toFixed(4),
      vw: +((px / viewportWidth) * 100).toFixed(4),
      vh: +((px / (viewportWidth * 0.5625)) * 100).toFixed(4),
      "%": +((px / baseFontSize) * 100).toFixed(4),
    };
  }, [value, unit, baseFontSize, viewportWidth]);

  return (
    <div className="space-y-4">
      <SectionTitle>CSS 单位转换</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-text-tertiary block mb-1">基础字体大小 (px)</label>
          <input
            type="number"
            value={baseFontSize}
            onChange={(e) => setBaseFontSize(+e.target.value || 16)}
            className="w-full p-2 font-mono text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50"
          />
        </div>
        <div>
          <label className="text-xs text-text-tertiary block mb-1">视口宽度 (px)</label>
          <input
            type="number"
            value={viewportWidth}
            onChange={(e) => setViewportWidth(+e.target.value || 1920)}
            className="w-full p-2 font-mono text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50"
          />
        </div>
      </div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs text-text-tertiary block mb-1">输入值</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(+e.target.value || 0)}
            className="w-full p-2 font-mono text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50"
          />
        </div>
        <div>
          <label className="text-xs text-text-tertiary block mb-1">单位</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as typeof unit)}
            className="p-2 font-mono text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50"
          >
            {(["px", "rem", "em", "vw", "vh", "%"] as const).map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(conversions).map(([u, v]) => (
          <div key={u} className="p-3 border border-border rounded-lg bg-muted">
            <div className="text-xs text-text-tertiary mb-1">{u}</div>
            <div className="font-mono text-sm text-text-primary">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 13. Lorem Ipsum Generator ────────────────────────────────────────────────

function LoremGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState("");

  const sentences = [
    "技术的发展日新月异，每一个创新都在改变着我们的生活方式。",
    "在编程的世界里，简洁的代码往往蕴含着深刻的智慧。",
    "硬件与软件的结合，创造出无限的可能性。",
    "学习是一个持续的过程，永远没有终点。",
    "好的设计不仅是外观，更是功能与体验的完美统一。",
    "在嵌入式系统中，每一字节的内存都弥足珍贵。",
    "开源社区的力量，推动着技术的不断进步。",
    "调试是程序员最常面对的挑战，也是成长最快的时刻。",
    "文档是代码的灵魂，好的文档让项目更加专业。",
    "性能优化需要深入理解底层原理，而非表面的技巧。",
    "版本控制是团队协作的基石，Git 改变了开发的方式。",
    "测试驱动开发不仅是一种方法，更是一种思维方式。",
    "在微控制器的世界里，资源受限反而激发了创造力。",
    "良好的架构设计是项目成功的前提条件。",
    "代码审查是提升团队代码质量的有效手段。",
    "持续集成和持续部署提高了软件交付的效率。",
    "在选择技术栈时，需要综合考虑团队能力和项目需求。",
    "错误处理是健壮程序的重要组成部分。",
    "安全性不应是事后考虑，而应融入设计的每个环节。",
    "用户体验是产品成功的关键因素之一。",
    "算法是计算机科学的核心，决定了程序的效率。",
    "数据结构的选择直接影响程序的性能表现。",
    "在分布式系统中，一致性与可用性需要权衡。",
    "容器化技术简化了应用的部署和运维流程。",
    "设计模式是解决常见问题的经典方案。",
    "在实时系统中，确定性比平均速度更重要。",
    "代码的可读性往往比性能优化更值得投入。",
    "在物联网时代，安全和隐私面临新的挑战。",
    "自动化测试是保证软件质量的重要手段。",
    "技术债务如果不及时偿还，会拖慢整个项目的进度。",
  ];

  const generate = () => {
    const result: string[] = [];
    for (let p = 0; p < paragraphs; p++) {
      const sentCount = 4 + Math.floor(Math.random() * 3);
      const para: string[] = [];
      for (let s = 0; s < sentCount; s++) {
        para.push(sentences[Math.floor(Math.random() * sentences.length)]);
      }
      result.push(para.join(""));
    }
    setOutput(result.join("\n\n"));
  };

  useEffect(() => {
    generate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <SectionTitle>中文 Lorem Ipsum</SectionTitle>
      <div className="flex items-center gap-3">
        <label className="text-xs text-text-tertiary">段落数</label>
        <input
          type="number"
          min={1}
          max={20}
          value={paragraphs}
          onChange={(e) => setParagraphs(Math.max(1, Math.min(20, +e.target.value)))}
          className="w-20 p-2 font-mono text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50"
        />
        <button onClick={generate} className="px-3 py-1.5 text-sm bg-accent text-white rounded-md hover:bg-accent-hover transition-colors">生成</button>
        {output && <CopyButton text={output} />}
      </div>
      {output && (
        <div className="p-4 text-sm border border-border rounded-lg bg-muted text-text-secondary leading-relaxed whitespace-pre-wrap">
          {output}
        </div>
      )}
    </div>
  );
}

// ─── 14. Password Generator ───────────────────────────────────────────────────

function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    let chars = "";
    if (useUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (useDigits) chars += "0123456789";
    if (useSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) { setPassword(""); return; }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    let result = "";
    for (let i = 0; i < length; i++) result += chars[arr[i] % chars.length];
    setPassword(result);
  }, [length, useUpper, useLower, useDigits, useSymbols]);

  useEffect(() => { generate(); }, [generate]);

  const strength = useMemo(() => {
    if (!password) return { level: 0, label: "无", color: "text-text-tertiary" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (score <= 2) return { level: 1, label: "弱", color: "text-red-500" };
    if (score <= 4) return { level: 2, label: "中", color: "text-amber-500" };
    if (score <= 5) return { level: 3, label: "强", color: "text-green-500" };
    return { level: 4, label: "极强", color: "text-emerald-500" };
  }, [password]);

  return (
    <div className="space-y-4">
      <SectionTitle>密码生成器</SectionTitle>
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <code className="font-mono text-lg text-text-primary break-all">{password || "请选择字符集"}</code>
          {password && <CopyButton text={password} />}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-tertiary">强度:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`h-1.5 w-8 rounded-full ${i <= strength.level ? "bg-current" : "bg-border"}`} />
            ))}
          </div>
          <span className={`text-xs font-medium ${strength.color}`}>{strength.label}</span>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-text-tertiary">长度</label>
          <span className="text-xs font-mono text-text-secondary">{length}</span>
        </div>
        <input
          type="range"
          min={4}
          max={64}
          value={length}
          onChange={(e) => setLength(+e.target.value)}
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "大写字母 A-Z", checked: useUpper, set: setUseUpper },
          { label: "小写字母 a-z", checked: useLower, set: setUseLower },
          { label: "数字 0-9", checked: useDigits, set: setUseDigits },
          { label: "符号 !@#$...", checked: useSymbols, set: setUseSymbols },
        ].map((opt) => (
          <label key={opt.label} className="flex items-center gap-2 p-2 border border-border rounded-md cursor-pointer hover:border-accent/30 transition-colors">
            <input
              type="checkbox"
              checked={opt.checked}
              onChange={(e) => opt.set(e.target.checked)}
              className="accent-accent"
            />
            <span className="text-sm text-text-secondary">{opt.label}</span>
          </label>
        ))}
      </div>
      <button onClick={generate} className="px-3 py-1.5 text-sm bg-accent text-white rounded-md hover:bg-accent-hover transition-colors">
        重新生成
      </button>
    </div>
  );
}

// ─── 15. IP Info Lookup ───────────────────────────────────────────────────────

function IpLookup() {
  const [ip, setIp] = useState("");
  const [info, setInfo] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const lookup = async (targetIp?: string) => {
    const query = targetIp || ip;
    setLoading(true);
    setError("");
    setInfo(null);
    try {
      const url = query ? `http://ip-api.com/json/${query}?lang=zh-CN` : "http://ip-api.com/json/?lang=zh-CN";
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "fail") {
        setError(data.message || "查询失败");
      } else {
        setInfo({
          "IP": data.query,
          "国家": data.country,
          "地区": data.regionName,
          "城市": data.city,
          "ISP": data.isp,
          "组织": data.org,
          "AS": data.as,
          "经纬度": `${data.lat}, ${data.lon}`,
          "时区": data.timezone,
        });
      }
    } catch {
      setError("网络请求失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <SectionTitle>IP 信息查询</SectionTitle>
      <div className="flex gap-2">
        <input
          className="flex-1 p-3 font-mono text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-accent/50"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="输入 IP 地址 (留空查询本机)..."
          onKeyDown={(e) => e.key === "Enter" && lookup()}
        />
        <button
          onClick={() => lookup()}
          disabled={loading}
          className="px-4 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {loading ? "查询中..." : "查询"}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {info && (
        <div className="border border-border rounded-lg overflow-hidden">
          {Object.entries(info).map(([key, val]) => (
            <div key={key} className="flex border-b border-border last:border-0">
              <span className="w-20 p-2.5 text-xs text-text-tertiary bg-muted shrink-0">{key}</span>
              <span className="p-2.5 text-sm text-text-primary font-mono">{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 16. User-Agent Parser ────────────────────────────────────────────────────

function UaParser() {
  const [ua, setUa] = useState(typeof navigator !== "undefined" ? navigator.userAgent : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

  const parsed = useMemo(() => {
    if (!ua) return null;
    const result: Record<string, string> = {};

    // Browser
    const browserPatterns: [RegExp, string][] = [
      [/Edg\/([\d.]+)/, "Edge"],
      [/OPR\/([\d.]+)/, "Opera"],
      [/Vivaldi\/([\d.]+)/, "Vivaldi"],
      [/Brave\/([\d.]+)/, "Brave"],
      [/Chrome\/([\d.]+)/, "Chrome"],
      [/Firefox\/([\d.]+)/, "Firefox"],
      [/Safari\/([\d.]+)/, "Safari"],
      [/MSIE ([\d.]+)/, "Internet Explorer"],
      [/Trident.*rv:([\d.]+)/, "Internet Explorer"],
    ];
    for (const [re, name] of browserPatterns) {
      const m = ua.match(re);
      if (m) { result["浏览器"] = `${name} ${m[1]}`; break; }
    }

    // OS
    const osPatterns: [RegExp, string][] = [
      [/Windows NT 10\.0/, "Windows 10/11"],
      [/Windows NT 6\.3/, "Windows 8.1"],
      [/Windows NT 6\.2/, "Windows 8"],
      [/Windows NT 6\.1/, "Windows 7"],
      [/Mac OS X ([\d_]+)/, "macOS"],
      [/Android ([\d.]+)/, "Android"],
      [/iPhone OS ([\d_]+)/, "iOS (iPhone)"],
      [/iPad.*OS ([\d_]+)/, "iOS (iPad)"],
      [/Linux/, "Linux"],
      [/CrOS/, "Chrome OS"],
    ];
    for (const [re, name] of osPatterns) {
      const m = ua.match(re);
      if (m) { result["操作系统"] = m[1] ? `${name} (${m[1].replace(/_/g, ".")})` : name; break; }
    }

    // Device
    if (/Mobile|Android.*Mobile|iPhone/.test(ua)) result["设备类型"] = "手机";
    else if (/iPad|Android(?!.*Mobile)/.test(ua)) result["设备类型"] = "平板";
    else result["设备类型"] = "桌面";

    // Engine
    if (/Gecko\//.test(ua)) result["渲染引擎"] = "Gecko";
    else if (/AppleWebKit\//.test(ua)) result["渲染引擎"] = "WebKit/Blink";
    else if (/Trident\//.test(ua)) result["渲染引擎"] = "Trident";

    return result;
  }, [ua]);

  return (
    <div className="space-y-4">
      <SectionTitle>User-Agent 解析</SectionTitle>
      <textarea
        className="w-full h-24 p-3 font-mono text-xs border border-border rounded-lg bg-surface text-text-primary resize-y focus:outline-none focus:border-accent/50"
        value={ua}
        onChange={(e) => setUa(e.target.value)}
        placeholder="粘贴 User-Agent 字符串..."
      />
      <button
        onClick={() => setUa(typeof navigator !== "undefined" ? navigator.userAgent : "")}
        className="px-3 py-1.5 text-xs border border-border rounded-md text-text-secondary hover:border-accent/30 transition-colors"
      >
        使用当前浏览器
      </button>
      {parsed && Object.keys(parsed).length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          {Object.entries(parsed).map(([key, val]) => (
            <div key={key} className="flex border-b border-border last:border-0">
              <span className="w-20 p-2.5 text-xs text-text-tertiary bg-muted shrink-0">{key}</span>
              <span className="p-2.5 text-sm text-text-primary">{val}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-text-tertiary">UA: {ua}</p>
    </div>
  );
}

// ─── 17. HTTP Status Reference ────────────────────────────────────────────────

function HttpStatusRef() {
  const [search, setSearch] = useState("");

  const codes = [
    { code: "100", desc: "Continue", detail: "继续。客户端应继续发送请求。" },
    { code: "101", desc: "Switching Protocols", detail: "切换协议。服务器同意切换协议。" },
    { code: "200", desc: "OK", detail: "请求成功。GET 返回资源，POST 返回结果。" },
    { code: "201", desc: "Created", detail: "已创建。请求成功并创建了新资源。" },
    { code: "204", desc: "No Content", detail: "无内容。请求成功但无需返回内容。" },
    { code: "206", desc: "Partial Content", detail: "部分内容。用于范围请求（断点续传）。" },
    { code: "301", desc: "Moved Permanently", detail: "永久重定向。资源已永久移动到新 URL。" },
    { code: "302", desc: "Found", detail: "临时重定向。资源临时从不同 URL 响应。" },
    { code: "304", desc: "Not Modified", detail: "未修改。资源未更改，使用缓存版本。" },
    { code: "307", desc: "Temporary Redirect", detail: "临时重定向。保持请求方法不变。" },
    { code: "308", desc: "Permanent Redirect", detail: "永久重定向。保持请求方法不变。" },
    { code: "400", desc: "Bad Request", detail: "错误请求。语法错误，服务器无法理解。" },
    { code: "401", desc: "Unauthorized", detail: "未授权。需要身份验证。" },
    { code: "403", desc: "Forbidden", detail: "禁止访问。服务器拒绝请求。" },
    { code: "404", desc: "Not Found", detail: "未找到。资源不存在。" },
    { code: "405", desc: "Method Not Allowed", detail: "方法不允许。请求方法被禁用。" },
    { code: "408", desc: "Request Timeout", detail: "请求超时。服务器等待超时。" },
    { code: "409", desc: "Conflict", detail: "冲突。请求与服务器状态冲突。" },
    { code: "413", desc: "Payload Too Large", detail: "请求体过大。服务器拒绝处理。" },
    { code: "415", desc: "Unsupported Media Type", detail: "不支持的媒体类型。" },
    { code: "422", desc: "Unprocessable Entity", detail: "不可处理的实体。语义错误。" },
    { code: "429", desc: "Too Many Requests", detail: "请求过多。触发限流。" },
    { code: "500", desc: "Internal Server Error", detail: "服务器内部错误。" },
    { code: "502", desc: "Bad Gateway", detail: "错误网关。收到无效响应。" },
    { code: "503", desc: "Service Unavailable", detail: "服务不可用。服务器过载或维护。" },
    { code: "504", desc: "Gateway Timeout", detail: "网关超时。" },
  ];

  const filtered = codes.filter(
    (c) =>
      c.code.includes(search) ||
      c.desc.toLowerCase().includes(search.toLowerCase()) ||
      c.detail.includes(search)
  );

  return (
    <div className="space-y-4">
      <SectionTitle>HTTP 状态码参考</SectionTitle>
      <input
        className="w-full p-3 text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-accent/50"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索状态码或描述..."
      />
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_2fr] bg-muted text-xs text-text-tertiary font-medium">
          <div className="p-2.5">状态码</div>
          <div className="p-2.5">描述</div>
          <div className="p-2.5">说明</div>
        </div>
        {filtered.map((c) => {
          const category = parseInt(c.code[0]);
          const bgColor = category === 1 ? "" : category === 2 ? "bg-green-50/50 dark:bg-green-950/20" : category === 3 ? "bg-blue-50/50 dark:bg-blue-950/20" : category === 4 ? "bg-amber-50/50 dark:bg-amber-950/20" : "bg-red-50/50 dark:bg-red-950/20";
          return (
            <div key={c.code} className={`grid grid-cols-[60px_1fr_2fr] border-t border-border text-sm ${bgColor}`}>
              <div className="p-2.5 font-mono font-medium text-text-primary">{c.code}</div>
              <div className="p-2.5 text-text-primary">{c.desc}</div>
              <div className="p-2.5 text-text-secondary text-xs">{c.detail}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── 18. Git Command Reference ────────────────────────────────────────────────

function GitReference() {
  const [search, setSearch] = useState("");

  const commands = [
    { cmd: "git init", desc: "初始化新仓库", example: "git init my-project" },
    { cmd: "git clone", desc: "克隆远程仓库", example: "git clone https://github.com/user/repo.git" },
    { cmd: "git add", desc: "暂存文件变更", example: "git add . / git add file.txt" },
    { cmd: "git commit", desc: "提交暂存的变更", example: "git commit -m \"feat: add new feature\"" },
    { cmd: "git push", desc: "推送到远程仓库", example: "git push origin main" },
    { cmd: "git pull", desc: "拉取并合并远程变更", example: "git pull origin main" },
    { cmd: "git fetch", desc: "获取远程变更（不合并）", example: "git fetch --all" },
    { cmd: "git branch", desc: "列出/创建/删除分支", example: "git branch feature-x" },
    { cmd: "git checkout", desc: "切换分支或恢复文件", example: "git checkout -b feature-x" },
    { cmd: "git switch", desc: "切换分支（推荐）", example: "git switch -c feature-x" },
    { cmd: "git merge", desc: "合并分支", example: "git merge feature-x" },
    { cmd: "git rebase", desc: "变基当前分支", example: "git rebase main" },
    { cmd: "git stash", desc: "暂存工作区变更", example: "git stash push -m \"WIP\"" },
    { cmd: "git stash pop", desc: "恢复暂存的变更", example: "git stash pop" },
    { cmd: "git log", desc: "查看提交历史", example: "git log --oneline --graph" },
    { cmd: "git diff", desc: "查看文件差异", example: "git diff HEAD~3" },
    { cmd: "git status", desc: "查看工作区状态", example: "git status -sb" },
    { cmd: "git reset", desc: "重置 HEAD 和工作区", example: "git reset --soft HEAD~1" },
    { cmd: "git revert", desc: "撤销指定提交", example: "git revert abc1234" },
    { cmd: "git cherry-pick", desc: "拣选特定提交", example: "git cherry-pick abc1234" },
    { cmd: "git tag", desc: "创建标签", example: "git tag -a v1.0 -m \"release 1.0\"" },
    { cmd: "git remote", desc: "管理远程仓库", example: "git remote add upstream url" },
    { cmd: "git bisect", desc: "二分查找 bug 引入点", example: "git bisect start / bad / good" },
    { cmd: "git blame", desc: "查看文件每行最后修改", example: "git blame file.txt" },
    { cmd: "git reflog", desc: "查看所有 HEAD 变更记录", example: "git reflog" },
    { cmd: "git clean", desc: "删除未跟踪的文件", example: "git clean -fd" },
    { cmd: "git worktree", desc: "添加附加工作目录", example: "git worktree add ../fix fix-branch" },
  ];

  const filtered = commands.filter(
    (c) =>
      c.cmd.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.includes(search) ||
      c.example.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <SectionTitle>Git 命令参考</SectionTitle>
      <input
        className="w-full p-3 text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-accent/50"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索 Git 命令..."
      />
      <div className="space-y-2">
        {filtered.map((c) => (
          <div key={c.cmd} className="p-3 border border-border rounded-lg hover:border-accent/20 transition-colors">
            <code className="font-mono text-sm font-medium text-accent">{c.cmd}</code>
            <span className="ml-3 text-sm text-text-secondary">{c.desc}</span>
            <div className="mt-1.5">
              <code className="font-mono text-xs text-text-tertiary bg-muted px-2 py-1 rounded">{c.example}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 19. ASCII Table ──────────────────────────────────────────────────────────

function AsciiTable() {
  const [search, setSearch] = useState("");

  const chars = useMemo(() => {
    const result: { dec: number; hex: string; oct: string; bin: string; char: string; desc: string }[] = [];
    const controlChars: Record<number, string> = {
      0: "NUL", 1: "SOH", 2: "STX", 3: "ETX", 4: "EOT", 5: "ENQ", 6: "ACK", 7: "BEL",
      8: "BS", 9: "HT", 10: "LF", 11: "VT", 12: "FF", 13: "CR", 14: "SO", 15: "SI",
      16: "DLE", 17: "DC1", 18: "DC2", 19: "DC3", 20: "DC4", 21: "NAK", 22: "SYN", 23: "ETB",
      24: "CAN", 25: "EM", 26: "SUB", 27: "ESC", 28: "FS", 29: "GS", 30: "RS", 31: "US",
      32: "SP", 127: "DEL",
    };
    for (let i = 0; i <= 127; i++) {
      result.push({
        dec: i,
        hex: i.toString(16).toUpperCase().padStart(2, "0"),
        oct: i.toString(8).padStart(3, "0"),
        bin: i.toString(2).padStart(8, "0"),
        char: controlChars[i] || String.fromCharCode(i),
        desc: controlChars[i] || (i >= 33 && i <= 126 ? String.fromCharCode(i) : ""),
      });
    }
    return result;
  }, []);

  const filtered = chars.filter(
    (c) =>
      c.dec.toString().includes(search) ||
      c.hex.toLowerCase().includes(search.toLowerCase()) ||
      c.char.toLowerCase().includes(search.toLowerCase()) ||
      c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <SectionTitle>ASCII 字符表</SectionTitle>
      <input
        className="w-full p-3 text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-accent/50"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索字符、十进制、十六进制..."
      />
      <div className="border border-border rounded-lg overflow-hidden overflow-x-auto">
        <div className="grid grid-cols-[50px_50px_50px_90px_60px_1fr] bg-muted text-xs text-text-tertiary font-medium min-w-[400px]">
          <div className="p-2">DEC</div>
          <div className="p-2">HEX</div>
          <div className="p-2">OCT</div>
          <div className="p-2">BIN</div>
          <div className="p-2">字符</div>
          <div className="p-2">说明</div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {filtered.map((c) => (
            <div key={c.dec} className="grid grid-cols-[50px_50px_50px_90px_60px_1fr] border-t border-border text-xs font-mono min-w-[400px]">
              <div className="p-1.5 text-text-primary">{c.dec}</div>
              <div className="p-1.5 text-text-secondary">{c.hex}</div>
              <div className="p-1.5 text-text-secondary">{c.oct}</div>
              <div className="p-1.5 text-text-secondary">{c.bin}</div>
              <div className="p-1.5 text-accent font-medium text-center">{c.char}</div>
              <div className="p-1.5 text-text-tertiary font-sans">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-text-tertiary">显示 {filtered.length} / 128 个 ASCII 字符</p>
    </div>
  );
}

// ─── 20. Port Reference ───────────────────────────────────────────────────────

function PortReference() {
  const [search, setSearch] = useState("");

  const ports = [
    { port: 20, service: "FTP Data", protocol: "TCP", desc: "FTP 数据传输" },
    { port: 21, service: "FTP Control", protocol: "TCP", desc: "FTP 控制连接" },
    { port: 22, service: "SSH", protocol: "TCP", desc: "安全 Shell 远程登录" },
    { port: 23, service: "Telnet", protocol: "TCP", desc: "Telnet 远程登录（不安全）" },
    { port: 25, service: "SMTP", protocol: "TCP", desc: "邮件发送协议" },
    { port: 53, service: "DNS", protocol: "TCP/UDP", desc: "域名解析服务" },
    { port: 67, service: "DHCP Server", protocol: "UDP", desc: "DHCP 服务端" },
    { port: 68, service: "DHCP Client", protocol: "UDP", desc: "DHCP 客户端" },
    { port: 69, service: "TFTP", protocol: "UDP", desc: "简单文件传输协议" },
    { port: 80, service: "HTTP", protocol: "TCP", desc: "超文本传输协议" },
    { port: 110, service: "POP3", protocol: "TCP", desc: "邮件接收协议 v3" },
    { port: 123, service: "NTP", protocol: "UDP", desc: "网络时间协议" },
    { port: 143, service: "IMAP", protocol: "TCP", desc: "互联网消息访问协议" },
    { port: 161, service: "SNMP", protocol: "UDP", desc: "简单网络管理协议" },
    { port: 389, service: "LDAP", protocol: "TCP", desc: "轻量目录访问协议" },
    { port: 443, service: "HTTPS", protocol: "TCP", desc: "加密 HTTP 协议" },
    { port: 445, service: "SMB", protocol: "TCP", desc: "服务器消息块（文件共享）" },
    { port: 465, service: "SMTPS", protocol: "TCP", desc: "加密 SMTP" },
    { port: 587, service: "SMTP Submission", protocol: "TCP", desc: "邮件提交端口" },
    { port: 993, service: "IMAPS", protocol: "TCP", desc: "加密 IMAP" },
    { port: 995, service: "POP3S", protocol: "TCP", desc: "加密 POP3" },
    { port: 1080, service: "SOCKS", protocol: "TCP", desc: "SOCKS 代理" },
    { port: 1433, service: "MSSQL", protocol: "TCP", desc: "Microsoft SQL Server" },
    { port: 1521, service: "Oracle", protocol: "TCP", desc: "Oracle 数据库" },
    { port: 1883, service: "MQTT", protocol: "TCP", desc: "MQTT 消息协议（IoT）" },
    { port: 2049, service: "NFS", protocol: "TCP/UDP", desc: "网络文件系统" },
    { port: 3000, service: "Dev Server", protocol: "TCP", desc: "常见开发服务器端口" },
    { port: 3306, service: "MySQL", protocol: "TCP", desc: "MySQL 数据库" },
    { port: 3389, service: "RDP", protocol: "TCP", desc: "远程桌面协议" },
    { port: 5000, service: "Flask/UPnP", protocol: "TCP", desc: "Flask 默认端口 / UPnP" },
    { port: 5432, service: "PostgreSQL", protocol: "TCP", desc: "PostgreSQL 数据库" },
    { port: 5672, service: "AMQP", protocol: "TCP", desc: "RabbitMQ 消息队列" },
    { port: 5900, service: "VNC", protocol: "TCP", desc: "VNC 远程桌面" },
    { port: 6379, service: "Redis", protocol: "TCP", desc: "Redis 缓存数据库" },
    { port: 8080, service: "HTTP Alt", protocol: "TCP", desc: "备用 HTTP 端口" },
    { port: 8443, service: "HTTPS Alt", protocol: "TCP", desc: "备用 HTTPS 端口" },
    { port: 8888, service: "Jupyter", protocol: "TCP", desc: "Jupyter Notebook" },
    { port: 9090, service: "Prometheus", protocol: "TCP", desc: "Prometheus 监控" },
    { port: 27017, service: "MongoDB", protocol: "TCP", desc: "MongoDB 数据库" },
    { port: 51820, service: "WireGuard", protocol: "UDP", desc: "WireGuard VPN" },
  ];

  const filtered = ports.filter(
    (p) =>
      p.port.toString().includes(search) ||
      p.service.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.includes(search) ||
      p.protocol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <SectionTitle>常用端口参考</SectionTitle>
      <input
        className="w-full p-3 text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-accent/50"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索端口号、服务名或描述..."
      />
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[70px_1fr_80px_2fr] bg-muted text-xs text-text-tertiary font-medium">
          <div className="p-2.5">端口</div>
          <div className="p-2.5">服务</div>
          <div className="p-2.5">协议</div>
          <div className="p-2.5">说明</div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {filtered.map((p) => (
            <div key={p.port} className="grid grid-cols-[70px_1fr_80px_2fr] border-t border-border text-sm">
              <div className="p-2.5 font-mono text-accent font-medium">{p.port}</div>
              <div className="p-2.5 text-text-primary">{p.service}</div>
              <div className="p-2.5 text-text-tertiary text-xs">{p.protocol}</div>
              <div className="p-2.5 text-text-secondary text-xs">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const tools = [
  { id: "json", name: "JSON 格式化", icon: "{ }" },
  { id: "base64", name: "Base64", icon: "B64" },
  { id: "url", name: "URL 编解码", icon: "%20" },
  { id: "hash", name: "哈希生成", icon: "#" },
  { id: "color", name: "颜色选择", icon: "RGB" },
  { id: "qr", name: "QR 码", icon: "[]" },
  { id: "uuid", name: "UUID", icon: "v4" },
  { id: "timestamp", name: "时间戳", icon: "T" },
  { id: "regex", name: "正则测试", icon: ".*" },
  { id: "diff", name: "差异对比", icon: "+/-" },
  { id: "markdown", name: "Markdown", icon: "MD" },
  { id: "css-unit", name: "CSS 单位", icon: "px" },
  { id: "lorem", name: "Lorem Ipsum", icon: "字" },
  { id: "password", name: "密码生成", icon: "***" },
  { id: "ip", name: "IP 查询", icon: "IP" },
  { id: "ua", name: "UA 解析", icon: "UA" },
  { id: "http-status", name: "HTTP 状态码", icon: "200" },
  { id: "git", name: "Git 命令", icon: "git" },
  { id: "ascii", name: "ASCII 表", icon: "A" },
  { id: "ports", name: "端口参考", icon: ":" },
];

const toolComponents: Record<string, React.ComponentType> = {
  json: JsonFormatter,
  base64: Base64Tool,
  url: UrlCodec,
  hash: HashGenerator,
  color: ColorPicker,
  qr: QrCodeGenerator,
  uuid: UuidGenerator,
  timestamp: TimestampConverter,
  regex: RegexTester,
  diff: DiffViewer,
  markdown: MarkdownPreview,
  "css-unit": CssUnitConverter,
  lorem: LoremGenerator,
  password: PasswordGenerator,
  ip: IpLookup,
  ua: UaParser,
  "http-status": HttpStatusRef,
  git: GitReference,
  ascii: AsciiTable,
  ports: PortReference,
};

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState("json");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const ActiveComponent = toolComponents[activeTool];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          开发者工具
        </h1>
        <p className="mt-2 text-text-secondary text-sm">
          20 个常用开发工具集合，覆盖编码、转换、生成、查询等场景
        </p>
      </header>

      <div className="flex gap-6">
        {/* Mobile sidebar toggle */}
        <button
          className="sm:hidden fixed bottom-4 right-4 z-40 w-12 h-12 bg-accent text-white rounded-full shadow-lg flex items-center justify-center text-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "x" : "="}
        </button>

        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "fixed inset-0 z-30 bg-background/95 pt-20 px-4" : "hidden"} sm:block sm:static sm:w-48 shrink-0`}>
          <nav className="space-y-0.5">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => { setActiveTool(tool.id); setSidebarOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center gap-2 ${
                  activeTool === tool.id
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                }`}
              >
                <span className="font-mono text-xs w-8 text-center opacity-60">{tool.icon}</span>
                <span className="truncate">{tool.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Tool content */}
        <div className="flex-1 min-w-0">
          <div className="p-5 border border-border rounded-lg bg-surface">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </div>
    </div>
  );
}
