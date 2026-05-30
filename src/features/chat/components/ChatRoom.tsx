import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { useChat } from '@/shared/hooks/useChat';

interface ChatRoomProps {
  chatId: string;
}

export function ChatRoom({ chatId }: ChatRoomProps) {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { useMessages, sendMessage, isSending, useMessageSubscription, markAsRead } = useChat();
  const { data: messages = [], isLoading } = useMessages(chatId);

  // Subscribe to new realtime messages
  useMessageSubscription(chatId);

  // Mark as read when entering the room
  useEffect(() => {
    if (chatId) {
      markAsRead(chatId);
    }
  }, [chatId, markAsRead]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const content = inputValue.trim();
    setInputValue(''); // Optimistic clear

    try {
      await sendMessage({ chatId, content });
    } catch (error) {
      console.error('Failed to send message:', error);
      setInputValue(content); // Restore on error
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <p>No hay mensajes en esta conversación.</p>
            <p className="text-xs mt-1">¡Escribí algo para saludar!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const isMine = msg.sender_id === user?.id;
              
              // Simple date grouping logic could go here
              const showDate = idx === 0 || new Date(msg.created_at).getDate() !== new Date(messages[idx-1].created_at).getDate();

              return (
                <div key={msg.id} className="flex flex-col">
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                        {format(new Date(msg.created_at), "d 'de' MMMM", { locale: es })}
                      </span>
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex flex-col max-w-[80%] ${isMine ? 'self-end items-end' : 'self-start items-start'} mb-1`}
                  >
                    <div 
                      className={`px-4 py-2 rounded-2xl ${
                        isMine 
                          ? 'bg-primary-600 text-white rounded-br-sm' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 mx-1">
                      {format(new Date(msg.created_at), "HH:mm")}
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribí un mensaje..."
            className="flex-1 bg-gray-100 dark:bg-gray-800 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 focus:ring-1 focus:ring-primary-500 rounded-full px-4 py-2.5 text-sm transition-all text-gray-900 dark:text-white placeholder-gray-500"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isSending}
            className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-primary-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4 ml-0.5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
