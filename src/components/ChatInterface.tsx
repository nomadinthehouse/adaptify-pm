
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Conversation } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Send, ThumbsUp, ThumbsDown, Download, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface ChatInterfaceProps {
  conversation: Conversation;
  onSendMessage: (message: string) => void;
  onFeedback: (messageId: string, helpful: boolean, feedback?: string) => void;
  onExport: () => void;
  isLoading: boolean;
}

const ChatInterface = ({ 
  conversation, 
  onSendMessage, 
  onFeedback, 
  onExport, 
  isLoading 
}: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [feedbackText, setFeedbackText] = useState<{ [key: string]: string }>({});
  const [showFeedback, setShowFeedback] = useState<{ [key: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFeedback = (messageId: string, helpful: boolean) => {
    if (showFeedback[messageId]) {
      onFeedback(messageId, helpful, feedbackText[messageId]);
      setShowFeedback({ ...showFeedback, [messageId]: false });
    } else {
      onFeedback(messageId, helpful);
      if (!helpful) {
        setShowFeedback({ ...showFeedback, [messageId]: true });
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">ProdMentor</h2>
          <p className="text-sm text-gray-600">AI Product Management Mentor</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <Lightbulb className="w-12 h-12 mx-auto mb-2 text-blue-500" />
              <h3 className="text-lg font-medium">Welcome to ProdMentor!</h3>
              <p className="text-sm">Ask me any product management question and I'll help with framework-driven guidance.</p>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Try asking: "How do I prioritize features?"</p>
              <p>Or: "My user engagement is dropping, what should I do?"</p>
            </div>
          </div>
        )}

        {conversation.messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3xl ${message.role === 'user' ? 'w-auto' : 'w-full'}`}>
              <Card className={`${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-50'}`}>
                <CardContent className="p-4">
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* Framework badges */}
                  {message.frameworks && message.frameworks.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.frameworks.map((framework) => (
                        <Badge key={framework} variant="secondary" className="text-xs">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Expert quote */}
                  {message.expertQuote && (
                    <Alert className="mt-3 border-blue-200 bg-blue-50">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      <AlertDescription>
                        <div className="text-sm">
                          <p className="font-medium text-blue-900">Expert Insight:</p>
                          <p className="text-blue-800 italic">"{message.expertQuote.quote}"</p>
                          <p className="text-blue-600 text-xs mt-1">
                            — {message.expertQuote.expert}
                            {message.expertQuote.source && ` (${message.expertQuote.source})`}
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Feedback buttons for AI messages */}
                  {message.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mt-3">
                      <span className="text-xs text-gray-500">Was this helpful?</span>
                      <Button
                        variant={message.helpful === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFeedback(message.id, true)}
                        className="h-6 px-2"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant={message.helpful === false ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleFeedback(message.id, false)}
                        className="h-6 px-2"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Feedback text area */}
                  {showFeedback[message.id] && (
                    <div className="mt-3 space-y-2">
                      <Textarea
                        placeholder="Help us improve by sharing specific feedback..."
                        value={feedbackText[message.id] || ''}
                        onChange={(e) => setFeedbackText({
                          ...feedbackText,
                          [message.id]: e.target.value
                        })}
                        className="text-sm"
                        rows={2}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleFeedback(message.id, false)}
                        className="h-6 px-3"
                      >
                        Submit Feedback
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">ProdMentor is thinking...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about product management..."
            className="flex-1 min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          ProdMentor provides guidance on product management topics only. Press Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
