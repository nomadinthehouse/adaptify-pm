
import { useState, useEffect } from 'react';
import { UserProfile, ExperienceLevel } from '@/types/user';
import OnboardingAssessment from '@/components/OnboardingAssessment';
import AdaptiveDashboard from '@/components/AdaptiveDashboard';
import { getUserProfile, hasCompletedOnboarding } from '@/utils/userProfile';

const Index = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = () => {
      const profile = getUserProfile();
      const completedOnboarding = hasCompletedOnboarding();
      
      setUserProfile(profile);
      setShowOnboarding(!completedOnboarding);
      setIsLoading(false);
    };

    loadUserProfile();
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized PM workspace...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingAssessment onComplete={handleOnboardingComplete} />;
  }

  return <AdaptiveDashboard userProfile={userProfile} />;
};

export default Index;
