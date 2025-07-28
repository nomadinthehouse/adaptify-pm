
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/pmNavigator';
import OnboardingAssessment from '@/components/OnboardingAssessment';
import ProdMentor from '@/components/ProdMentor';
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

  const handleLogout = () => {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('onboardingCompleted');
    setUserProfile(null);
    setShowOnboarding(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ProdMentor...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingAssessment onComplete={handleOnboardingComplete} />;
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-gray-600">Please complete onboarding to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <ProdMentor 
      userProfile={userProfile} 
      onLogout={handleLogout}
    />
  );
};

export default Index;
