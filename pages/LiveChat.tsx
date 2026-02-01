import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, MoreHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const LiveChat: React.FC = () => {
  const { user } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'bot', text: 'Hello! Welcome to IC Club Support. How can I help you today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Thanks for your message. An admin is currently offline, but your query has been logged. We will email you shortly.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-surface rounded-3xl border border-gray-200 shadow-card overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
              <Bot size={20} />
           </div>
           <div>
              <h3 className="font-bold text-primary text-sm">Support Bot</h3>
              <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
              </p>
           </div>
        </div>
        <button className="text-secondary hover:text-primary"><MoreHorizontal size={20} /></button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-white border border-gray-200 text-primary rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-gray-400' : 'text-gray-400'}`}>
                 {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <form onSubmit={handleSend} className="flex gap-2">
           <input 
             type="text" 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
             placeholder="Type your message..."
           />
           <button 
             type="submit" 
             disabled={!input.trim()}
             className="bg-primary hover:bg-gray-800 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <Send size={20} />
           </button>
        </form>
      </div>
    </div>
  );
};