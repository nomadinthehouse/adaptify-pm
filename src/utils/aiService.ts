
import { ChatMessage, ExpertQuote } from '@/types/chat';
import { PM_FRAMEWORKS, EXPERT_QUOTES } from '@/data/pmFrameworks';
import { supabase } from '@/integrations/supabase/client';

interface AIResponse {
  content: string;
  frameworks?: string[];
  expertQuote?: ExpertQuote;
}

export const generateAIResponse = async (
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<AIResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('chat-ai', {
      body: {
        userMessage,
        conversationHistory
      }
    });

    if (error) {
      console.error('Error calling chat-ai function:', error);
      throw new Error('Failed to generate AI response');
    }

    return data;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response. Please check your API key configuration.');
  }
};

const checkIfProductManagementQuery = async (query: string): Promise<boolean> => {
  const pmKeywords = [
    'product', 'feature', 'user', 'customer', 'roadmap', 'strategy', 'prioritization',
    'metrics', 'kpi', 'okr', 'backlog', 'stakeholder', 'requirements', 'market',
    'competitive', 'analysis', 'feedback', 'research', 'testing', 'launch',
    'growth', 'retention', 'acquisition', 'engagement', 'conversion', 'funnel',
    'persona', 'journey', 'pain point', 'problem', 'solution', 'mvp', 'iteration',
    'agile', 'scrum', 'sprint', 'epic', 'story', 'acceptance criteria'
  ];

  const queryLower = query.toLowerCase();
  return pmKeywords.some(keyword => queryLower.includes(keyword)) || 
         queryLower.includes('pm') || 
         queryLower.includes('product manager') ||
         queryLower.includes('product management');
};

const extractFrameworks = (content: string): string[] => {
  const frameworks: string[] = [];
  
  PM_FRAMEWORKS.forEach(framework => {
    if (content.toLowerCase().includes(framework.name.toLowerCase())) {
      frameworks.push(framework.name);
    }
  });
  
  return frameworks;
};

const selectRelevantExpertQuote = (userMessage: string, aiResponse: string): ExpertQuote | undefined => {
  const messageLower = userMessage.toLowerCase();
  const responseLower = aiResponse.toLowerCase();
  
  // Simple keyword matching to select relevant quotes
  if (messageLower.includes('problem') || messageLower.includes('issue')) {
    return EXPERT_QUOTES.find(q => q.expert === 'Marty Cagan');
  }
  
  if (messageLower.includes('user') || messageLower.includes('customer')) {
    return EXPERT_QUOTES.find(q => q.expert === 'Julie Zhuo');
  }
  
  if (messageLower.includes('discovery') || messageLower.includes('research')) {
    return EXPERT_QUOTES.find(q => q.expert === 'Teresa Torres');
  }
  
  if (messageLower.includes('decision') || messageLower.includes('priorit')) {
    return EXPERT_QUOTES.find(q => q.expert === 'Shreyas Doshi');
  }
  
  if (messageLower.includes('okr') || messageLower.includes('goal')) {
    return EXPERT_QUOTES.find(q => q.expert === 'Christina Wodtke');
  }
  
  // Return random expert quote if no specific match
  return EXPERT_QUOTES[Math.floor(Math.random() * EXPERT_QUOTES.length)];
};
