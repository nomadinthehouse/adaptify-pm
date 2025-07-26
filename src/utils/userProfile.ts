
import { UserProfile, ExperienceLevel } from '@/types/user';

const USER_PROFILE_KEY = 'pm_first_principles_profile';
const ONBOARDING_KEY = 'pm_first_principles_onboarded';

export const getUserProfile = (): UserProfile | null => {
  const stored = localStorage.getItem(USER_PROFILE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  localStorage.setItem(ONBOARDING_KEY, 'true');
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
  const baseLevel = profile.experienceLevel === 'novice' ? 3 : 
                   profile.experienceLevel === 'intermediate' ? 2 : 1;
  
  // Adjust based on confidence areas
  const avgConfidence = Object.values(profile.confidenceAreas).reduce((a, b) => a + b, 0) / 
                       Object.values(profile.confidenceAreas).length;
  
  return Math.max(1, baseLevel - Math.floor(avgConfidence / 3));
};

export const getRecommendedFrameworks = (profile: UserProfile): string[] => {
  const { experienceLevel, completedFrameworks, confidenceAreas } = profile;
  
  // Find lowest confidence areas for targeted improvement
  const lowestConfidenceArea = Object.entries(confidenceAreas)
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
  const levelFrameworks = recommendedForLevel[experienceLevel];
  
  return [...new Set([...targetFrameworks, ...levelFrameworks])]
    .filter(framework => !completedFrameworks.includes(framework))
    .slice(0, 3);
};
