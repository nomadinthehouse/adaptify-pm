
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  Search, 
  Users, 
  BarChart3, 
  ArrowRight, 
  ArrowLeft,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { ProblemType } from '@/types/pmNavigator';

interface ProblemSolverProps {
  onBack: () => void;
  onComplete: (problem: any) => void;
}

const ProblemSolver = ({ onBack, onComplete }: ProblemSolverProps) => {
  const [step, setStep] = useState(1);
  const [problemData, setProblemData] = useState({
    title: '',
    description: '',
    problemType: '' as ProblemType,
    desiredOutcome: '',
    constraints: '',
    assumptions: '',
    stakeholders: '',
    context: ''
  });
  const [suggestedFrameworks, setSuggestedFrameworks] = useState<string[]>([]);
  const [selectedFramework, setSelectedFramework] = useState('');

  const problemTypes = [
    { value: 'product_issue', label: 'Product Issue', description: 'Feature problems, bugs, performance issues' },
    { value: 'strategic_question', label: 'Strategic Question', description: 'Direction, priorities, market decisions' },
    { value: 'growth_challenge', label: 'Growth Challenge', description: 'User acquisition, retention, monetization' },
    { value: 'user_problem', label: 'User Problem', description: 'User experience, satisfaction, needs' },
    { value: 'business_metric', label: 'Business Metric', description: 'KPI issues, measurement challenges' }
  ];

  const frameworks = {
    'product_issue': ['5 Whys', 'Fishbone Diagram', 'Root Cause Analysis', 'First Principles Breakdown'],
    'strategic_question': ['First Principles Thinking', 'Jobs-to-be-Done', 'Blue Ocean Strategy', 'Competitive Analysis'],
    'growth_challenge': ['AARRR Metrics', 'Growth Loops', 'Hook Model', 'Viral Coefficient Analysis'],
    'user_problem': ['User Journey Mapping', 'Problem Interview Framework', 'Persona Analysis', 'Jobs-to-be-Done'],
    'business_metric': ['North Star Framework', 'Pirate Metrics', 'Leading vs Lagging Indicators', 'OKR Analysis']
  };

  const expertInsights = {
    'product_issue': {
      expert: 'Marty Cagan',
      insight: 'Most product issues stem from building the wrong thing, not building the thing wrong. Question the fundamental assumptions first.'
    },
    'strategic_question': {
      expert: 'Shreyas Doshi',
      insight: 'Great strategy comes from first principles thinking. Strip away industry best practices and ask: what would we do if we were starting fresh?'
    },
    'growth_challenge': {
      expert: 'Elena Verna',
      insight: 'Sustainable growth comes from understanding your core growth loops and optimizing for retention before acquisition.'
    },
    'user_problem': {
      expert: 'Teresa Torres',
      insight: 'Before solving for users, make sure you truly understand their underlying needs, not just their stated wants.'
    },
    'business_metric': {
      expert: 'John Cutler',
      insight: 'Focus on outcomes over outputs. The best metrics tell a story about customer value and business health.'
    }
  };

  const handleNext = () => {
    if (step === 2 && problemData.problemType) {
      setSuggestedFrameworks(frameworks[problemData.problemType as keyof typeof frameworks] || []);
    }
    setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleComplete = () => {
    const problem = {
      ...problemData,
      recommendedFramework: selectedFramework,
      suggestedMetrics: getRecommendedMetrics(),
      dataSources: getRecommendedDataSources()
    };
    onComplete(problem);
  };

  const getRecommendedMetrics = () => {
    const metricMap = {
      'product_issue': ['Error Rate', 'User Satisfaction Score', 'Feature Adoption Rate', 'Time to Resolution'],
      'strategic_question': ['North Star Metric', 'Market Share', 'Strategic Initiative Progress', 'Competitive Position'],
      'growth_challenge': ['Acquisition Cost', 'Retention Rate', 'Viral Coefficient', 'Activation Rate'],
      'user_problem': ['NPS', 'User Satisfaction', 'Task Success Rate', 'Time to Value'],
      'business_metric': ['Revenue Growth', 'Unit Economics', 'Customer Lifetime Value', 'Churn Rate']
    };
    return metricMap[problemData.problemType as keyof typeof metricMap] || [];
  };

  const getRecommendedDataSources = () => {
    const dataSourceMap = {
      'product_issue': ['Product Analytics', 'User Feedback', 'Error Logs', 'Support Tickets'],
      'strategic_question': ['Market Research', 'Competitive Analysis', 'Financial Data', 'Customer Interviews'],
      'growth_challenge': ['Growth Analytics', 'Cohort Analysis', 'A/B Test Results', 'User Acquisition Data'],
      'user_problem': ['User Research', 'Usability Testing', 'Customer Support', 'User Analytics'],
      'business_metric': ['Business Intelligence', 'Financial Reports', 'KPI Dashboards', 'Operational Data']
    };
    return dataSourceMap[problemData.problemType as keyof typeof dataSourceMap] || [];
  };

  const progress = (step / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="text-sm font-medium text-gray-600">Step {step} of 5</div>
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            First Principles Problem Solver
          </h1>
          
          <Progress value={progress} className="w-full" />
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Brain className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                  <h2 className="text-2xl font-semibold mb-2">What's the problem?</h2>
                  <p className="text-gray-600">Let's start by clearly defining what you're trying to solve</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Problem Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Users are not completing onboarding"
                      value={problemData.title}
                      onChange={(e) => setProblemData({...problemData, title: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the problem in detail. What's happening? When did it start? Who's affected?"
                      value={problemData.description}
                      onChange={(e) => setProblemData({...problemData, description: e.target.value})}
                      className="mt-1 min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Target className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                  <h2 className="text-2xl font-semibold mb-2">What type of problem is this?</h2>
                  <p className="text-gray-600">This helps us suggest the best frameworks and approaches</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {problemTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        problemData.problemType === type.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setProblemData({...problemData, problemType: type.value as ProblemType})}
                    >
                      <h3 className="font-medium mb-2">{type.label}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                      {problemData.problemType === type.value && (
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Lightbulb className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <h2 className="text-2xl font-semibold mb-2">Let's dig deeper</h2>
                  <p className="text-gray-600">Understanding context and constraints is crucial for good solutions</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="outcome">What's your desired outcome?</Label>
                    <Textarea
                      id="outcome"
                      placeholder="What success looks like when this problem is solved"
                      value={problemData.desiredOutcome}
                      onChange={(e) => setProblemData({...problemData, desiredOutcome: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="constraints">What constraints do you have?</Label>
                    <Textarea
                      id="constraints"
                      placeholder="Time, budget, technical, resource, or other limitations"
                      value={problemData.constraints}
                      onChange={(e) => setProblemData({...problemData, constraints: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="assumptions">What assumptions are you making?</Label>
                    <Textarea
                      id="assumptions"
                      placeholder="What do you believe to be true about this problem? What might you be wrong about?"
                      value={problemData.assumptions}
                      onChange={(e) => setProblemData({...problemData, assumptions: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && suggestedFrameworks.length > 0 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Search className="w-16 h-16 mx-auto mb-4 text-orange-600" />
                  <h2 className="text-2xl font-semibold mb-2">Recommended Frameworks</h2>
                  <p className="text-gray-600">Based on your problem type, here are the best approaches</p>
                </div>

                {/* Expert Insight */}
                {problemData.problemType && expertInsights[problemData.problemType] && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-500 mb-6">
                    <blockquote className="text-sm italic text-gray-700 mb-2">
                      "{expertInsights[problemData.problemType].insight}"
                    </blockquote>
                    <cite className="text-sm font-medium text-blue-600">
                      — {expertInsights[problemData.problemType].expert}
                    </cite>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedFrameworks.map((framework) => (
                    <div
                      key={framework}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedFramework === framework ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedFramework(framework)}
                    >
                      <h3 className="font-medium mb-2">{framework}</h3>
                      <Badge variant="outline" className="text-xs">Recommended</Badge>
                      {selectedFramework === framework && (
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-red-600" />
                  <h2 className="text-2xl font-semibold mb-2">Recommended Metrics & Data</h2>
                  <p className="text-gray-600">Here's what you should track and where to find the data</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Key Metrics to Track
                    </h3>
                    <div className="space-y-2">
                      {getRecommendedMetrics().map((metric, index) => (
                        <Badge key={index} variant="secondary" className="mr-2 mb-2">
                          {metric}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Search className="w-5 h-5 mr-2" />
                      Data Sources
                    </h3>
                    <div className="space-y-2">
                      {getRecommendedDataSources().map((source, index) => (
                        <Badge key={index} variant="outline" className="mr-2 mb-2">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mt-6">
                  <h3 className="font-semibold mb-3">Problem Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Problem:</span> {problemData.title}</p>
                    <p><span className="font-medium">Type:</span> {problemTypes.find(t => t.value === problemData.problemType)?.label}</p>
                    <p><span className="font-medium">Framework:</span> {selectedFramework}</p>
                    <p><span className="font-medium">Desired Outcome:</span> {problemData.desiredOutcome}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-8">
              {step > 1 && (
                <Button variant="outline" onClick={handlePrev}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              
              {step < 5 ? (
                <Button 
                  onClick={handleNext}
                  disabled={
                    (step === 1 && (!problemData.title || !problemData.description)) ||
                    (step === 2 && !problemData.problemType) ||
                    (step === 4 && !selectedFramework)
                  }
                  className="ml-auto"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} className="ml-auto">
                  Complete Analysis
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProblemSolver;
