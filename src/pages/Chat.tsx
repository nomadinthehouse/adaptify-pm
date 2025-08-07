import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Chat.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthContext';
import { conversationService } from '@/services/conversationService';
import { ChatMessage } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

const sanitizeMarkdown = (content: string): string => {
  const lines = content.split('\n');
  const sanitizedLines = lines.map(line => {
    const isHeading = /^\s*#+\s+/.test(line);
    const isListItem = /^\s*[-*+]\s+/.test(line);

    if (isHeading || isListItem) {
      return line;
    } else {
      return line.replace(/^(\s*#+|\s*\*)/, '').trimStart();
    }
  });
  return sanitizedLines.join('\n');
};

const generateConversationalResponse = (userMessage: string): string => {
  const lowerUserMessage = userMessage.toLowerCase();

  if (lowerUserMessage.includes('hello') || lowerUserMessage.includes('hi')) {
    return "Hello there! How can I help you today?";
  } else if (lowerUserMessage.includes('how are you')) {
    return "I'm doing great, thanks for asking! How about you?";
  } else if (lowerUserMessage.includes('what is your name')) {
    return "I am a helpful AI assistant. You can call me ChatBot.";
  } else if (lowerUserMessage.includes('thank you') || lowerUserMessage.includes('thanks')) {
    return "You're welcome! Is there anything else I can assist you with?";
  } else if (lowerUserMessage.includes('bye') || lowerUserMessage.includes('goodbye')) {
    return "Goodbye! Have a great day!";
  } else {
    return "That's interesting! Tell me more.";
  }
};

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const conversations = await conversationService.getConversations();
      if (conversations.length > 0) {
        setConversationId(conversations[0].id);
        setMessages(conversations[0].messages);
      } else {
        const newConversationId = uuidv4();
        setConversationId(newConversationId);
      }
    };

    fetchConversations();

    const channel = supabase
      .channel('realtime-messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
        // This part needs to be adapted to the new conversation structure
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Generate a conversational response
    const aiResponseContent = generateConversationalResponse(newMessage);
    const aiMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: aiResponseContent,
      timestamp: new Date(),
    };

    const finalMessages = [...updatedMessages, aiMessage];
    setMessages(finalMessages);

    if (conversationId) {
      await conversationService.saveConversation({
        id: conversationId,
        user_id: user?.id || '',
        title: 'Conversation',
        messages: finalMessages,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    setNewMessage('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-200 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Conversations</h2>
        {/* Conversation history will go here */}
        <Button>New Conversation</Button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-bubble ${message.role}`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{sanitizeMarkdown(message.content)}</ReactMarkdown>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              className="flex-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button type="submit">Send</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
