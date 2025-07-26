
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Compass, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  Plus,
  X,
  CheckCircle
} from 'lucide-react';

interface StrategyBuilderProps {
  onBack: () => void;
  onComplete: (strategy: any) => void;
}

const StrategyBuilder = ({ onBack, onComplete }: StrategyBuilderProps) => {
  const [step, setStep] = useState(1);
  const [strategyData, setStrategyData] = useState({
    title: '',
    vision: '',
    northStarMetric: '',
    objectives: [] as string[],
    keyResults: [] as { objective: number; result: string; target: string; }[],
    initiatives: [] as { title: string; description: string; timeline: string; }[]
  });
  
  const [newObjective, setNewObjective] = useState('');
  const [newKeyResult, setNewKeyResult] = useState({ objective: 0, result: '', target: '' });
  const [newInitiative, setNewInitiative] = useState({ title: '', description: '', timeline: '' });

  const expertInsights = [
    {
      expert: 'Marty Cagan',
      insight: 'The best product strategies are customer-centric and focus on solving real problems that matter.',
      step: 1
    },
    {
      expert: 'Sachin Rekhi',
      insight: 'Your North Star Metric should capture the core value you deliver to customers.',
      step: 2
    },
    {
      expert: 'John Doerr',
      insight: 'OKRs work best when objectives are aspirational and key results are measurable.',
      step: 3
    },
    {
      expert: 'Melissa Perri',
      insight: 'Great initiatives are outcome-focused, not just a list of features to build.',
      step: 4
    }
  ];

  const addObjective = () => {
    if (newObjective.trim()) {
      setStrategyData({
        ...strategyData,
        objectives: [...strategyData.objectives, newObjective.trim()]
      });
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setStrategyData({
      ...strategyData,
      objectives: strategyData.objectives.filter((_, i) => i !== index),
      keyResults: strategyData.keyResults.filter(kr => kr.objective !== index)
    });
  };

  const addKeyResult = () => {
    if (newKeyResult.result.trim() && newKeyResult.target.trim()) {
      setStrategyData({
        ...strategyData,
        keyResults: [...strategyData.keyResults, newKeyResult]
      });
      setNewKeyResult({ objective: 0, result: '', target: '' });
    }
  };

  const removeKeyResult = (index: number) => {
    setStrategyData({
      ...strategyData,
      keyResults: strategyData.keyResults.filter((_, i) => i !== index)
    });
  };

  const addInitiative = () => {
    if (newInitiative.title.trim() && newInitiative.description.trim()) {
      setStrategyData({
        ...strategyData,
        initiatives: [...strategyData.initiatives, newInitiative]
      });
      setNewInitiative({ title: '', description: '', timeline: '' });
    }
  };

  const removeInitiative = (index: number) => {
    setStrategyData({
      ...strategyData,
      initiatives: strategyData.initiatives.filter((_, i) => i !== index)
    });
  };

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);
  const handleComplete = () => onComplete(strategyData);

  const progress = (step / 4) * 100;
  const currentInsight = expertInsights.find(insight => insight.step === step);

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
            <div className="text-sm font-medium text-gray-600">Step {step} of 4</div>
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Product Strategy Builder
          </h1>
          
          <Progress value={progress} className="w-full" />
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            {/* Expert Insight */}
            {currentInsight && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500 mb-6">
                <blockquote className="text-sm italic text-gray-700 mb-2">
                  "{currentInsight.insight}"
                </blockquote>
                <cite className="text-sm font-medium text-purple-600">
                  — {currentInsight.expert}
                </cite>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Compass className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                  <h2 className="text-2xl font-semibold mb-2">Vision & Direction</h2>
                  <p className="text-gray-600">Start with your product vision and strategic foundation</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Strategy Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Q3 2024 Growth Strategy"
                      value={strategyData.title}
                      onChange={(e) => setStrategyData({...strategyData, title: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="vision">Product Vision</Label>
                    <Textarea
                      id="vision"
                      placeholder="What's your product's vision? What problem are you solving and for whom?"
                      value={strategyData.vision}
                      onChange={(e) => setStrategyData({...strategyData, vision: e.target.value})}
                      className="mt-1 min-h-[120px]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Tip: A great vision is aspirational, customer-focused, and memorable
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Target className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                  <h2 className="text-2xl font-semibold mb-2">North Star Metric</h2>
                  <p className="text-gray-600">Define the one metric that captures your product's core value</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="northStar">North Star Metric</Label>
                    <Input
                      id="northStar"
                      placeholder="e.g., Weekly Active Users, Monthly Recurring Revenue, Time to Value"
                      value={strategyData.northStarMetric}
                      onChange={(e) => setStrategyData({...strategyData, northStarMetric: e.target.value})}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Choose a metric that reflects customer value and drives business results
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Good North Star Metrics are:</h3>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Customer-centric:</strong> Reflects value delivered to users</li>
                      <li>• <strong>Actionable:</strong> Teams can influence it through their work</li>
                      <li>• <strong>Leading:</strong> Predicts future business success</li>
                      <li>• <strong>Simple:</strong> Easy to understand and communicate</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 text-green-600" />
                  <h2 className="text-2xl font-semibold mb-2">Objectives & Key Results</h2>
                  <p className="text-gray-600">Set ambitious objectives with measurable key results</p>
                </div>

                {/* Objectives */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Objectives</h3>
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add an objective (e.g., Improve user retention)"
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addObjective()}
                      className="flex-1"
                    />
                    <Button onClick={addObjective}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {strategyData.objectives.map((objective, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <span>{objective}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeObjective(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Results */}
                {strategyData.objectives.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Key Results</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <select 
                        className="p-2 border rounded"
                        value={newKeyResult.objective}
                        onChange={(e) => setNewKeyResult({...newKeyResult, objective: parseInt(e.target.value)})}
                      >
                        <option value="">Select Objective</option>
                        {strategyData.objectives.map((obj, index) => (
                          <option key={index} value={index}>{obj.substring(0, 30)}...</option>
                        ))}
                      </select>
                      <Input
                        placeholder="Key Result"
                        value={newKeyResult.result}
                        onChange={(e) => setNewKeyResult({...newKeyResult, result: e.target.value})}
                      />
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Target"
                          value={newKeyResult.target}
                          onChange={(e) => setNewKeyResult({...newKeyResult, target: e.target.value})}
                        />
                        <Button onClick={addKeyResult}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {strategyData.keyResults.map((kr, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <span className="font-medium">{kr.result}</span>
                            <Badge variant="outline" className="ml-2">{kr.target}</Badge>
                            <p className="text-sm text-gray-600">
                              {strategyData.objectives[kr.objective]}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeKeyResult(index)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Users className="w-16 h-16 mx-auto mb-4 text-orange-600" />
                  <h2 className="text-2xl font-semibold mb-2">Strategic Initiatives</h2>
                  <p className="text-gray-600">Define the key initiatives that will drive your objectives</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      placeholder="Initiative Title"
                      value={newInitiative.title}
                      onChange={(e) => setNewInitiative({...newInitiative, title: e.target.value})}
                    />
                    <Input
                      placeholder="Timeline (e.g., Q3 2024)"
                      value={newInitiative.timeline}
                      onChange={(e) => setNewInitiative({...newInitiative, timeline: e.target.value})}
                    />
                    <Button onClick={addInitiative}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  
                  <Textarea
                    placeholder="Initiative Description - What will you do and what outcome do you expect?"
                    value={newInitiative.description}
                    onChange={(e) => setNewInitiative({...newInitiative, description: e.target.value})}
                    className="min-h-[80px]"
                  />

                  <div className="space-y-3">
                    {strategyData.initiatives.map((initiative, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{initiative.title}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{initiative.timeline}</Badge>
                            <Button variant="ghost" size="sm" onClick={() => removeInitiative(index)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{initiative.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {strategyData.initiatives.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6 mt-6">
                    <h3 className="font-semibold mb-3">Strategy Summary</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Title:</span> {strategyData.title}</p>
                      <p><span className="font-medium">North Star:</span> {strategyData.northStarMetric}</p>
                      <p><span className="font-medium">Objectives:</span> {strategyData.objectives.length}</p>
                      <p><span className="font-medium">Key Results:</span> {strategyData.keyResults.length}</p>
                      <p><span className="font-medium">Initiatives:</span> {strategyData.initiatives.length}</p>
                    </div>
                  </div>
                )}
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
              
              {step < 4 ? (
                <Button 
                  onClick={handleNext}
                  disabled={
                    (step === 1 && (!strategyData.title || !strategyData.vision)) ||
                    (step === 2 && !strategyData.northStarMetric) ||
                    (step === 3 && strategyData.objectives.length === 0)
                  }
                  className="ml-auto"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete} 
                  disabled={strategyData.initiatives.length === 0}
                  className="ml-auto"
                >
                  Complete Strategy
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

export default StrategyBuilder;
