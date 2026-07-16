import { useEffect, useRef, memo } from 'react';

interface Props { symbol: string }

function TradingViewSingleQuote({ symbol }: Props) {
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
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
    s.async = true;
    s.innerHTML = JSON.stringify({
      symbol, width: '100%', locale: 'en',
      colorTheme: 'dark', isTransparent: true,
    });
    container.current.appendChild(s);
    scriptEl.current = s;
  }, [symbol]);

  useEffect(() => () => { if (container.current) container.current.innerHTML = ''; }, []);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ width: '100%' }}>
      <div className="tradingview-widget-container__widget" />
    </div>
  );
}

export default memo(TradingViewSingleQuote);
