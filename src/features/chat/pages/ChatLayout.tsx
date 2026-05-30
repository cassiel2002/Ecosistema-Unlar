import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/core/auth/hooks/useAuth';
import { useChat } from '@/shared/hooks/useChat';
import { ChatList } from '../components/ChatList';
import { ChatRoom } from '../components/ChatRoom';
import { Skeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';

export function ChatLayout() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { chats, isLoadingChats } = useChat();

  // If not logged in, empty state or redirect
  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <EmptyState
          title="Iniciá sesión"
          description="Necesitás estar conectado para ver tus mensajes."
        />
      </div>
    );
  }

  const isMobile = window.innerWidth < 768;
  const showList = !isMobile || !chatId;
  const showRoom = !isMobile || chatId;

  const selectedChat = chats.find((c) => c.id === chatId);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col md:h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-950 overflow-hidden">
      
      {/* Mobile Header (when in room) */}
      {isMobile && chatId && (
        <div className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
          <button 
            onClick={() => navigate('/mensajes')}
            className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          {selectedChat?.other_user && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                {selectedChat.other_user.avatar_url ? (
                  <img src={selectedChat.other_user.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
                    {selectedChat.other_user.full_name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                {selectedChat.other_user.full_name}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex w-full max-w-6xl mx-auto md:p-4 overflow-hidden">
        <div className="flex w-full h-full md:border md:border-gray-200 md:dark:border-gray-800 md:rounded-2xl md:overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
          
          {/* Chat List Sidebar */}
          {showList && (
            <div className={`flex flex-col h-full border-r border-gray-200 dark:border-gray-800 ${isMobile ? 'w-full' : 'w-80 lg:w-96 flex-shrink-0'}`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-primary-500" />
                  Mensajes
                </h1>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                {isLoadingChats ? (
                  <div className="p-4 space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                       <div key={i} className="flex gap-3">
                         <Skeleton variant="circular" width={48} height={48} />
                         <div className="flex-1 space-y-2 py-1">
                           <Skeleton variant="text" width="60%" height={16} />
                           <Skeleton variant="text" width="90%" height={14} />
                         </div>
                       </div>
                    ))}
                  </div>
                ) : chats.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p>No tenés conversaciones activas.</p>
                  </div>
                ) : (
                  <ChatList chats={chats} activeChatId={chatId} />
                )}
              </div>
            </div>
          )}

          {/* Chat Room Area */}
          {showRoom && (
            <div className={`flex flex-col h-full bg-gray-50/50 dark:bg-gray-950/50 ${isMobile ? 'w-full' : 'flex-1'}`}>
              {chatId ? (
                <ChatRoom chatId={chatId} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-primary-500 opacity-60" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tus Mensajes</h3>
                  <p className="mt-1 text-sm text-gray-500 max-w-sm">
                    Seleccioná una conversación a la izquierda para empezar a chatear con otros usuarios del Ecosistema.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
