import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, BookOpen, ChevronRight } from 'lucide-react';
import aiService, { ChatCitation } from '../../../services/api/ai.service';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  citations?: ChatCitation[];
  timestamp: Date;
}

interface ChatBotProps {
  courseId?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ courseId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your Lecture Material Assistant. Ask me anything about your course content!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFallbackResponse = (answer: string) =>
    /trouble connecting to my ai brain/i.test(answer);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !courseId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.askQuestion(courseId, input);
      const shouldHideCitations = isFallbackResponse(response.answer);
      if (shouldHideCitations) {
        toast.error('AI assistant is temporarily unavailable. Please try again soon.');
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.answer,
        citations: shouldHideCitations ? undefined : response.citations,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      toast.error('Failed to get response from AI');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 bg-primary-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-primary-700 transition-all transform hover:scale-110"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] sm:w-[400px] h-[500px] flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Lecture Assistant</h3>
                <p className="text-[10px] text-primary-100">Answers from your materials</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                  m.type === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                }`}>
                  <div className="flex items-start space-x-2">
                    {m.type === 'bot' && <Bot className="h-4 w-4 mt-0.5 text-primary-600" />}
                    <div className="whitespace-pre-wrap">{m.content}</div>
                    {m.type === 'user' && <User className="h-4 w-4 mt-0.5 text-primary-200" />}
                  </div>
                  
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sources:</p>
                      <div className="space-y-1">
                        {m.citations.map((c, i) => (
                          <div key={i} className="flex items-center text-[11px] text-primary-700 bg-primary-50 p-1.5 rounded hover:bg-primary-100 cursor-pointer transition-colors">
                            <BookOpen className="h-3 w-3 mr-1.5" />
                            <span className="flex-1 truncate">
                              {c.metadata.page ? `Page ${c.metadata.page}` : 
                               c.metadata.slide ? `Slide ${c.metadata.slide}` : 'Lecture Material'}
                            </span>
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex space-x-1">
                  <div className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                  <div className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the lectures..."
              className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
