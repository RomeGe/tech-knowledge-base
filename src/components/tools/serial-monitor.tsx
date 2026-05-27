"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SerialLine {
  id: number;
  timestamp: number;
  data: string;
  direction: "rx" | "tx";
}

interface SerialSettings {
  baudRate: number;
  dataBits: 7 | 8;
  stopBits: 1 | 2;
  parity: "none" | "even" | "odd";
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function SerialMonitor() {
  const [connected, setConnected] = useState(false);
  const [lines, setLines] = useState<SerialLine[]>([]);
  const [input, setInput] = useState("");
  const [paused, setPaused] = useState(false);
  const [displayFormat, setDisplayFormat] = useState<"ascii" | "hex">("ascii");
  const [settings, setSettings] = useState<SerialSettings>({
    baudRate: 115200,
    dataBits: 8,
    stopBits: 1,
    parity: "none",
  });

  const outputRef = useRef<HTMLDivElement>(null);
  const lineIdRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sensorValueRef = useRef({ temp: 25.0, humidity: 60.0, pressure: 1013.25 });

  // Generate simulated sensor data
  const generateSensorData = useCallback(() => {
    const sv = sensorValueRef.current;
    sv.temp += (Math.random() - 0.5) * 0.4;
    sv.humidity += (Math.random() - 0.5) * 0.8;
    sv.pressure += (Math.random() - 0.5) * 0.3;
    sv.temp = Math.max(15, Math.min(40, sv.temp));
    sv.humidity = Math.max(30, Math.min(90, sv.humidity));
    sv.pressure = Math.max(990, Math.min(1040, sv.pressure));

    const timestamp = Date.now();
    const sensorLines = [
      `[SENSOR] T=${sv.temp.toFixed(2)}C  RH=${sv.humidity.toFixed(1)}%  P=${sv.pressure.toFixed(2)}hPa`,
      `[STATUS] uptime=${Math.floor((timestamp % 100000) / 1000)}s  heap=48256B  stack=1024B`,
    ];

    return sensorLines.map((data) => ({
      id: lineIdRef.current++,
      timestamp,
      data,
      direction: "rx" as const,
    }));
  }, []);

  // Start/stop simulated data stream
  useEffect(() => {
    if (connected && !paused) {
      intervalRef.current = setInterval(() => {
        setLines((prev) => [...prev.slice(-500), ...generateSensorData()]);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [connected, paused, generateSensorData]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current && !paused) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines, paused]);

  const handleConnect = () => {
    if (connected) {
      setConnected(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setLines([]);
      lineIdRef.current = 0;
      setLines([{
        id: lineIdRef.current++,
        timestamp: Date.now(),
        data: `[CONNECT] Port opened at ${settings.baudRate} baud, ${settings.dataBits}${settings.parity === "none" ? "N" : settings.parity === "even" ? "E" : "O"}${settings.stopBits}`,
        direction: "rx",
      }]);
      setConnected(true);
    }
  };

  const handleSend = () => {
    if (!input.trim() || !connected) return;
    const txLine: SerialLine = {
      id: lineIdRef.current++,
      timestamp: Date.now(),
      data: input,
      direction: "tx",
    };
    setLines((prev) => [...prev, txLine]);

    // Simulate echo response for common commands
    const cmd = input.trim().toUpperCase();
    let response = "";
    if (cmd === "AT") response = "OK";
    else if (cmd === "AT+GMR") response = "AT version:2.2.0.0 SDK:3.4.0";
    else if (cmd === "AT+CWMODE?") response = "+CWMODE:1\r\nOK";
    else if (cmd.startsWith("AT+")) response = "OK";
    else response = `ECHO: ${input}`;

    setTimeout(() => {
      setLines((prev) => [
        ...prev,
        {
          id: lineIdRef.current++,
          timestamp: Date.now(),
          data: response,
          direction: "rx" as const,
        },
      ]);
    }, 50);

    setInput("");
  };

  const clearLines = () => setLines([]);

  const exportData = () => {
    const text = lines
      .map((l) => {
        const time = new Date(l.timestamp).toISOString().substr(11, 12);
        const dir = l.direction === "rx" ? "RX" : "TX";
        return `[${time}] ${dir} | ${l.data}`;
      })
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "serial-log.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatData = (data: string): string => {
    if (displayFormat === "hex") {
      return Array.from(data)
        .map((c) => c.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0"))
        .join(" ");
    }
    return data;
  };

  const formatTime = (ts: number): string => {
    const d = new Date(ts);
    return d.toTimeString().split(" ")[0] + "." + String(d.getMilliseconds()).padStart(3, "0");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-text-primary mb-4">UART Serial Monitor</h2>
      <p className="text-sm text-text-secondary mb-4">
        Simulated UART serial monitor with configurable baud rate and data format. Generates random sensor readings when connected.
      </p>

      {/* Connection settings */}
      <div className="flex flex-wrap gap-3 items-end p-3 border border-border rounded-lg bg-muted">
        <div>
          <label className="text-xs text-text-tertiary block mb-1">Baud Rate</label>
          <select
            value={settings.baudRate}
            onChange={(e) => setSettings((s) => ({ ...s, baudRate: +e.target.value }))}
            disabled={connected}
            className="p-1.5 text-sm font-mono border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50 disabled:opacity-50"
          >
            <option value={9600}>9600</option>
            <option value={19200}>19200</option>
            <option value={38400}>38400</option>
            <option value={57600}>57600</option>
            <option value={115200}>115200</option>
            <option value={230400}>230400</option>
            <option value={460800}>460800</option>
            <option value={921600}>921600</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-text-tertiary block mb-1">Data Bits</label>
          <select
            value={settings.dataBits}
            onChange={(e) => setSettings((s) => ({ ...s, dataBits: +e.target.value as 7 | 8 }))}
            disabled={connected}
            className="p-1.5 text-sm font-mono border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50 disabled:opacity-50"
          >
            <option value={7}>7</option>
            <option value={8}>8</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-text-tertiary block mb-1">Stop Bits</label>
          <select
            value={settings.stopBits}
            onChange={(e) => setSettings((s) => ({ ...s, stopBits: +e.target.value as 1 | 2 }))}
            disabled={connected}
            className="p-1.5 text-sm font-mono border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50 disabled:opacity-50"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-text-tertiary block mb-1">Parity</label>
          <select
            value={settings.parity}
            onChange={(e) => setSettings((s) => ({ ...s, parity: e.target.value as "none" | "even" | "odd" }))}
            disabled={connected}
            className="p-1.5 text-sm font-mono border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:border-accent/50 disabled:opacity-50"
          >
            <option value="none">None</option>
            <option value="even">Even</option>
            <option value="odd">Odd</option>
          </select>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className={`w-2.5 h-2.5 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          <span className="text-xs text-text-secondary">{connected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleConnect}
          className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${
            connected
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-accent text-white hover:bg-accent-hover"
          }`}
        >
          {connected ? "Disconnect" : "Connect"}
        </button>
        <button
          onClick={() => setPaused(!paused)}
          disabled={!connected}
          className={`px-3 py-1.5 text-sm border border-border rounded-md transition-colors disabled:opacity-40 ${
            paused ? "text-amber-500 border-amber-500/50" : "text-text-secondary hover:border-accent/30"
          }`}
        >
          {paused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={clearLines}
          className="px-3 py-1.5 text-sm border border-border rounded-md text-text-secondary hover:border-accent/30 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={exportData}
          className="px-3 py-1.5 text-sm border border-border rounded-md text-text-secondary hover:border-accent/30 transition-colors"
        >
          Export
        </button>
        <div className="ml-auto flex gap-1">
          <button
            onClick={() => setDisplayFormat("ascii")}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              displayFormat === "ascii" ? "bg-accent text-white" : "border border-border text-text-secondary"
            }`}
          >
            ASCII
          </button>
          <button
            onClick={() => setDisplayFormat("hex")}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              displayFormat === "hex" ? "bg-accent text-white" : "border border-border text-text-secondary"
            }`}
          >
            HEX
          </button>
        </div>
      </div>

      {/* Terminal output */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-3 py-1.5 bg-muted text-xs text-text-tertiary border-b border-border flex justify-between">
          <span>Terminal Output</span>
          <span>{lines.length} lines</span>
        </div>
        <div
          ref={outputRef}
          className="h-80 overflow-y-auto bg-[#1e1e2e] dark:bg-[#1e1e2e] p-3 font-mono text-xs leading-5"
        >
          {lines.length === 0 ? (
            <div className="text-gray-500 italic">{"// Connect to start receiving data"}</div>
          ) : (
            lines.map((line) => (
              <div key={line.id} className="flex gap-2">
                <span className="text-gray-600 shrink-0 select-none">{formatTime(line.timestamp)}</span>
                <span className={`shrink-0 w-6 text-center ${line.direction === "tx" ? "text-blue-400" : "text-green-400"}`}>
                  {line.direction === "tx" ? "TX" : "RX"}
                </span>
                <span className={line.direction === "tx" ? "text-blue-300" : "text-green-300"}>
                  {formatData(line.data)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={!connected}
          placeholder={connected ? "Type command (e.g. AT, AT+GMR)..." : "Connect first..."}
          className="flex-1 p-2.5 font-mono text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:border-accent/50 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!connected || !input.trim()}
          className="px-4 py-2 text-sm bg-accent text-white rounded-md hover:bg-accent-hover transition-colors disabled:opacity-40"
        >
          Send
        </button>
      </div>
    </div>
  );
}
