import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, TrendingUp, TrendingDown, Shield, Target, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are MarketMind X AI, an elite trading analyst specializing in SMC (Smart Money Concepts), ICT (Inner Circle Trader), and institutional order flow analysis. You provide actionable trade setups with exact entry, stop loss, and take profit levels.

When analyzing a setup, structure your response as follows:
- BIAS: BULLISH or BEARISH
- SETUP: Brief name
- ENTRY: Exact price
- SL: Stop loss price
- TP1/TP2/TP3: Take profit levels
- CONFIDENCE: 0-100%
- RATIONALE: 2-3 sentences

Format: Use clear sections. Be concise and precise.`;

export default function AIAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://api.moonshot.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-QPC7E5WwtE8EXqvz8jVNUZKku8c6dSsm8kg2QhjKV04YGoze',
        },
        body: JSON.stringify({
          model: 'moonshot-v1-8k',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.filter(m => m.role === 'assistant').slice(-3).map(m => ({ role: 'assistant' as const, content: m.content })),
            { role: 'user', content: userMsg.content },
          ],
          temperature: 0.7,
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      const assistantContent = data.choices?.[0]?.message?.content || 'No response from AI. Please try again.';

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `AI Service Error: ${err instanceof Error ? err.message : 'Unknown error'}. \n\nPlease check your API key or try again later.`,
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-140px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#22D3EE] to-[#3B82F6] flex items-center justify-center">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#F8FAFC]">AI Trading Agent</h1>
          <p className="text-[10px] text-[#64748B]">Powered by Moonshot AI · SMC/ICT Analysis</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22D3EE]/20 to-[#3B82F6]/20 flex items-center justify-center mb-4">
              <Sparkles size={28} className="text-[#22D3EE]" />
            </div>
            <h2 className="text-sm font-bold text-[#94A3B8] mb-2">AI Trading Assistant</h2>
            <p className="text-xs text-[#64748B] max-w-md mb-6">
              Ask me to analyze any instrument, generate trade setups, explain SMC concepts, or review your trading plan.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'Analyze XAU/USD on 4H',
                'Find SMC setup on EUR/USD',
                'Explain Order Block strategy',
                'BTC/USD bias this week?',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="px-3 py-1.5 rounded-lg text-[11px] bg-[#0F172A] border border-[#334155] text-[#94A3B8] hover:border-[#22D3EE]/50 hover:text-[#F8FAFC] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i === messages.length - 1 ? 0 : 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-center gap-2 mb-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-5 h-5 rounded bg-gradient-to-br from-[#22D3EE] to-[#3B82F6] flex items-center justify-center">
                    <Sparkles size={10} className="text-white" />
                  </div>
                )}
                <span className="text-[10px] text-[#64748B]">
                  {msg.role === 'user' ? 'You' : 'AI Agent'} · {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className={`p-3 rounded-xl text-[12px] leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#F8FAFC]'
                  : 'glass-card border border-[#334155] text-[#94A3B8]'
              }`}>
                {msg.content}
              </div>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-[#64748B]">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-[11px]">AI is analyzing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 flex gap-2">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about any instrument, setup, or strategy..."
          className="flex-1 bg-[#0F172A] border border-[#334155] rounded-xl px-4 py-3 text-[12px] text-[#F8FAFC] placeholder:text-[#475569] focus:outline-none focus:border-[#22D3EE]/50 resize-none h-[60px]"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="px-4 bg-gradient-to-r from-[#22D3EE] to-[#3B82F6] text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
