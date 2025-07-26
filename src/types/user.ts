
export type ExperienceLevel = 'novice' | 'intermediate' | 'senior';

export type LearningStyle = 'visual' | 'hands-on' | 'reading' | 'discussion';

export type IndustryType = 'b2b_saas' | 'consumer_tech' | 'fintech' | 'healthcare' | 'ecommerce' | 'other';

export type CompanySize = 'startup' | 'scale_up' | 'mid_market' | 'enterprise';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  experienceLevel: ExperienceLevel;
  yearsOfExperience: number;
  currentRole: string;
  companySize: CompanySize;
  industry: IndustryType;
  learningStyle: LearningStyle[];
  confidenceAreas: {
    problemAnalysis: number;
    metricsDesign: number;
    stakeholderManagement: number;
    strategicThinking: number;
    userResearch: number;
  };
  completedFrameworks: string[];
  skillProgressions: {
    framework: string;
    completionDate: string;
    confidenceImprovement: number;
  }[];
  preferences: {
    scaffoldingLevel: number;
    helpVisibility: boolean;
    expertMode: boolean;
  };
}

export interface FrameworkConfig {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  categories: string[];
  adaptiveFeatures: {
    novice: {
      scaffolding: boolean;
      examples: boolean;
      tutorials: boolean;
      validation: boolean;
    };
    intermediate: {
      guidance: boolean;
      alternatives: boolean;
      tips: boolean;
      connections: boolean;
    };
    senior: {
      customization: boolean;
      expertMode: boolean;
      multiFramework: boolean;
      insights: boolean;
    };
  };
}
