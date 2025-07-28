
export type ExperienceLevel = 'novice' | 'intermediate' | 'senior';
export type CompanySize = 'startup' | 'scale_up' | 'mid_market' | 'enterprise';
export type ProblemType = 'product_issue' | 'strategic_question' | 'growth_challenge' | 'user_problem' | 'business_metric';
export type ProblemStatus = 'analyzing' | 'completed' | 'archived';
export type StrategyStatus = 'draft' | 'active' | 'completed' | 'archived';
export type RoadmapStatus = 'draft' | 'active' | 'archived';
export type ExperimentType = 'acquisition' | 'activation' | 'retention' | 'revenue' | 'referral';
export type ExperimentStatus = 'planned' | 'running' | 'completed' | 'paused';
export type TimeHorizon = 'quarterly' | 'annual' | 'long_term';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  experience_level: ExperienceLevel;
  years_of_experience: number;
  role_title: string;
  company_size: CompanySize;
  industry: string;
  learning_styles: string[];
  confidence_areas: Record<string, number>;
  preferences: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Problem {
  id: string;
  user_id: string;
  title: string;
  description: string;
  problem_type: ProblemType;
  status: ProblemStatus;
  frameworks_used: string[];
  recommended_metrics: string[];
  data_sources: string[];
  analysis_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface FrameworkAnalysis {
  id: string;
  user_id: string;
  problem_id?: string;
  framework_type: string;
  framework_data: Record<string, any>;
  insights: string[];
  action_items: string[];
  confidence_rating?: number;
  completed_at?: string;
  created_at: string;
}

export interface Strategy {
  id: string;
  user_id: string;
  title: string;
  vision?: string;
  north_star_metric?: string;
  objectives: any[];
  key_results: any[];
  initiatives: any[];
  target_metrics: any[];
  status: StrategyStatus;
  created_at: string;
  updated_at: string;
}

export interface Roadmap {
  id: string;
  user_id: string;
  strategy_id?: string;
  title: string;
  description?: string;
  time_horizon: TimeHorizon;
  items: any[];
  prioritization_method?: string;
  status: RoadmapStatus;
  created_at: string;
  updated_at: string;
}

export interface GrowthExperiment {
  id: string;
  user_id: string;
  title: string;
  hypothesis: string;
  experiment_type: ExperimentType;
  growth_loop?: string;
  success_metrics: string[];
  status: ExperimentStatus;
  results: Record<string, any>;
  learnings: string[];
  created_at: string;
  updated_at: string;
}

export interface FrameworkConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  expertInsights: {
    expert: string;
    insight: string;
  }[];
  whenToUse: string[];
  howToUse: string[];
  commonPitfalls: string[];
}
