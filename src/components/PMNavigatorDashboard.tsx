
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Map, 
  BarChart3, 
  BookOpen, 
  Plus,
  Brain,
  Lightbulb,
  Zap
} from 'lucide-react';
import { UserProfile, Problem, Strategy, Roadmap, GrowthExperiment } from '@/types/pmNavigator';

interface PMNavigatorDashboardProps {
  userProfile: UserProfile | null;
  onStartProblemSolver: () => void;
  onStartStrategyBuilder: () => void;
  onStartGrowthPlanner: () => void;
  onStartRoadmapCreator: () => void;
  onViewFrameworks: () => void;
  onViewMetricsGuide: () => void;
}

const PMNavigatorDashboard = ({
  userProfile,
  onStartProblemSolver,
  onStartStrategyBuilder,
  onStartGrowthPlanner,
  onStartRoadmapCreator,
  onViewFrameworks,
  onViewMetricsGuide
}: PMNavigatorDashboardProps) => {
  const [recentProblems, setRecentProblems] = useState<Problem[]>([]);
  const [activeStrategies, setActiveStrategies] = useState<Strategy[]>([]);
  const [runningExperiments, setRunningExperiments] = useState<GrowthExperiment[]>([]);

  const quickStartActions = [
    {
      title: "Solve a Problem",
      description: "Use first principles thinking and proven frameworks to analyze any PM challenge",
      icon: Brain,
      color: "bg-blue-500",
      onClick: onStartProblemSolver
    },
    {
      title: "Build Strategy",
      description: "Create product strategy with North Star metrics, OKRs, and clear initiatives",
      icon: Target,
      color: "bg-purple-500",
      onClick: onStartStrategyBuilder
    },
    {
      title: "Plan Growth",
      description: "Design growth experiments and identify key growth loops for your product",
      icon: TrendingUp,
      color: "bg-green-500",
      onClick: onStartGrowthPlanner
    },
    {
      title: "Create Roadmap",
      description: "Build prioritized roadmaps using proven frameworks like RICE and Impact/Effort",
      icon: Map,
      color: "bg-orange-500",
      onClick: onStartRoadmapCreator
    }
  ];

  const toolsAndResources = [
    {
      title: "Framework Library",
      description: "Expert-curated PM frameworks with insights from thought leaders",
      icon: BookOpen,
      onClick: onViewFrameworks
    },
    {
      title: "Metrics Guide",
      description: "Smart recommendations for metrics and data sources",
      icon: BarChart3,
      onClick: onViewMetricsGuide
    }
  ];

  const expertInsights = [
    {
      expert: "Marty Cagan",
      insight: "The role of product management is to discover a product that is valuable, usable, and feasible.",
      context: "Product Discovery"
    },
    {
      expert: "Teresa Torres",
      insight: "Good discovery habits reduce risk by helping teams make better decisions about what to build.",
      context: "Continuous Discovery"
    },
    {
      expert: "Shreyas Doshi",
      insight: "Most product decisions should be made using a first-principles approach rather than best practices.",
      context: "Decision Making"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PM Navigator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your First Principles Product Management Copilot
          </p>
          {userProfile && (
            <div className="flex items-center justify-center space-x-4">
              <span className="text-gray-700">Welcome back, {userProfile.name}</span>
              <Badge variant="secondary">{userProfile.experience_level}</Badge>
              <Badge variant="outline">{userProfile.role_title}</Badge>
            </div>
          )}
        </div>

        {/* Quick Start Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStartActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={action.onClick}>
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription className="text-sm">{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Work */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Problems */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Recent Problems
                </CardTitle>
                <CardDescription>
                  Your latest problem analyses and frameworks used
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentProblems.length > 0 ? (
                  <div className="space-y-3">
                    {recentProblems.slice(0, 3).map((problem) => (
                      <div key={problem.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{problem.title}</h4>
                          <p className="text-sm text-gray-600">{problem.description.substring(0, 100)}...</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge variant="outline" className="text-xs">{problem.problem_type}</Badge>
                            <Badge variant={problem.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                              {problem.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No problems analyzed yet</p>
                    <Button className="mt-4" onClick={onStartProblemSolver}>
                      <Plus className="w-4 h-4 mr-2" />
                      Start First Analysis
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Strategies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Active Strategies
                </CardTitle>
                <CardDescription>
                  Your current product strategies and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeStrategies.length > 0 ? (
                  <div className="space-y-3">
                    {activeStrategies.slice(0, 2).map((strategy) => (
                      <div key={strategy.id} className="p-3 border rounded-lg">
                        <h4 className="font-medium">{strategy.title}</h4>
                        {strategy.north_star_metric && (
                          <p className="text-sm text-gray-600 mt-1">
                            North Star: {strategy.north_star_metric}
                          </p>
                        )}
                        <Badge variant="default" className="text-xs mt-2">{strategy.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No strategies created yet</p>
                    <Button className="mt-4" onClick={onStartStrategyBuilder}>
                      <Plus className="w-4 h-4 mr-2" />
                      Build First Strategy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tools & Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Tools & Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {toolsAndResources.map((tool, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={tool.onClick}>
                    <tool.icon className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-sm">{tool.title}</h4>
                      <p className="text-xs text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Expert Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Expert Insights
                </CardTitle>
                <CardDescription>
                  Daily wisdom from PM thought leaders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expertInsights.map((insight, index) => (
                    <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500">
                      <blockquote className="text-sm italic text-gray-700 mb-2">
                        "{insight.insight}"
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <cite className="text-xs font-medium text-blue-600">— {insight.expert}</cite>
                        <Badge variant="outline" className="text-xs">{insight.context}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Running Experiments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Growth Experiments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {runningExperiments.length > 0 ? (
                  <div className="space-y-2">
                    {runningExperiments.slice(0, 3).map((experiment) => (
                      <div key={experiment.id} className="p-2 border rounded text-sm">
                        <h5 className="font-medium">{experiment.title}</h5>
                        <Badge variant="secondary" className="text-xs mt-1">{experiment.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No experiments running</p>
                    <Button size="sm" className="mt-2" onClick={onStartGrowthPlanner}>
                      Start Experiment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PMNavigatorDashboard;
