import { useEffect, useRef } from 'react';
import { TICKER_SYMBOLS } from '@/lib/tvSymbols';

export default function TradingViewTicker() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current || container.current.querySelector('script')) return;
    const s = document.createElement('script');
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    s.async = true;
    s.innerHTML = JSON.stringify({
      symbols: TICKER_SYMBOLS, showSymbolLogo: true, isTransparent: true,
      displayMode: 'adaptive', colorTheme: 'dark', locale: 'en',
    });
    container.current.appendChild(s);
  }, []);

  return (
    <div className="w-full h-[48px] border-b border-[#1E293B] overflow-hidden" style={{ background: '#0B1120' }}>
      <div className="tradingview-widget-container" ref={container} style={{ width: '100%', height: 48 }}>
        <div className="tradingview-widget-container__widget" style={{ width: '100%', height: 48 }} />
      </div>
    </div>
  );
}
