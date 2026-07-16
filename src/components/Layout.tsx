import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, Globe, Radar, Target, Bell, Zap,
  CalendarDays, Newspaper, LogIn, Settings, Sparkles, Menu, X
} from 'lucide-react';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analysis', label: 'Chart Analysis', icon: BarChart3 },
  { to: '/markets', label: 'Markets', icon: Globe },
  { to: '/scanner', label: 'Scanner', icon: Radar },
  { to: '/setups', label: 'Trade Setups', icon: Target },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/strategies', label: 'Strategies', icon: Zap },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/news', label: 'News', icon: Newspaper },
  { to: '/ai-agent', label: 'AI Agent', icon: Sparkles },
  { to: '/login', label: 'Login', icon: LogIn },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-[#050B14] text-[#F8FAFC]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-[220px] bg-[#0B1120] border-r border-[#1E293B] flex flex-col transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#22D3EE] flex items-center justify-center">
              <Sparkles size={14} className="text-[#050B14]" />
            </div>
            <span className="font-black text-sm tracking-tight">MarketMind<span className="text-[#22D3EE]">X</span></span>
          </div>
          <button className="lg:hidden text-[#94A3B8]" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {NAV.map(item => {
            const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to));
            return (
              <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${active ? 'bg-[#22D3EE]/10 text-[#22D3EE]' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]'}`}>
                <item.icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#1E293B]">
          <p className="text-[9px] text-[#475569] text-center">v2.0.0 · TradingView Powered</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-[220px] min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-3 border-b border-[#1E293B] bg-[#0B1120]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#22D3EE] flex items-center justify-center">
              <Sparkles size={12} className="text-[#050B14]" />
            </div>
            <span className="font-black text-xs">MarketMind<span className="text-[#22D3EE]">X</span></span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-[#94A3B8]"><Menu size={18} /></button>
        </div>

        <div className="p-4 lg:p-5">
          {children}
        </div>
      </main>
    </div>
  );
}
