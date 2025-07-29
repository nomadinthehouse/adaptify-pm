import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, User, Settings, MessageSquare, Plus, LogIn, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { generateAIResponse } from '@/utils/aiService';
import { v4 as uuidv4 } from 'uuid';
import { UserProfile } from '@/types/pmNavigator';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

interface ChatGPTInterfaceProps {
  userProfile: UserProfile | null;
  session: any;
  onLogout: () => void;
}

const ChatGPTInterface = ({ userProfile, session, onLogout }: ChatGPTInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(input.trim(), messages);
      
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        frameworks: aiResponse.frameworks,
        expertQuote: aiResponse.expertQuote,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewChat = () => {
    setMessages([]);
  };

  if (showAuth && !session) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Sign in to PM Navigator</h1>
            <p className="text-muted-foreground">Save your conversations and get personalized guidance</p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--primary))',
                    },
                  },
                },
              }}
              providers={[]}
              redirectTo={window.location.origin}
            />
            <Button 
              variant="ghost" 
              onClick={() => setShowAuth(false)}
              className="w-full mt-4"
            >
              Continue without signing in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r flex flex-col">
        <div className="p-4">
          <Button 
            onClick={startNewChat}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
            New chat
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {/* Conversation history would go here */}
        </div>
        
        <div className="p-4 border-t">
          {session ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                <span className="truncate">{userProfile?.name || session.user.email}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onLogout}
                className="w-full justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              onClick={() => setShowAuth(true)}
              className="w-full justify-start"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Log in
            </Button>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-background/50 backdrop-blur-sm p-4">
          <div className="text-center">
            <h1 className="text-xl font-semibold">PM Navigator</h1>
            <p className="text-sm text-muted-foreground">Your AI Product Management Mentor</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
                <p className="text-muted-foreground mb-6">
                  I'm here to help you with product management challenges, frameworks, and strategic decisions.
                </p>
                <div className="grid gap-2 text-sm">
                  <Button variant="outline" onClick={() => setInput("How do I prioritize features effectively?")}>
                    How do I prioritize features effectively?
                  </Button>
                  <Button variant="outline" onClick={() => setInput("My user engagement is dropping, what framework should I use?")}>
                    My user engagement is dropping, what framework should I use?
                  </Button>
                  <Button variant="outline" onClick={() => setInput("How do I run effective discovery interviews?")}>
                    How do I run effective discovery interviews?
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="group">
                  <div className={`flex gap-4 ${message.role === 'assistant' ? 'items-start' : 'items-end justify-end'}`}>
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        AI
                      </div>
                    )}
                    
                    <div className={`flex-1 ${message.role === 'user' ? 'max-w-xs ml-auto' : 'max-w-none'}`}>
                      {message.role === 'user' && (
                        <div className="text-xs text-muted-foreground mb-1 text-right">You</div>
                      )}
                      
                      <div className={`rounded-lg p-4 ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground ml-auto' 
                          : 'bg-muted'
                      }`}>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <p className="whitespace-pre-wrap m-0">{message.content}</p>
                        </div>
                      </div>
                      
                      {/* Framework badges */}
                      {message.frameworks && message.frameworks.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.frameworks.map((framework) => (
                            <Badge key={framework} variant="secondary" className="text-xs">
                              {framework}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Expert quote */}
                      {message.expertQuote && (
                        <div className="mt-3 p-3 bg-accent/50 rounded-lg border-l-4 border-primary">
                          <div className="text-sm">
                            <p className="font-medium text-foreground">Expert Insight</p>
                            <p className="text-muted-foreground italic mt-1">"{message.expertQuote.quote}"</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              — {message.expertQuote.expert}
                              {message.expertQuote.source && ` (${message.expertQuote.source})`}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                        {session ? (userProfile?.name?.[0] || 'U') : 'U'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    AI
                  </div>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <div className="animate-pulse flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t bg-background/50 backdrop-blur-sm p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message PM Navigator..."
                className="min-h-[60px] max-h-32 pr-12 resize-none border-muted-foreground/20 focus:border-primary"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="absolute bottom-2 right-2 h-8 w-8 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              PM Navigator can help with product management questions, frameworks, and strategic guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGPTInterface;