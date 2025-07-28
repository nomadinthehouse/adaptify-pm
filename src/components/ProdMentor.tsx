
import React, { useState, useEffect } from 'react';
import { ChatMessage, Conversation } from '@/types/chat';
import { UserProfile } from '@/types/pmNavigator';
import ChatInterface from './ChatInterface';
import ConversationSidebar from './ConversationSidebar';
import { generateAIResponse } from '@/utils/aiService';
import { v4 as uuidv4 } from 'uuid';

interface ProdMentorProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

const ProdMentor = ({ userProfile, onLogout }: ProdMentorProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const createNewConversation = (): Conversation => {
    const newConversation: Conversation = {
      id: uuidv4(),
      user_id: userProfile.user_id,
      title: 'New Conversation',
      messages: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    
    return newConversation;
  };

  const handleNewConversation = () => {
    createNewConversation();
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) {
      const newConv = createNewConversation();
      setActiveConversationId(newConv.id);
    }

    const currentConvId = activeConversationId || conversations[0]?.id;
    if (!currentConvId) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setConversations(prev => prev.map(conv => 
      conv.id === currentConvId 
        ? { 
            ...conv, 
            messages: [...conv.messages, userMessage],
            title: conv.messages.length === 0 ? content.slice(0, 50) + '...' : conv.title,
            updated_at: new Date()
          }
        : conv
    ));

    // Generate AI response
    setIsLoading(true);
    try {
      const conversation = conversations.find(c => c.id === currentConvId);
      const aiResponse = await generateAIResponse(content, conversation?.messages || []);
      
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        frameworks: aiResponse.frameworks,
        expertQuote: aiResponse.expertQuote,
      };

      setConversations(prev => prev.map(conv => 
        conv.id === currentConvId 
          ? { 
              ...conv, 
              messages: [...conv.messages, assistantMessage],
              updated_at: new Date()
            }
          : conv
      ));
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setConversations(prev => prev.map(conv => 
        conv.id === currentConvId 
          ? { 
              ...conv, 
              messages: [...conv.messages, errorMessage],
              updated_at: new Date()
            }
          : conv
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageId: string, helpful: boolean, feedback?: string) => {
    if (!activeConversationId) return;

    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? {
            ...conv,
            messages: conv.messages.map(msg => 
              msg.id === messageId 
                ? { ...msg, helpful, feedback }
                : msg
            )
          }
        : conv
    ));

    // Log feedback for improvement
    console.log('Feedback received:', { messageId, helpful, feedback });
  };

  const handleExport = () => {
    if (!activeConversation) return;

    const exportData = {
      title: activeConversation.title,
      date: activeConversation.created_at.toISOString(),
      messages: activeConversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        frameworks: msg.frameworks,
        expertQuote: msg.expertQuote
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prodmentor-${activeConversation.title.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Initialize with first conversation
  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation();
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onLogout={onLogout}
        userProfile={userProfile}
      />
      
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <ChatInterface
            conversation={activeConversation}
            onSendMessage={handleSendMessage}
            onFeedback={handleFeedback}
            onExport={handleExport}
            isLoading={isLoading}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a conversation to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProdMentor;
