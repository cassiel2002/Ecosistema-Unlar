import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/core/supabase/client';
import { useAuth } from '@/core/auth/hooks/useAuth';
import type { Chat, Message, UserProfile } from '@/shared/types';

export function useChat() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Fetch all chats for the current user
  const { data: chats = [], isLoading: isLoadingChats } = useQuery({
    queryKey: ['chats', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('chats')
        .select(`
          id, created_at, updated_at, user1_id, user2_id
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw new Error(error.message);

      // Enhance chats with other user's profile and last message
      const enhancedChats = await Promise.all(
        data.map(async (chat) => {
          const otherUserId = chat.user1_id === user.id ? chat.user2_id : chat.user1_id;
          
          // Get other user profile
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', otherUserId)
            .single();

          // Get last message
          const { data: lastMsgData } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chat.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          // Get unread count (messages not sent by me, and not read)
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('chat_id', chat.id)
            .eq('is_read', false)
            .neq('sender_id', user.id);

          return {
            ...chat,
            other_user: profileData as UserProfile,
            last_message: lastMsgData as Message | undefined,
            unread_count: count ?? 0,
          };
        })
      );

      // Sort again by last_message date or updated_at
      return enhancedChats.sort((a, b) => {
        const dateA = a.last_message ? new Date(a.last_message.created_at).getTime() : new Date(a.updated_at).getTime();
        const dateB = b.last_message ? new Date(b.last_message.created_at).getTime() : new Date(b.updated_at).getTime();
        return dateB - dateA;
      });
    },
    enabled: !!user,
  });

  // 2. Fetch messages for a specific chat
  const useMessages = (chatId?: string) => {
    return useQuery({
      queryKey: ['messages', chatId],
      queryFn: async () => {
        if (!chatId) return [];
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });

        if (error) throw new Error(error.message);
        return data as Message[];
      },
      enabled: !!chatId,
    });
  };

  // 3. Send a message
  const sendMessageMutation = useMutation({
    mutationFn: async ({ chatId, content }: { chatId: string; content: string }) => {
      if (!user) throw new Error('No auth');
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          content,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Message;
    },
    onSuccess: (newMessage) => {
      // Optimistically update query cache for messages
      queryClient.setQueryData(['messages', newMessage.chat_id], (old: Message[] | undefined) => {
        if (!old) return [newMessage];
        // Ensure we don't duplicate if realtime already pushed it
        if (old.some((m) => m.id === newMessage.id)) return old;
        return [...old, newMessage];
      });
      // Invalidate chats to update last_message and sort order
      queryClient.invalidateQueries({ queryKey: ['chats', user?.id] });
    },
  });

  // 4. Create or Get Chat
  const createOrGetChatMutation = useMutation({
    mutationFn: async (otherUserId: string) => {
      if (!user) throw new Error('No auth');
      if (user.id === otherUserId) throw new Error('Cannot chat with yourself');

      // Check if chat exists (where user1 = me and user2 = other, OR user1 = other and user2 = me)
      const { data: existingChats, error: searchError } = await supabase
        .from('chats')
        .select('*')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${user.id})`)
        .limit(1);

      if (searchError) throw new Error(searchError.message);

      if (existingChats && existingChats.length > 0) {
        return existingChats[0] as Chat;
      }

      // Create new chat
      const { data: newChat, error: insertError } = await supabase
        .from('chats')
        .insert({
          user1_id: user.id,
          user2_id: otherUserId,
        })
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);
      return newChat as Chat;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats', user?.id] });
    },
  });

  // 5. Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async (chatId: string) => {
      if (!user) return;
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('chat_id', chatId)
        .eq('is_read', false)
        .neq('sender_id', user.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: (_, chatId) => {
      queryClient.invalidateQueries({ queryKey: ['chats', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    },
  });

  // 6. Realtime Subscription Effect for Messages
  const useMessageSubscription = (chatId?: string) => {
    useEffect(() => {
      if (!chatId || !user) return;

      const channel = supabase
        .channel(`chat_${chatId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `chat_id=eq.${chatId}`,
          },
          (payload) => {
            const newMessage = payload.new as Message;
            
            // Append to messages list if not sent by me (my messages are optimistically added)
            if (newMessage.sender_id !== user.id) {
               queryClient.setQueryData(['messages', chatId], (old: Message[] | undefined) => {
                 if (!old) return [newMessage];
                 if (old.some((m) => m.id === newMessage.id)) return old;
                 return [...old, newMessage];
               });
               // Mark as read automatically since we are in the chat room
               markAsReadMutation.mutate(chatId);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, [chatId, user]);
  };

  return {
    chats,
    isLoadingChats,
    useMessages,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    createOrGetChat: createOrGetChatMutation.mutateAsync,
    isCreatingChat: createOrGetChatMutation.isPending,
    markAsRead: markAsReadMutation.mutate,
    useMessageSubscription,
  };
}
