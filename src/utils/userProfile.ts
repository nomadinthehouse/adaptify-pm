
import { UserProfile, ExperienceLevel } from '@/types/pmNavigator';
import { supabase } from '@/integrations/supabase/client';

const USER_PROFILE_KEY = 'pm_navigator_profile';
const ONBOARDING_KEY = 'pm_navigator_onboarded';

export const getUserProfile = (): UserProfile | null => {
  const stored = localStorage.getItem(USER_PROFILE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const saveUserProfile = async (profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile | null> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    // Prepare profile data with user_id
    const profileData = {
      ...profile,
      user_id: user.id
    };

    // Save to Supabase - cast to any to work around TypeScript issues with generated types
    const { data, error } = await (supabase as any)
      .from('user_profiles')
      .upsert([profileData])
      .select()
      .single();

    if (error) {
      console.error('Error saving profile to Supabase:', error);
      // Fallback to localStorage
      const profileWithId = { 
        ...profile, 
        id: Date.now().toString(), 
        user_id: user.id,
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString() 
      };
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileWithId));
      localStorage.setItem(ONBOARDING_KEY, 'true');
      return profileWithId;
    }

    // Also save to localStorage for offline access
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data));
    localStorage.setItem(ONBOARDING_KEY, 'true');
    
    return data;
  } catch (error) {
    console.error('Error saving profile:', error);
    // Fallback to localStorage
    const profileWithId = { 
      ...profile, 
      id: Date.now().toString(), 
      user_id: 'temp-user-id',
      created_at: new Date().toISOString(), 
      updated_at: new Date().toISOString() 
    };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profileWithId));
    localStorage.setItem(ONBOARDING_KEY, 'true');
    return profileWithId;
  }
};

export const hasCompletedOnboarding = (): boolean => {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
};

export const calculateExperienceLevel = (yearsOfExperience: number): ExperienceLevel => {
  if (yearsOfExperience < 2) return 'novice';
  if (yearsOfExperience < 5) return 'intermediate';
  return 'senior';
};

export const getScaffoldingLevel = (profile: UserProfile): number => {
  const baseLevel = profile.experience_level === 'novice' ? 3 : 
                   profile.experience_level === 'intermediate' ? 2 : 1;
  
  // Adjust based on confidence areas
  const confidenceValues = Object.values(profile.confidence_areas);
  if (confidenceValues.length === 0) return baseLevel;
  
  const avgConfidence = confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length;
  
  return Math.max(1, baseLevel - Math.floor(avgConfidence / 3));
};

export const getRecommendedFrameworks = (profile: UserProfile): string[] => {
  const { experience_level, confidence_areas } = profile;
  
  // Find lowest confidence area for targeted improvement
  const confidenceEntries = Object.entries(confidence_areas);
  if (confidenceEntries.length === 0) {
    return getDefaultFrameworks(experience_level);
  }
  
  const lowestConfidenceArea = confidenceEntries
    .sort(([,a], [,b]) => a - b)[0][0];
  
  const frameworkMap: Record<string, string[]> = {
    problemAnalysis: ['5-whys', 'root-cause-analysis', 'problem-definition'],
    metricsDesign: ['north-star-metric', 'pirate-metrics', 'okr-design'],
    stakeholderManagement: ['stakeholder-mapping', 'communication-framework'],
    strategicThinking: ['jobs-to-be-done', 'blue-ocean', 'competitive-analysis'],
    userResearch: ['user-journey-mapping', 'persona-development', 'interview-guide']
  };
  
  const recommendedForLevel = {
    novice: ['problem-definition', '5-whys', 'user-journey-mapping'],
    intermediate: ['jobs-to-be-done', 'north-star-metric', 'stakeholder-mapping'],
    senior: ['blue-ocean', 'competitive-analysis', 'okr-design']
  };
  
  const targetFrameworks = frameworkMap[lowestConfidenceArea] || [];
  const levelFrameworks = recommendedForLevel[experience_level];
  
  return [...new Set([...targetFrameworks, ...levelFrameworks])].slice(0, 3);
};

const getDefaultFrameworks = (experienceLevel: ExperienceLevel): string[] => {
  const defaultFrameworks = {
    novice: ['problem-definition', '5-whys', 'user-journey-mapping'],
    intermediate: ['jobs-to-be-done', 'north-star-metric', 'stakeholder-mapping'],
    senior: ['blue-ocean', 'competitive-analysis', 'okr-design']
  };
  
  return defaultFrameworks[experienceLevel];
};
