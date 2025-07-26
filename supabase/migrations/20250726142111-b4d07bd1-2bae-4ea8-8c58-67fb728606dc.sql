
-- Create user profiles table for PM Navigator
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  experience_level TEXT CHECK (experience_level IN ('novice', 'intermediate', 'senior')) NOT NULL,
  years_of_experience INTEGER NOT NULL,
  current_role TEXT NOT NULL,
  company_size TEXT CHECK (company_size IN ('startup', 'scale_up', 'mid_market', 'enterprise')) NOT NULL,
  industry TEXT NOT NULL,
  learning_styles TEXT[] NOT NULL,
  confidence_areas JSONB NOT NULL DEFAULT '{}',
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create problems table for tracking user problems and analyses
CREATE TABLE public.problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  problem_type TEXT CHECK (problem_type IN ('product_issue', 'strategic_question', 'growth_challenge', 'user_problem', 'business_metric')) NOT NULL,
  status TEXT CHECK (status IN ('analyzing', 'completed', 'archived')) NOT NULL DEFAULT 'analyzing',
  frameworks_used TEXT[] DEFAULT '{}',
  recommended_metrics TEXT[] DEFAULT '{}',
  data_sources TEXT[] DEFAULT '{}',
  analysis_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create frameworks table for tracking framework usage and results
CREATE TABLE public.framework_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  problem_id UUID REFERENCES public.problems,
  framework_type TEXT NOT NULL,
  framework_data JSONB NOT NULL DEFAULT '{}',
  insights TEXT[],
  action_items TEXT[],
  confidence_rating INTEGER CHECK (confidence_rating >= 1 AND confidence_rating <= 5),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create strategies table for product strategy planning
CREATE TABLE public.strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  vision TEXT,
  north_star_metric TEXT,
  objectives JSONB DEFAULT '[]',
  key_results JSONB DEFAULT '[]',
  initiatives JSONB DEFAULT '[]',
  target_metrics JSONB DEFAULT '[]',
  status TEXT CHECK (status IN ('draft', 'active', 'completed', 'archived')) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create roadmaps table for product roadmap planning
CREATE TABLE public.roadmaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  strategy_id UUID REFERENCES public.strategies,
  title TEXT NOT NULL,
  description TEXT,
  time_horizon TEXT CHECK (time_horizon IN ('quarterly', 'annual', 'long_term')) NOT NULL,
  items JSONB DEFAULT '[]',
  prioritization_method TEXT,
  status TEXT CHECK (status IN ('draft', 'active', 'archived')) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create growth experiments table for growth planning
CREATE TABLE public.growth_experiments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  hypothesis TEXT NOT NULL,
  experiment_type TEXT CHECK (experiment_type IN ('acquisition', 'activation', 'retention', 'revenue', 'referral')) NOT NULL,
  growth_loop TEXT,
  success_metrics TEXT[],
  status TEXT CHECK (status IN ('planned', 'running', 'completed', 'paused')) NOT NULL DEFAULT 'planned',
  results JSONB DEFAULT '{}',
  learnings TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.framework_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_experiments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for problems
CREATE POLICY "Users can view their own problems" ON public.problems FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own problems" ON public.problems FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own problems" ON public.problems FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own problems" ON public.problems FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for framework_analyses
CREATE POLICY "Users can view their own analyses" ON public.framework_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own analyses" ON public.framework_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own analyses" ON public.framework_analyses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own analyses" ON public.framework_analyses FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for strategies
CREATE POLICY "Users can view their own strategies" ON public.strategies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own strategies" ON public.strategies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own strategies" ON public.strategies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own strategies" ON public.strategies FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for roadmaps
CREATE POLICY "Users can view their own roadmaps" ON public.roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own roadmaps" ON public.roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own roadmaps" ON public.roadmaps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own roadmaps" ON public.roadmaps FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for growth_experiments
CREATE POLICY "Users can view their own experiments" ON public.growth_experiments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own experiments" ON public.growth_experiments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own experiments" ON public.growth_experiments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own experiments" ON public.growth_experiments FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_problems_user_id ON public.problems(user_id);
CREATE INDEX idx_problems_status ON public.problems(status);
CREATE INDEX idx_framework_analyses_user_id ON public.framework_analyses(user_id);
CREATE INDEX idx_framework_analyses_problem_id ON public.framework_analyses(problem_id);
CREATE INDEX idx_strategies_user_id ON public.strategies(user_id);
CREATE INDEX idx_roadmaps_user_id ON public.roadmaps(user_id);
CREATE INDEX idx_growth_experiments_user_id ON public.growth_experiments(user_id);
