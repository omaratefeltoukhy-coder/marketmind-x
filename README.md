# MarketMind X

AI-powered Trading Intelligence Platform with real-time TradingView integration.

## Features

- **TradingView Live Data** — All prices and analysis come directly from TradingView widgets
- **Advanced Charting** — Full TradingView Advanced Chart with 7 timeframes
- **Live Scanner** — Real-time setup detection with TradingView Symbol Info + Technical Analysis
- **Trade Setups** — Detailed cards with R:R ratios, SL/TP levels, confluence checklists
- **Dashboard** — Favorites system with localStorage persistence
- **AI Agent** — Integrated with Moonshot AI for trade analysis
- **12 Pages** — Dashboard, Chart Analysis, Markets, Scanner, Trade Setups, Alerts, Strategies, Calendar, News, AI Agent, Login, Settings

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui (50+ components)
- TradingView Widgets
- Framer Motion
- HashRouter

## TradingView Instruments (33)

Forex: EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, NZD/USD, EUR/GBP, GBP/JPY, EUR/JPY
Commodities: XAU/USD, XAG/USD, WTI, Brent, Natural Gas
Indices: US30, SPX500, NAS100, GER40, UK100
Crypto: BTC/USD, ETH/USD, SOL/USD
Futures: GC, SI, HG, CL, NG, ZC, ZW, ZS, LE

## Development

```bash
npm install
npm run dev
npm run build
```

## Deployment

```bash
npm run build
cp -r dist /path/to/deploy
```

## License

MIT
