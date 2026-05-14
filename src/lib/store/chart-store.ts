"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Timeframe } from "../binance/types";

export const FOREX_SYMBOLS = ["XAUUSD", "XAGUSD", "EURUSD", "GBPUSD", "USDJPY"];

export function isForexSymbol(symbol: string): boolean {
  return FOREX_SYMBOLS.includes(symbol);
}

interface ChartState {
  symbol: string;
  timeframe: Timeframe;
  watchlist: string[];
  symbolDialogOpen: boolean;
  indicatorSettingsOpen: boolean;

  setSymbol: (s: string) => void;
  setTimeframe: (tf: Timeframe) => void;
  addToWatchlist: (s: string) => void;
  removeFromWatchlist: (s: string) => void;
  setSymbolDialogOpen: (open: boolean) => void;
  setIndicatorSettingsOpen: (open: boolean) => void;
}

export const useChartStore = create<ChartState>()(
  persist(
    (set) => ({
      symbol: "BTCUSDT",
      timeframe: "15m",
      watchlist: [
        "BTCUSDT",
        "ETHUSDT",
        "SOLUSDT",
        "BNBUSDT",
        "XRPUSDT",
        "DOGEUSDT",
        "ADAUSDT",
        "AVAXUSDT",
        "LINKUSDT",
        "MATICUSDT",
        "XAUUSD",
        "XAGUSD",
      ],
      symbolDialogOpen: false,
      indicatorSettingsOpen: false,

      setSymbol: (s) => set({ symbol: s }),
      setTimeframe: (tf) => set({ timeframe: tf }),
      addToWatchlist: (s) =>
        set((state) => ({
          watchlist: state.watchlist.includes(s)
            ? state.watchlist
            : [...state.watchlist, s],
        })),
      removeFromWatchlist: (s) =>
        set((state) => ({
          watchlist: state.watchlist.filter((w) => w !== s),
        })),
      setSymbolDialogOpen: (open) => set({ symbolDialogOpen: open }),
      setIndicatorSettingsOpen: (open) => set({ indicatorSettingsOpen: open }),
    }),
    {
      name: "chart-store",
    },
  ),
);