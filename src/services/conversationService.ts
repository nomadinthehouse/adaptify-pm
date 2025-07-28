
import { supabase } from '@/integrations/supabase/client';
import { Conversation, DatabaseConversation, ChatMessage } from '@/types/chat';

export const conversationService = {
  async getConversations(): Promise<Conversation[]> {
    const { data, error } = await (supabase as any)
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }

    return (data as DatabaseConversation[]).map(conv => ({
      ...conv,
      created_at: new Date(conv.created_at),
      updated_at: new Date(conv.updated_at),
      messages: conv.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  },

  async saveConversation(conversation: Conversation): Promise<void> {
    const { error } = await (supabase as any)
      .from('conversations')
      .upsert({
        id: conversation.id,
        user_id: conversation.user_id,
        title: conversation.title,
        messages: conversation.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString()
        })),
        created_at: conversation.created_at.toISOString(),
        updated_at: conversation.updated_at.toISOString()
      });

    if (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  },

  async deleteConversation(conversationId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
};
