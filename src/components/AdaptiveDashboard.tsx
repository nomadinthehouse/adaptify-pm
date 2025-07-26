
import { useState } from 'react';
import { UserProfile } from '@/types/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getRecommendedFrameworks, getScaffoldingLevel } from '@/utils/userProfile';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Search,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Award
} from 'lucide-react';
import FiveWhysAnalysis from '@/components/frameworks/FiveWhysAnalysis';

interface AdaptiveDashboardProps {
  userProfile: UserProfile | null;
}

const AdaptiveDashboard = ({ userProfile }: AdaptiveDashboardProps) => {
  const [activeFramework, setActiveFramework] = useState<string | null>(null);

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your personalized experience...</p>
      </div>
    );
  }

  if (activeFramework === '5-whys') {
    return (
      <FiveWhysAnalysis 
        userProfile={userProfile} 
        onBack={() => setActiveFramework(null)} 
      />
    );
  }

  const recommendedFrameworks = getRecommendedFrameworks(userProfile);
  const scaffoldingLevel = getScaffoldingLevel(userProfile);

  const getExperienceBadgeColor = (level: string) => {
    switch (level) {
      case 'novice': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const confidenceAverages = Object.values(userProfile.confidenceAreas).reduce((a, b) => a + b, 0) / 
                           Object.values(userProfile.confidenceAreas).length;

  const frameworkData = [
    {
      id: '5-whys',
      name: 'Root Cause Analysis (5 Whys)',
      description: 'Dig deep into problems to find actionable root causes',
      icon: Target,
      difficulty: 'beginner',
      estimatedTime: '15-30 min',
      category: 'Problem Analysis'
    },
    {
      id: 'jobs-to-be-done',
      name: 'Jobs-to-be-Done Framework',
      description: 'Understand the job customers hire your product to do',
      icon: Users,
      difficulty: 'intermediate',
      estimatedTime: '45-60 min',
      category: 'Strategic Thinking'
    },
    {
      id: 'north-star-metric',
      name: 'North Star Metric Design',
      description: 'Define the key metric that drives your product strategy',
      icon: TrendingUp,
      difficulty: 'intermediate',
      estimatedTime: '30-45 min',
      category: 'Metrics Design'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PM First Principles
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {userProfile.name}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${getExperienceBadgeColor(userProfile.experienceLevel)} border-0`}>
                {userProfile.experienceLevel.charAt(0).toUpperCase() + userProfile.experienceLevel.slice(1)} PM
              </Badge>
              <span className="text-sm text-gray-500">
                {userProfile.yearsOfExperience} years experience
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personalized Recommendations */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  <CardTitle>Recommended for You</CardTitle>
                </div>
                <CardDescription>
                  Based on your experience level and confidence areas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {frameworkData
                    .filter(framework => recommendedFrameworks.includes(framework.id))
                    .map((framework) => {
                      const Icon = framework.icon;
                      return (
                        <div 
                          key={framework.id}
                          className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                          onClick={() => setActiveFramework(framework.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {framework.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {framework.description}
                                </p>
                                <div className="flex items-center space-x-4 mt-3">
                                  <Badge variant="secondary" className="text-xs">
                                    {framework.category}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    ⏱ {framework.estimatedTime}
                                  </span>
                                  <Badge 
                                    variant={framework.difficulty === 'beginner' ? 'default' : 'outline'}
                                    className="text-xs"
                                  >
                                    {framework.difficulty}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                        </div>
                      );
                    })}
                </div>
                
                {userProfile.experienceLevel === 'novice' && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <BookOpen className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-blue-900">Learning Path Guidance</p>
                        <p className="text-blue-700 mt-1">
                          Start with Root Cause Analysis to build strong problem-solving foundations. 
                          Each framework includes step-by-step tutorials and examples.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Frameworks */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>All Frameworks</CardTitle>
                <CardDescription>
                  Complete library of PM decision-making frameworks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {frameworkData.map((framework) => {
                    const Icon = framework.icon;
                    const isRecommended = recommendedFrameworks.includes(framework.id);
                    const isCompleted = userProfile.completedFrameworks.includes(framework.id);
                    
                    return (
                      <div 
                        key={framework.id}
                        className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer group ${
                          isRecommended ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        } ${isCompleted ? 'opacity-75' : ''} hover:shadow-md`}
                        onClick={() => setActiveFramework(framework.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg transition-colors ${
                            isRecommended ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">
                                {framework.name}
                              </h3>
                              {isRecommended && (
                                <Badge className="text-xs bg-yellow-100 text-yellow-800 border-0">
                                  Recommended
                                </Badge>
                              )}
                              {isCompleted && (
                                <Award className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {framework.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile & Progress */}
          <div className="space-y-6">
            
            {/* Profile Summary */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Your Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Confidence</span>
                    <span className="text-sm text-gray-600">{Math.round(confidenceAverages)}/5</span>
                  </div>
                  <Progress value={(confidenceAverages / 5) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Confidence Areas</h4>
                  {Object.entries(userProfile.confidenceAreas).map(([key, value]) => {
                    const labels = {
                      problemAnalysis: 'Problem Analysis',
                      metricsDesign: 'Metrics Design',
                      stakeholderManagement: 'Stakeholder Management',
                      strategicThinking: 'Strategic Thinking',
                      userResearch: 'User Research'
                    };
                    
                    return (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{labels[key as keyof typeof labels]}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={(value / 5) * 100} className="w-16 h-1" />
                          <span className="text-gray-500 w-8">{value}/5</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t">
                  <div className="text-sm text-gray-600">
                    <p><strong>Company:</strong> {userProfile.companySize} {userProfile.industry}</p>
                    <p><strong>Learning Style:</strong> {userProfile.learningStyle.join(', ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>Learning Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Frameworks Completed</span>
                      <span className="text-sm text-gray-600">
                        {userProfile.completedFrameworks.length}/10
                      </span>
                    </div>
                    <Progress 
                      value={(userProfile.completedFrameworks.length / 10) * 100} 
                      className="h-2" 
                    />
                  </div>
                  
                  {userProfile.completedFrameworks.length === 0 ? (
                    <div className="text-center py-6">
                      <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Start your first framework to begin tracking progress
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Recent Achievements</h4>
                      {userProfile.skillProgressions.slice(-3).map((progression, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">
                            Completed {progression.framework}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveDashboard;
