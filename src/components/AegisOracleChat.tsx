import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, Loader2, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { APP_TRANSLATIONS } from '../translations';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface AegisOracleChatProps {
  language?: 'vi' | 'en';
}

export default function AegisOracleChat({ language = 'vi' }: AegisOracleChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = APP_TRANSLATIONS[language].chat;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set or update message list on language change if it only contain the greeting
  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([
        {
          role: 'model',
          text: t.welcomeMsg
        }
      ]);
    }
  }, [language, t.welcomeMsg]);

  // Auto-scroll to lowest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages, language }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error status during the handshake.');
      }

      const data = await response.json();
      
      setMessages(prev => [
        ...prev, 
        { role: 'model', text: data.reply || t.emptyMsg }
      ]);
    } catch (error) {
      console.error('Handshake failed:', error);
      setMessages(prev => [
        ...prev,
        { 
          role: 'model', 
          text: t.errorMsg 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetQueries = t.presets;

  return (
    <div id="aegis-oracle-chatbox-wrapper" className="fixed bottom-6 right-6 z-50 font-sans text-xs w-[310px] sm:w-auto">
      <AnimatePresence>
        {!isOpen ? (
          // Sleek Minimal Trigger Button
          <motion.button
            id="aegis-chat-trigger"
            key="chat-trigger"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 15 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 bg-[#00101b]/80 border border-white/10 backdrop-blur-md rounded-full pl-4 pr-5 py-3 hover:bg-[#001c2e]/90 hover:border-white/20 transition-all duration-300 shadow-2xl cursor-pointer group hover:scale-[1.03]"
          >
            <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/5 border border-white/10">
              <Sparkles className="w-3 h-3 text-white/80 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#d4af37] rounded-full" />
            </div>
            <div className="text-left leading-none">
              <p className="text-[10px] text-white/55 uppercase font-mono tracking-wider">{language === 'vi' ? 'TRUY VẤN AI' : 'SOVEREIGN AI'}</p>
              <p className="text-white font-medium text-[11px] mt-0.5">{language === 'vi' ? 'Trợ Lý Aegis' : 'Aegis Oracle'}</p>
            </div>
          </motion.button>
        ) : (
          // Gorgeous Minimalist Luxury Chat Panel
          <motion.div
            id="aegis-chat-panel"
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.95, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 25 }}
            transition={{ type: 'spring', damping: 24, stiffness: 220 }}
            className="w-[310px] sm:w-[410px] h-[550px] bg-[#000e17]/95 border border-white/10 backdrop-blur-2xl rounded-2xl flex flex-col justify-between shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-7 h-7 rounded-full bg-white/5 border border-white/15 flex items-center justify-center p-1">
                  <Sparkles className="w-3.5 h-3.5 text-white/90" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#000e17]" />
                </div>
                <div className="text-left">
                  <h4 className="text-white font-medium tracking-tight text-xs uppercase font-sans">{t.title}</h4>
                  <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground/80 font-mono mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{language === 'vi' ? 'ĐƯỜNG TRUYỀN KIỂM TÁC BẢO MẬT' : 'SECURE DIRECT MATRIX FEED'}</span>
                  </div>
                </div>
              </div>

              <button
                id="aegis-chat-close"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Messages Output Frame */}
            <div className="flex-grow p-5 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-left leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-white/15 border border-white/10 text-white text-[11px]'
                        : 'bg-white/[0.02] border border-white/[0.05] text-muted-foreground text-[11px]'
                    }`}
                  >
                    {/* Role Tag for Extreme Minimalism */}
                    <p className={`text-[8px] font-mono tracking-wider uppercase mb-1 ${
                      msg.role === 'user' ? 'text-white/40' : 'text-[#d4af37]/75'
                    }`}>
                      {msg.role === 'user' ? (language === 'vi' ? 'Freight Forwarder' : 'Inquirer') : (language === 'vi' ? 'Trợ Lý Aegis' : 'Oracle Advisor')}
                    </p>
                    <p className="whitespace-pre-line font-light">{msg.text}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3 max-w-[85%] text-left">
                    <p className="text-[8px] font-mono tracking-wider text-[#d4af37]/75 uppercase mb-1">{language === 'vi' ? 'Trợ Lý Aegis' : 'Oracle Advisor'}</p>
                    <div className="flex items-center gap-2 text-muted-foreground/75 font-mono text-[10px]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white/40" />
                      <span>{language === 'vi' ? 'Đang truy vấn quy tắc...' : 'Querying tariff schedules...'}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Presets and Controls */}
            <div className="p-4 border-t border-white/[0.06] bg-white/[0.005]">
              {messages.length === 1 && (
                <div className="mb-3 space-y-1.5 text-left">
                  <p className="text-[9px] font-mono text-muted-foreground/60 uppercase tracking-widest pl-1">{t.presetsTitle}</p>
                  <div className="flex flex-col gap-1">
                    {presetQueries.map((query, k) => (
                      <button
                        key={k}
                        onClick={() => handleSendMessage(query)}
                        className="text-left bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/10 rounded-lg px-3 py-2 text-white/80 hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <span className="truncate pr-2 font-mono text-[10px]">{query}</span>
                        <ArrowUpRight className="w-3 h-3 text-white/30 group-hover:text-white/80 transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TextInput Console */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="flex items-center gap-2"
              >
                <input
                  id="aegis-chat-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t.placeholder}
                  className="flex-grow bg-white/[0.03] border border-white/[0.08] focus:border-white/20 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-muted-foreground/35 outline-none transition-all font-mono"
                />
                <button
                  id="aegis-chat-submit"
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:hover:bg-white/10 cursor-pointer hover:scale-[1.02]"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
