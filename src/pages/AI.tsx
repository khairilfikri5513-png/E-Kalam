import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export default function AI() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', text: 'Marhaban! Saya Rakan Kalam AI. Anda boleh tanya saya tentang maksud perkataan, nombor, atau cara membaca dalam Bahasa Arab (Tahun 3).' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = [
    "Apa maksud قميص?",
    "Bantu saya ulang kaji warna.",
    "Apa nombor selepas ٢١?"
  ];

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    const userMsg = text.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      
      const data = await response.json();
      
      if (data.text) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: data.text }]);
      } else {
        throw new Error('No response');
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: 'Maaf, saya tidak dapat menjawab sekarang. Sila cuba sebentar lagi.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 flex items-center gap-3 border-b border-sky-100 sticky top-0 z-10 shadow-sm">
        <div className="w-12 h-12 bg-green/10 rounded-[18px] flex items-center justify-center border border-green/20 relative">
          <Bot className="w-7 h-7 text-green" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green border-2 border-white rounded-full"></div>
        </div>
        <div>
          <h1 className="font-bold text-navy text-lg leading-tight">Rakan Kalam AI</h1>
          <p className="text-[11px] text-green font-bold tracking-wide">● DALAM TALIAN</p>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-4 rounded-3xl text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-sky-100 text-navy rounded-tl-sm font-medium'}`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-sky-100 p-5 rounded-3xl rounded-tl-sm shadow-sm flex gap-1.5 items-center h-[56px]">
                <span className="w-2.5 h-2.5 bg-cyan rounded-full animate-bounce"></span>
                <span className="w-2.5 h-2.5 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-2.5 h-2.5 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endOfMessagesRef} className="h-2" />
      </div>
      
      {/* Quick suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button 
              key={idx}
              onClick={() => handleSend(q)}
              className="bg-white border border-sky-100 text-primary text-sm font-semibold px-4 py-2 rounded-full shadow-sm whitespace-nowrap active:scale-95 transition-transform"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white/90 backdrop-blur-md p-4 border-t border-sky-100 flex gap-2 pb-safe">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Tanya Rakan Kalam..."
          className="flex-1 bg-slate-50 border-2 border-sky-100 rounded-full px-5 py-3.5 outline-none focus:border-primary focus:bg-white transition-all text-[15px] font-medium text-navy placeholder:text-slate-400 shadow-inner"
        />
        <button 
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="w-[52px] h-[52px] bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:bg-slate-300 active:scale-95 transition-all shadow-md shadow-primary/30 shrink-0"
        >
          <Send className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
}
