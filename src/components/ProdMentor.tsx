
import React, { useState, useEffect } from 'react';
import { ChatMessage, Conversation } from '@/types/chat';
import { UserProfile } from '@/types/pmNavigator';
import ChatInterface from './ChatInterface';
import ConversationSidebar from './ConversationSidebar';
import { generateAIResponse } from '@/utils/aiService';
import { conversationService } from '@/services/conversationService';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/components/ui/use-toast';

interface ProdMentorProps {
  userProfile: UserProfile;
  onLogout: () => void;
}

const ProdMentor = ({ userProfile, onLogout }: ProdMentorProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const { toast } = useToast();

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const loadedConversations = await conversationService.getConversations();
      setConversations(loadedConversations);
      
      // Set first conversation as active if exists
      if (loadedConversations.length > 0 && !activeConversationId) {
        setActiveConversationId(loadedConversations[0].id);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const createNewConversation = async (): Promise<Conversation> => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const newConversation: Conversation = {
      id: uuidv4(),
      user_id: user.id,
      title: 'New Conversation',
      messages: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    await conversationService.saveConversation(newConversation);
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    
    return newConversation;
  };

  const handleNewConversation = async () => {
    try {
      await createNewConversation();
    } catch (error) {
      console.error('Error creating new conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create new conversation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const handleSendMessage = async (content: string) => {
    try {
      let currentConvId = activeConversationId;
      
      // Create new conversation if none exists
      if (!currentConvId) {
        const newConv = await createNewConversation();
        currentConvId = newConv.id;
      }

      if (!currentConvId) return;

      // Add user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date(),
      };

      // Update conversation with user message
      const updatedConversation = conversations.find(c => c.id === currentConvId);
      if (!updatedConversation) return;

      const conversationWithUserMessage = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, userMessage],
        title: updatedConversation.messages.length === 0 ? content.slice(0, 50) + '...' : updatedConversation.title,
        updated_at: new Date()
      };

      setConversations(prev => prev.map(conv => 
        conv.id === currentConvId ? conversationWithUserMessage : conv
      ));

      // Save to database
      await conversationService.saveConversation(conversationWithUserMessage);

      // Generate AI response
      setIsLoading(true);
      const aiResponse = await generateAIResponse(content, conversationWithUserMessage.messages);
      
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        frameworks: aiResponse.frameworks,
        expertQuote: aiResponse.expertQuote,
      };

      const finalConversation = {
        ...conversationWithUserMessage,
        messages: [...conversationWithUserMessage.messages, assistantMessage],
        updated_at: new Date()
      };

      setConversations(prev => prev.map(conv => 
        conv.id === currentConvId ? finalConversation : conv
      ));

      // Save final conversation to database
      await conversationService.saveConversation(finalConversation);

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, errorMessage],
              updated_at: new Date()
            }
          : conv
      ));

      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId: string, helpful: boolean, feedback?: string) => {
    if (!activeConversationId) return;

    const updatedConversation = conversations.find(c => c.id === activeConversationId);
    if (!updatedConversation) return;

    const conversationWithFeedback = {
      ...updatedConversation,
      messages: updatedConversation.messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, helpful, feedback }
          : msg
      ),
      updated_at: new Date()
    };

    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId ? conversationWithFeedback : conv
    ));

    try {
      await conversationService.saveConversation(conversationWithFeedback);
    } catch (error) {
      console.error('Error saving feedback:', error);
    }

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

  if (isLoadingConversations) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    );
  }

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
            <div className="text-center">
              <p className="text-gray-500 mb-4">No conversations yet</p>
              <button
                onClick={handleNewConversation}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Start Your First Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProdMentor;
