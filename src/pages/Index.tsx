
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/pmNavigator';
import OnboardingAssessment from '@/components/OnboardingAssessment';
import PMNavigatorDashboard from '@/components/PMNavigatorDashboard';
import ProblemSolver from '@/components/ProblemSolver';
import StrategyBuilder from '@/components/StrategyBuilder';
import { getUserProfile, hasCompletedOnboarding } from '@/utils/userProfile';

type AppView = 'dashboard' | 'problemSolver' | 'strategyBuilder' | 'growthPlanner' | 'roadmapCreator' | 'frameworks' | 'metricsGuide';

const Index = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

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

  const handleProblemComplete = (problem: any) => {
    console.log('Problem analysis completed:', problem);
    // TODO: Save to Supabase
    setCurrentView('dashboard');
  };

  const handleStrategyComplete = (strategy: any) => {
    console.log('Strategy completed:', strategy);
    // TODO: Save to Supabase
    setCurrentView('dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PM Navigator...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingAssessment onComplete={handleOnboardingComplete} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'problemSolver':
        return (
          <ProblemSolver 
            onBack={() => setCurrentView('dashboard')} 
            onComplete={handleProblemComplete}
          />
        );
      case 'strategyBuilder':
        return (
          <StrategyBuilder 
            onBack={() => setCurrentView('dashboard')} 
            onComplete={handleStrategyComplete}
          />
        );
      case 'growthPlanner':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Growth Planner</h2>
              <p className="text-gray-600 mb-4">Coming soon...</p>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      case 'roadmapCreator':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Roadmap Creator</h2>
              <p className="text-gray-600 mb-4">Coming soon...</p>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      case 'frameworks':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Framework Library</h2>
              <p className="text-gray-600 mb-4">Coming soon...</p>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      case 'metricsGuide':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Metrics Guide</h2>
              <p className="text-gray-600 mb-4">Coming soon...</p>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      default:
        return (
          <PMNavigatorDashboard
            userProfile={userProfile}
            onStartProblemSolver={() => setCurrentView('problemSolver')}
            onStartStrategyBuilder={() => setCurrentView('strategyBuilder')}
            onStartGrowthPlanner={() => setCurrentView('growthPlanner')}
            onStartRoadmapCreator={() => setCurrentView('roadmapCreator')}
            onViewFrameworks={() => setCurrentView('frameworks')}
            onViewMetricsGuide={() => setCurrentView('metricsGuide')}
          />
        );
    }
  };

  return renderCurrentView();
};

export default Index;
