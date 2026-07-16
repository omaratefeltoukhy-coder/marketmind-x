import { useEffect, useRef, memo } from 'react';

const IV: Record<string, string> = { '1': '1m', '5': '5m', '15': '15m', '60': '1h', '240': '4h', '1D': '1D', '1W': '1W' };

interface Props { symbol: string; interval?: string }

function TradingViewTechAnalysis({ symbol, interval = '60' }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const scriptEl = useRef<HTMLScriptElement | null>(null);
  const prev = useRef('');

  useEffect(() => {
    if (!container.current) return;
    if (prev.current !== symbol && scriptEl.current) {
      container.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
      scriptEl.current = null;
    }
    prev.current = symbol;
    if (scriptEl.current) return;
    const s = document.createElement('script');
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    s.async = true;
    s.innerHTML = JSON.stringify({
      interval: IV[interval] || '1h', width: '100%', isTransparent: true,
      height: 430, symbol, showSymbolLogo: true, colorTheme: 'dark', locale: 'en',
    });
    container.current.appendChild(s);
    scriptEl.current = s;
  }, [symbol, interval]);

  useEffect(() => () => { if (container.current) container.current.innerHTML = ''; }, []);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ width: '100%' }}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default memo(TradingViewTechAnalysis);
