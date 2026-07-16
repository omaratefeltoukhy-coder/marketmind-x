import { useEffect, useRef, memo } from 'react';

interface Props { symbol: string; interval?: string }

function TradingViewChart({ symbol, interval = '60' }: Props) {
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
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    s.async = true;
    s.innerHTML = JSON.stringify({
      autosize: true, symbol, interval,
      timezone: 'Etc/UTC', theme: 'dark', style: '1',
      locale: 'en', hide_top_toolbar: false, hide_legend: false,
      withdateranges: true, save_image: false,
      backgroundColor: '#050B14',
      hide_side_toolbar: false, allow_symbol_change: false,
      details: true, hotlist: false, calendar: false,
      show_popup_button: true, popup_width: '1000', popup_height: '650',
    });
    container.current.appendChild(s);
    scriptEl.current = s;
  }, [symbol, interval]);

  useEffect(() => () => { if (container.current) container.current.innerHTML = ''; }, []);

  return (
    <div className="tradingview-widget-container" ref={container} style={{ width: '100%', height: '100%' }}>
      <div className="tradingview-widget-container__widget" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default memo(TradingViewChart);
