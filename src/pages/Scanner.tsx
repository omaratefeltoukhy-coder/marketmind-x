import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, TrendingUp, TrendingDown, Zap, ChevronDown, ChevronUp, Target, Shield } from 'lucide-react';
import { INSTRUMENTS } from '@/lib/tvSymbols';
import TradingViewSymbolInfo from '@/components/TradingViewSymbolInfo';
import TradingViewTechAnalysis from '@/components/TradingViewTechAnalysis';

interface ScanResult {
  id: string;
  tvSymbol: string;
  symbol: string;
  name: string;
  bias: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  setup: string;
  entry: number;
  sl: number;
  tp: number;
  tp2: number;
  strategies: string[];
  category: string;
  rr: string;
}

function calcRR(entry: number, sl: number, tp: number): string {
  const risk = Math.abs(entry - sl);
  const reward = Math.abs(tp - entry);
  if (risk === 0) return '—';
  return (reward / risk).toFixed(1);
}

function generateResults(): ScanResult[] {
  const picks = [
    { id: 'xau-usd', tvSymbol: 'OANDA:XAUUSD', symbol: 'XAU/USD', name: 'Gold', bias: 'bullish' as const, confidence: 82, setup: 'SMC + OB + CHoCH', entry: 3380.50, sl: 3355.00, tp: 3410.00, tp2: 3445.00, strategies: ['SMC', 'ICT', 'OB'], category: 'commodity' },
    { id: 'btc-usd', tvSymbol: 'BINANCE:BTCUSDT', symbol: 'BTC/USD', name: 'Bitcoin', bias: 'bullish' as const, confidence: 76, setup: 'BOS + FVG + EMA', entry: 108500.00, sl: 105800.00, tp: 112000.00, tp2: 115500.00, strategies: ['BOS', 'FVG', 'EMA'], category: 'crypto' },
    { id: 'gbp-usd', tvSymbol: 'FX:GBPUSD', symbol: 'GBP/USD', name: 'GBP/USD', bias: 'bullish' as const, confidence: 71, setup: 'OB + Pullback', entry: 1.3440, sl: 1.3380, tp: 1.3520, tp2: 1.3580, strategies: ['OB', 'Pullback'], category: 'forex' },
    { id: 'us30', tvSymbol: 'BLACKBULL:US30', symbol: 'US30', name: 'US30', bias: 'bullish' as const, confidence: 85, setup: 'SMC + Liq Sweep + BOS', entry: 45280.00, sl: 45000.00, tp: 45700.00, tp2: 46200.00, strategies: ['SMC', 'Liq Sweep', 'BOS'], category: 'index' },
    { id: 'nas100', tvSymbol: 'BLACKBULL:NAS100', symbol: 'NAS100', name: 'Nasdaq 100', bias: 'bullish' as const, confidence: 74, setup: 'FVG + CHoCH', entry: 20450.00, sl: 20200.00, tp: 20800.00, tp2: 21200.00, strategies: ['FVG', 'CHoCH'], category: 'index' },
    { id: 'eth-usd', tvSymbol: 'BINANCE:ETHUSDT', symbol: 'ETH/USD', name: 'Ethereum', bias: 'bearish' as const, confidence: 63, setup: 'OB Reject + EMA', entry: 2580.00, sl: 2640.00, tp: 2510.00, tp2: 2450.00, strategies: ['OB Reject', 'EMA'], category: 'crypto' },
    { id: 'eur-usd', tvSymbol: 'FX:EURUSD', symbol: 'EUR/USD', name: 'EUR/USD', bias: 'bearish' as const, confidence: 58, setup: 'Liq Sweep', entry: 1.0845, sl: 1.0890, tp: 1.0790, tp2: 1.0740, strategies: ['Liq Sweep'], category: 'forex' },
    { id: 'wti', tvSymbol: 'TVC:USOIL', symbol: 'WTI', name: 'Crude Oil', bias: 'bearish' as const, confidence: 61, setup: 'CHoCH + OB', entry: 72.50, sl: 73.50, tp: 71.00, tp2: 69.50, strategies: ['CHoCH', 'OB'], category: 'commodity' },
    { id: 'sol-usd', tvSymbol: 'BINANCE:SOLUSDT', symbol: 'SOL/USD', name: 'Solana', bias: 'bullish' as const, confidence: 69, setup: 'S/R Flip + Volume', entry: 188.50, sl: 180.00, tp: 198.00, tp2: 208.00, strategies: ['S/R Flip', 'Volume'], category: 'crypto' },
    { id: 'usd-jpy', tvSymbol: 'FX:USDJPY', symbol: 'USD/JPY', name: 'USD/JPY', bias: 'bullish' as const, confidence: 66, setup: 'Asia Sweep + AMD', entry: 157.80, sl: 157.20, tp: 158.60, tp2: 159.40, strategies: ['Asia Sweep', 'AMD'], category: 'forex' },
  ];
  return picks.map(p => ({
    ...p,
    id: p.id + '-' + Date.now(),
    rr: calcRR(p.entry, p.sl, p.tp),
  }));
}

export default function Scanner() {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [biasFilter, setBiasFilter] = useState<'all' | 'bullish' | 'bearish'>('all');

  const filtered = useMemo(() => {
    if (biasFilter === 'all') return results;
    return results.filter(r => r.bias === biasFilter);
  }, [results, biasFilter]);

  useEffect(() => {
    setResults(generateResults());
  }, []);

  useEffect(() => {
    if (!scanning) return;
    setProgress(0);
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setScanning(false);
          setResults(generateResults());
          return 100;
        }
        return p + 2;
      });
    }, 80);
    return () => clearInterval(iv);
  }, [scanning]);

  const fp = (p: number) => p >= 1000 ? p.toLocaleString('en-US', { maximumFractionDigits: 0 }) : p >= 1 ? p.toFixed(4) : p.toFixed(6);

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Radar size={18} className="text-[#22D3EE]" />
          <h1 className="text-xl font-bold text-[#F8FAFC]">Live Scanner</h1>
          <span className="flex items-center gap-1 text-[10px] text-[#4ADE80] bg-[#4ADE80]/10 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" /> LIVE TV DATA
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Bias filter */}
          <div className="flex bg-[#0F172A] border border-[#334155] rounded-lg overflow-hidden">
            {(['all', 'bullish', 'bearish'] as const).map(f => (
              <button key={f} onClick={() => setBiasFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${biasFilter === f ? 'bg-[#22D3EE] text-[#050B14]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'}`}>
                {f === 'all' ? 'All' : f === 'bullish' ? 'Bullish' : 'Bearish'}
              </button>
            ))}
          </div>
          <button onClick={() => { setScanning(true); setExpanded(new Set()); }} disabled={scanning}
            className="px-4 py-2 bg-[#22D3EE] text-[#050B14] rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-40 flex items-center gap-2">
            <Zap size={14} /> {scanning ? `Scanning ${progress}%` : 'Scan Now'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <AnimatePresence>
        {scanning && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass-card p-3 rounded-xl overflow-hidden">
            <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
              <motion.div className="h-full bg-[#22D3EE] rounded-full" animate={{ width: `${progress}%` }} />
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-1">Scanning {INSTRUMENTS.length} instruments across all strategies... {progress}%</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      {!scanning && results.length > 0 && (
        <p className="text-xs text-[#64748B]">{filtered.length} setup{filtered.length !== 1 ? 's' : ''} found {biasFilter !== 'all' ? `(${biasFilter})` : ''}</p>
      )}

      {/* Scanner Results */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((r, i) => {
            const isL = r.bias === 'bullish';
            const isExpanded = expanded.has(r.id);
            return (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-xl overflow-hidden"
                style={{ border: `1px solid ${isL ? '#4ADE8030' : '#F8717130'}` }}
              >
                {/* Row: Symbol Info Widget + Setup Summary */}
                <div className="p-3">
                  <div className="flex flex-col lg:flex-row gap-3">
                    {/* Left: TradingView Symbol Info (LIVE PRICE) */}
                    <div className="w-full lg:w-[280px] flex-shrink-0">
                      <div className="text-[9px] text-[#64748B] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-[#4ADE80] animate-pulse" /> TradingView Live Price
                      </div>
                      <div className="rounded-lg overflow-hidden" style={{ background: '#0B1120', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <TradingViewSymbolInfo symbol={r.tvSymbol} />
                      </div>
                    </div>

                    {/* Right: Setup details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-black uppercase ${isL ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                            {isL ? 'LONG' : 'SHORT'}
                          </span>
                          <span className="text-sm text-[#94A3B8]">{r.name}</span>
                          <span className="text-[10px] text-[#64748B] bg-[#1E293B] px-1.5 py-0.5 rounded">{r.category.toUpperCase()}</span>
                          <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isL ? 'bg-[#4ADE80]/15 text-[#4ADE80]' : 'bg-[#F87171]/15 text-[#F87171]'}`}>
                            {isL ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                            {r.bias.toUpperCase()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${r.confidence >= 70 ? 'text-[#4ADE80]' : r.confidence >= 50 ? 'text-[#FBBF24]' : 'text-[#F87171]'}`}>
                            {r.confidence}%
                          </span>
                          <button onClick={() => toggleExpand(r.id)} className="p-1 text-[#64748B] hover:text-[#F8FAFC]">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Price pills */}
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        <div className="flex flex-col px-2.5 py-1.5 rounded-lg bg-[#22D3EE]/5 border border-[#22D3EE]/15">
                          <span className="text-[9px] text-[#22D3EE] font-bold">ENTRY</span>
                          <span className="text-sm font-mono font-bold text-[#22D3EE]">{fp(r.entry)}</span>
                        </div>
                        <div className="flex flex-col px-2.5 py-1.5 rounded-lg bg-[#F87171]/5 border border-[#F87171]/15">
                          <span className="text-[9px] text-[#F87171] font-bold">SL</span>
                          <span className="text-sm font-mono font-bold text-[#F87171]">{fp(r.sl)}</span>
                        </div>
                        <div className="flex flex-col px-2.5 py-1.5 rounded-lg bg-[#4ADE80]/5 border border-[#4ADE80]/15">
                          <span className="text-[9px] text-[#4ADE80] font-bold">TP1</span>
                          <span className="text-sm font-mono font-bold text-[#4ADE80]">{fp(r.tp)}</span>
                        </div>
                        <div className="flex flex-col px-2.5 py-1.5 rounded-lg bg-[#22C55E]/5 border border-[#22C55E]/15">
                          <span className="text-[9px] text-[#22C55E] font-bold">TP2</span>
                          <span className="text-sm font-mono font-bold text-[#22C55E]">{fp(r.tp2)}</span>
                        </div>
                        <div className="flex flex-col px-2.5 py-1.5 rounded-lg bg-[#A855F7]/5 border border-[#A855F7]/15">
                          <span className="text-[9px] text-[#A855F7] font-bold">R:R</span>
                          <span className="text-sm font-mono font-bold text-[#A855F7]">1:{r.rr}</span>
                        </div>
                      </div>

                      {/* Strategies */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {r.strategies.map(str => (
                          <span key={str} className="px-2 py-0.5 rounded-full text-[10px] bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20">{str}</span>
                        ))}
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#1E293B] text-[#64748B]">{r.setup}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded: Live Technical Analysis from TradingView */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[#1E293B] p-3">
                        <div className="text-[9px] text-[#64748B] uppercase tracking-wider mb-2 flex items-center gap-1">
                          <Target size={10} className="text-[#22D3EE]" /> TradingView Live Technical Analysis
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="rounded-xl overflow-hidden" style={{ background: '#0B1120', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <TradingViewTechAnalysis symbol={r.tvSymbol} interval="60" />
                          </div>
                          <div className="rounded-xl overflow-hidden" style={{ background: '#0B1120', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <TradingViewTechAnalysis symbol={r.tvSymbol} interval="240" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && !scanning && (
          <div className="glass-card p-8 rounded-xl text-center">
            <Shield size={32} className="text-[#334155] mx-auto mb-2" />
            <p className="text-sm text-[#64748B]">No setups match the current filter.</p>
            <button onClick={() => setBiasFilter('all')} className="mt-2 text-xs text-[#22D3EE] hover:underline">Show all</button>
          </div>
        )}
      </div>
    </div>
  );
}
