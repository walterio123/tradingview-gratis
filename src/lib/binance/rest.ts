// src/lib/twelvedata/rest.ts
import type { Candle, Timeframe } from "../binance/types";

const BASE = "https://api.twelvedata.com";
const API_KEY = "04693e69001f4cb4a0e4f2f657f36ab8"; 

function toTDInterval(tf: Timeframe): string {
  const map: Record<string, string> = {
    "1m": "1min", "3m": "3min", "5m": "5min", "15m": "15min",
    "30m": "30min", "1h": "1h", "2h": "2h", "4h": "4h",
    "6h": "6h", "8h": "8h", "12h": "12h", "1d": "1day",
    "3d": "3day", "1w": "1week", "1M": "1month",
  };
  return map[tf] ?? "1h";
}

export async function fetchForexKlines(
  symbol: string,
  interval: Timeframe,
  limit = 300,
): Promise<Candle[]> {
  const tdInterval = toTDInterval(interval);
  const url = `${BASE}/time_series?symbol=${symbol}&interval=${tdInterval}&outputsize=${limit}&apikey=${API_KEY}&format=JSON`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`twelvedata klines ${res.status}`);
  const data = await res.json();
  if (data.status === "error") throw new Error(`Twelve Data: ${data.message}`);
  const values = data.values as Array<{
    datetime: string; open: string; high: string; low: string; close: string; volume?: string;
  }>;
  return values.reverse().map((v) => ({
    time: Math.floor(new Date(v.datetime).getTime() / 1000),
    open: parseFloat(v.open), high: parseFloat(v.high),
    low: parseFloat(v.low), close: parseFloat(v.close),
    volume: v.volume ? parseFloat(v.volume) : 0,
    isFinal: true,
  }));
}

export async function fetchForexPrice(symbol: string): Promise<number> {
  const url = `${BASE}/price?symbol=${symbol}&apikey=${API_KEY}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`twelvedata price ${res.status}`);
  const data = await res.json();
  if (data.status === "error") throw new Error(data.message);
  return parseFloat(data.price);
}

export const FOREX_SYMBOLS = ["XAUUSD", "XAGUSD", "EURUSD", "GBPUSD", "USDJPY"];
export function isForexSymbol(symbol: string): boolean {
  return FOREX_SYMBOLS.includes(symbol);
}
