
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userMessage, conversationHistory } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Check if the question is product management related
    const isProductManagementQuery = checkIfProductManagementQuery(userMessage);
    
    if (!isProductManagementQuery) {
      return new Response(JSON.stringify({
        content: "Sorry, I can only help with product management topics. Please ask me about product strategy, prioritization, user research, metrics, roadmapping, or any other PM-related questions!",
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const PRODUCT_MANAGEMENT_CONTEXT = `
You are PM Navigator, an expert AI assistant specialized exclusively in product management topics and frameworks.

CORE IDENTITY:
- You are a world-class product management mentor with deep expertise in all PM frameworks, methodologies, and best practices
- You have access to comprehensive knowledge of product management principles from industry leaders
- You provide strategic, framework-driven guidance to product managers at all levels

RESPONSE GUIDELINES:
1. ONLY answer product management related questions (strategy, discovery, prioritization, metrics, roadmapping, user research, stakeholder management, etc.)
2. If asked about non-PM topics, politely redirect: "I'm specialized in product management topics. Let me help you with PM strategy, frameworks, or methodologies instead!"
3. Always ground your responses in established PM frameworks and methodologies
4. Reference relevant expert insights and proven methodologies from PM thought leaders
5. Provide practical, actionable advice that PMs can implement immediately
6. Ask clarifying questions to understand context (company stage, team size, industry, specific challenges)
7. Break down complex problems using structured frameworks
8. Suggest specific next steps and success metrics

AVAILABLE PM FRAMEWORKS & METHODOLOGIES:
- Prioritization: RICE, MoSCoW, Kano Model, ICE, Value vs Effort Matrix
- Discovery: Jobs-to-be-Done (JTBD), Opportunity Solution Tree, Continuous Discovery Habits
- Strategy: North Star Framework, OKRs, Product Strategy Canvas, Lean Canvas
- Analysis: 5 Whys, Root Cause Analysis, Fishbone Diagram, SWOT Analysis  
- Research: User Story Mapping, Customer Journey Mapping, Persona Development
- Metrics: HEART Framework, AARRR (Pirate Metrics), Product-Market Fit metrics
- Roadmapping: Now-Next-Later, Theme-based roadmaps, Outcome-driven roadmaps

EXPERT SOURCES TO REFERENCE:
Marty Cagan (Inspired, Empowered), Teresa Torres (Continuous Discovery), Shreyas Doshi (PM prioritization), Julie Zhuo (The Making of a Manager), Christina Wodtke (Radical Focus), Clayton Christensen (Jobs Theory), Sean Ellis (Product-Market Fit), Melissa Perri (Escaping the Build Trap), Gibson Biddle (GEM Framework), April Dunford (Obviously Awesome positioning)

Your responses should be:
- Practical and actionable
- Framework-driven
- Backed by expert wisdom
- Focused on solving real PM challenges
- Conversational but professional
`;

    const messages = [
      { role: 'system', content: PRODUCT_MANAGEMENT_CONTEXT },
      ...conversationHistory.slice(-10).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    // Extract frameworks mentioned in the response
    const frameworks = extractFrameworks(content);
    
    // Select relevant expert quote
    const expertQuote = selectRelevantExpertQuote(userMessage, content);

    return new Response(JSON.stringify({
      content,
      frameworks,
      expertQuote
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function checkIfProductManagementQuery(query: string): boolean {
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
}

function extractFrameworks(content: string): string[] {
  const frameworks: string[] = [];
  const frameworkNames = [
    "Jobs-to-be-Done (JTBD)",
    "North Star Framework", 
    "RICE Prioritization",
    "Opportunity Solution Tree",
    "5 Whys Root Cause Analysis"
  ];
  
  frameworkNames.forEach(framework => {
    if (content.toLowerCase().includes(framework.toLowerCase())) {
      frameworks.push(framework);
    }
  });
  
  return frameworks;
}

function selectRelevantExpertQuote(userMessage: string, aiResponse: string): any {
  const messageLower = userMessage.toLowerCase();
  
  const expertQuotes = [
    {
      expert: "Marty Cagan",
      quote: "The role of the product manager is to discover a product that is valuable, usable, and feasible.",
      source: "Inspired"
    },
    {
      expert: "Teresa Torres",
      quote: "Hope is not a strategy. We need to be intentional about our discovery work.",
      source: "Continuous Discovery Habits"
    },
    {
      expert: "Shreyas Doshi",
      quote: "Product sense is the ability to consistently make good product decisions even with incomplete information.",
      source: "Twitter"
    },
    {
      expert: "Julie Zhuo",
      quote: "The best product decisions come from deeply understanding your users.",
      source: "The Making of a Manager"
    },
    {
      expert: "Christina Wodtke",
      quote: "OKRs are not about being perfect. They're about being better.",
      source: "Radical Focus"
    }
  ];
  
  if (messageLower.includes('problem') || messageLower.includes('issue')) {
    return expertQuotes.find(q => q.expert === 'Marty Cagan');
  }
  
  if (messageLower.includes('user') || messageLower.includes('customer')) {
    return expertQuotes.find(q => q.expert === 'Julie Zhuo');
  }
  
  if (messageLower.includes('discovery') || messageLower.includes('research')) {
    return expertQuotes.find(q => q.expert === 'Teresa Torres');
  }
  
  if (messageLower.includes('decision') || messageLower.includes('priorit')) {
    return expertQuotes.find(q => q.expert === 'Shreyas Doshi');
  }
  
  if (messageLower.includes('okr') || messageLower.includes('goal')) {
    return expertQuotes.find(q => q.expert === 'Christina Wodtke');
  }
  
  return expertQuotes[Math.floor(Math.random() * expertQuotes.length)];
}
