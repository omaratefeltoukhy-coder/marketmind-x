import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import TradingViewTicker from '@/components/TradingViewTicker';
import Dashboard from '@/pages/Dashboard';
import Analysis from '@/pages/Analysis';
import Markets from '@/pages/Markets';
import Scanner from '@/pages/Scanner';
import TradeSetups from '@/pages/TradeSetups';
import Alerts from '@/pages/Alerts';
import Strategies from '@/pages/Strategies';
import Calendar from '@/pages/Calendar';
import News from '@/pages/News';
import Login from '@/pages/Login';
import Settings from '@/pages/Settings';
import AIAgent from '@/pages/AIAgent';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <TradingViewTicker />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/setups" element={<TradeSetups />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/strategies" element={<Strategies />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai-agent" element={<AIAgent />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
