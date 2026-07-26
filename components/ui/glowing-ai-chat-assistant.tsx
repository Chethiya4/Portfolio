import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Link, Code, Mic, Send, Info, Bot, X } from 'lucide-react';

const FloatingAiAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 2000;
  const chatRef = useRef(null);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    setCharCount(value.length);
  };

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
      setCharCount(0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        if (!event.target.closest('.floating-ai-button')) {
          setIsChatOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating 3D Glowing AI Logo */}
      <button 
        className={`floating-ai-button relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform ${
          isChatOpen ? 'rotate-90' : 'rotate-0'
        }`}
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          background: 'linear-gradient(135deg, #0052d4 0%, #00bfff 100%)',
          boxShadow: '0 0 25px rgba(0, 191, 255, 0.8), 0 0 50px rgba(0, 140, 255, 0.5)',
          border: '2px solid rgba(0, 210, 255, 0.35)',
        }}
      >
        {/* 3D effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent opacity-40"></div>
        
        {/* Inner glow */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20"></div>
        
        {/* AI Icon */}
        <div className="relative z-10">
        { isChatOpen ? <X /> :  <Bot className="w-8 h-8 text-white" />}
        </div>
        
        {/* Glowing animation */}
        <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-sky-400"></div>
      </button>

      {/* Chat Interface */}
      {isChatOpen && (
        <div 
          ref={chatRef}
          className="absolute bottom-20 right-0 w-max max-w-[500px] transition-all duration-300 origin-bottom-right"
          style={{
            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          }}
        >
          <div className="relative flex flex-col rounded-3xl bg-gradient-to-br from-slate-950/95 to-slate-900/98 border border-sky-500/30 shadow-2xl backdrop-blur-3xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-4 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-xs font-medium text-slate-400">AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-medium bg-sky-950/60 text-sky-400 border border-sky-500/20 rounded-2xl">
                  GPT-4
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-2xl">
                  Pro
                </span>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 rounded-full hover:bg-sky-900/30 transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Input Section */}
            <div className="relative overflow-hidden">
              <textarea
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={4}
                className="w-full px-6 py-4 bg-transparent border-none outline-none resize-none text-base font-normal leading-relaxed min-h-[120px] text-slate-100 placeholder-slate-500 scrollbar-none"
                placeholder="What would you like to explore today? Ask anything, share ideas, or request assistance..."
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              />
              <div 
                className="absolute inset-0 bg-gradient-to-t from-slate-950/10 to-transparent pointer-events-none"
              ></div>
            </div>

            {/* Controls Section */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Attachment Group */}
                  <div className="flex items-center gap-1.5 p-1 bg-slate-900/60 rounded-xl border border-sky-500/20">
                    {/* File Upload */}
                    <button className="group relative p-2.5 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-300 text-slate-400 hover:text-sky-300 hover:bg-sky-950/60 hover:scale-105 transform">
                      <Paperclip className="w-4 h-4 transition-all duration-300 group-hover:scale-125" />
                    </button>

                    {/* Link */}
                    <button className="group relative p-2.5 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-300 text-slate-400 hover:text-sky-300 hover:bg-sky-950/60 hover:scale-105 transform">
                      <Link className="w-4 h-4 transition-all duration-300 group-hover:scale-125" />
                    </button>

                    {/* Code */}
                    <button className="group relative p-2.5 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-300 text-slate-400 hover:text-emerald-400 hover:bg-sky-950/60 hover:scale-105 transform">
                      <Code className="w-4 h-4 transition-all duration-300 group-hover:scale-125" />
                    </button>

                    {/* Design (Figma icon) */}
                    <button className="group relative p-2.5 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-300 text-slate-400 hover:text-cyan-400 hover:bg-sky-950/60 hover:scale-105 transform">
                      <svg className="w-4 h-4 transition-all duration-300 group-hover:scale-125" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117v-6.038H8.148zm7.704 0c-2.476 0-4.49 2.015-4.49 4.49s2.014 4.49 4.49 4.49 4.49-2.015 4.49-4.49-2.014-4.49-4.49-4.49zm0 7.509c-1.665 0-3.019-1.355-3.019-3.019s1.355-3.019 3.019-3.019 3.019 1.354 3.019 3.019-1.354 3.019-3.019 3.019zM8.148 24c-2.476 0-4.49-2.015-4.49-4.49s2.014-4.49 4.49-4.49h4.588V24H8.148zm3.117-1.471V16.49H8.148c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.02 3.019 3.02h3.117z"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Voice Button */}
                  <button className="group relative p-2.5 bg-transparent border border-sky-500/20 rounded-lg cursor-pointer transition-all duration-300 text-slate-400 hover:text-cyan-300 hover:bg-sky-950/60 hover:scale-110 transform">
                    <Mic className="w-4 h-4 transition-all duration-300 group-hover:scale-125" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Character Counter */}
                  <div className="text-xs font-medium text-slate-400">
                    <span>{charCount}</span>/<span className="text-slate-500">{maxChars}</span>
                  </div>

                  {/* Send Button */}
                  <button 
                    onClick={handleSend}
                    className="group relative p-3 bg-gradient-to-r from-sky-500 to-cyan-400 border-none rounded-xl cursor-pointer transition-all duration-300 text-slate-950 font-bold shadow-lg hover:from-sky-400 hover:to-cyan-300 hover:scale-110 hover:shadow-cyan-500/40 hover:shadow-xl active:scale-95 transform"
                  >
                    <Send className="w-5 h-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-12 group-hover:scale-110" />
                  </button>
                </div>
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-500 gap-6">
                <div className="flex items-center gap-2">
                  <Info className="w-3 h-3" />
                  <span>
                    Press <kbd className="px-1.5 py-1 bg-slate-900 border border-sky-500/30 rounded text-slate-300 font-mono text-xs shadow-sm">Shift + Enter</kbd> for new line
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  <span>All systems operational</span>
                </div>
              </div>
            </div>

            {/* Floating Overlay */}
            <div 
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ 
                background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.05), transparent, rgba(0, 229, 255, 0.05))' 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export { FloatingAiAssistant };
