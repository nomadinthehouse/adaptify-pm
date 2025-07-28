
import OpenAI from 'openai';
import { ChatMessage, ExpertQuote } from '@/types/chat';
import { PM_FRAMEWORKS, EXPERT_QUOTES } from '@/data/pmFrameworks';

// This would typically be an environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

interface AIResponse {
  content: string;
  frameworks?: string[];
  expertQuote?: ExpertQuote;
}

const PRODUCT_MANAGEMENT_CONTEXT = `
You are ProdMentor, an AI assistant specialized exclusively in product management topics. 

IMPORTANT RULES:
1. ONLY answer product management related questions
2. If asked about non-PM topics, politely decline: "Sorry, I can only help with product management topics."
3. Always reference relevant PM frameworks in your responses
4. Include expert quotes when appropriate
5. Provide practical, actionable advice
6. Ask clarifying questions to better understand the context
7. Break down complex problems into manageable steps

Available PM Frameworks: ${PM_FRAMEWORKS.map(f => f.name).join(', ')}

Expert Sources: Marty Cagan, Teresa Torres, Shreyas Doshi, Julie Zhuo, Christina Wodtke, Clayton Christensen, Sean Ellis

Your responses should be:
- Practical and actionable
- Framework-driven
- Backed by expert wisdom
- Focused on solving real PM challenges
- Conversational but professional
`;

export const generateAIResponse = async (
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<AIResponse> => {
  try {
    // Check if the question is product management related
    const isProductManagementQuery = await checkIfProductManagementQuery(userMessage);
    
    if (!isProductManagementQuery) {
      return {
        content: "Sorry, I can only help with product management topics. Please ask me about product strategy, prioritization, user research, metrics, roadmapping, or any other PM-related questions!",
      };
    }

    // Build conversation context
    const messages = [
      { role: 'system' as const, content: PRODUCT_MANAGEMENT_CONTEXT },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })),
      { role: 'user' as const, content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    // Extract frameworks mentioned in the response
    const frameworks = extractFrameworks(content);
    
    // Select relevant expert quote
    const expertQuote = selectRelevantExpertQuote(userMessage, content);

    return {
      content,
      frameworks,
      expertQuote
    };
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
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
