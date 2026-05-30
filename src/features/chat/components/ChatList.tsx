import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/core/auth/hooks/useAuth';
import type { Chat } from '@/shared/types';

interface ChatListProps {
  chats: Chat[];
  activeChatId?: string;
}

export function ChatList({ chats, activeChatId }: ChatListProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col">
      {chats.map((chat) => {
        const otherUser = chat.other_user;
        const lastMsg = chat.last_message;
        const isActive = chat.id === activeChatId;
        const unreadCount = chat.unread_count || 0;
        
        // Safety check
        if (!otherUser) return null;

        return (
          <button
            key={chat.id}
            onClick={() => navigate(`/mensajes/${chat.id}`)}
            className={`w-full text-left p-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800/60 transition-colors ${
              isActive 
                ? 'bg-primary-50 dark:bg-primary-900/10 border-l-4 border-l-primary-500' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 border-l-transparent'
            }`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden">
                {otherUser.avatar_url ? (
                  <img src={otherUser.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-medium text-primary-600 dark:text-primary-300">
                    {otherUser.full_name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white border-2 border-white dark:border-gray-900">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-sm truncate pr-2 ${unreadCount > 0 ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-800 dark:text-gray-200'}`}>
                  {otherUser.full_name}
                </span>
                {lastMsg && (
                  <span className={`text-[10px] whitespace-nowrap flex-shrink-0 ${unreadCount > 0 ? 'font-medium text-primary-600 dark:text-primary-400' : 'text-gray-400'}`}>
                    {formatDistanceToNow(new Date(lastMsg.created_at), { addSuffix: false, locale: es })}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between gap-2">
                <p className={`text-xs truncate ${unreadCount > 0 ? 'font-medium text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                  {lastMsg ? (
                    <>
                      {lastMsg.sender_id === user?.id && <span className="text-gray-400 mr-1">Tú:</span>}
                      {lastMsg.content}
                    </>
                  ) : (
                    <span className="italic text-gray-400">Conversación iniciada</span>
                  )}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
