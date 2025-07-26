
import { useState } from 'react';
import { UserProfile } from '@/types/user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Target, Lightbulb, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FiveWhysAnalysisProps {
  userProfile: UserProfile;
  onBack: () => void;
}

const FiveWhysAnalysis = ({ userProfile, onBack }: FiveWhysAnalysisProps) => {
  const [problemStatement, setProblemStatement] = useState('');
  const [whys, setWhys] = useState(['', '', '', '', '']);
  const [currentStep, setCurrentStep] = useState(0);
  const [showValidation, setShowValidation] = useState(false);
  const [analysis, setAnalysis] = useState('');

  const isNovice = userProfile.experienceLevel === 'novice';
  const isIntermediate = userProfile.experienceLevel === 'intermediate';

  const updateWhy = (index: number, value: string) => {
    const newWhys = [...whys];
    newWhys[index] = value;
    setWhys(newWhys);
  };

  const nextStep = () => {
    if (currentStep === 0 && problemStatement.trim()) {
      setCurrentStep(1);
    } else if (currentStep > 0 && currentStep < 5 && whys[currentStep - 1].trim()) {
      if (currentStep === 5) {
        setShowValidation(true);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const validateAnalysis = () => {
    setShowValidation(true);
  };

  const completeAnalysis = () => {
    // Here you would save the completed framework to user profile
    console.log('Analysis completed:', {
      problemStatement,
      whys: whys.filter(why => why.trim()),
      analysis
    });
    onBack();
  };

  const examples = {
    problemStatement: [
      "User engagement has dropped 25% over the last quarter",
      "Customer support tickets have increased by 40%",
      "New user activation rate is below target"
    ],
    whys: {
      1: ["Users aren't finding value in the first session", "Support team is overwhelmed", "Onboarding flow is confusing"],
      2: ["Key features are hard to discover", "Response times are too slow", "Users don't understand next steps"],
      3: ["Navigation is unclear", "Team lacks proper tools", "Instructions are buried in UI"],
      4: ["No user testing on navigation", "Budget constraints on tools", "No UX review process"],
      5: ["Research wasn't prioritized", "Leadership doesn't see ROI", "Design team is understaffed"]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Target className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Root Cause Analysis (5 Whys)
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {currentStep === 0 ? 'Problem Definition' : `Why #${currentStep}`}
            </span>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of 6
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Tutorial for Novice Users */}
        {isNovice && currentStep === 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-800">
                <Lightbulb className="w-5 h-5" />
                <span>What is Root Cause Analysis?</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700">
              <p className="mb-3">
                The 5 Whys technique helps you dig deeper into problems to find their root causes. 
                Instead of addressing symptoms, you'll identify the fundamental issues that need fixing.
              </p>
              <div className="bg-white/60 p-3 rounded-lg">
                <p className="font-medium mb-2">How it works:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Start with a clear problem statement</li>
                  <li>Ask "Why did this happen?" and write the answer</li>
                  <li>Take that answer and ask "Why?" again</li>
                  <li>Continue until you reach the root cause (usually 5 iterations)</li>
                  <li>Develop action items to address the root cause</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Analysis Area */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>
                  {currentStep === 0 ? 'Define Your Problem' : `Why #${currentStep}`}
                </CardTitle>
                <CardDescription>
                  {currentStep === 0 
                    ? 'Start with a clear, specific problem statement'
                    : `Ask why the previous answer happens`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="problem">Problem Statement</Label>
                      <Textarea
                        id="problem"
                        value={problemStatement}
                        onChange={(e) => setProblemStatement(e.target.value)}
                        placeholder="Describe the specific problem you want to analyze..."
                        className="mt-2 min-h-[100px]"
                      />
                      {isNovice && (
                        <p className="text-sm text-gray-600 mt-2">
                          💡 Be specific and measurable. Instead of "Users don't like our product," 
                          try "User engagement dropped 25% in the last quarter."
                        </p>
                      )}
                    </div>
                    
                    {problemStatement.trim() && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Great! Your problem statement is clear and specific. Ready to start the analysis.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {currentStep > 0 && currentStep <= 5 && (
                  <div className="space-y-4">
                    {/* Previous context */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {currentStep === 1 ? 'Problem:' : `Why #${currentStep - 1}:`}
                      </h4>
                      <p className="text-gray-700">
                        {currentStep === 1 ? problemStatement : whys[currentStep - 2]}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor={`why-${currentStep}`}>
                        Why does this happen?
                      </Label>
                      <Textarea
                        id={`why-${currentStep}`}
                        value={whys[currentStep - 1]}
                        onChange={(e) => updateWhy(currentStep - 1, e.target.value)}
                        placeholder={`Enter your answer for Why #${currentStep}...`}
                        className="mt-2"
                      />
                      
                      {isNovice && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm font-medium text-blue-900 mb-2">Example answers:</p>
                          <ul className="text-sm text-blue-700 space-y-1">
                            {examples.whys[currentStep as keyof typeof examples.whys]?.map((example, index) => (
                              <li key={index}>• {example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {showValidation && (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Review your analysis below. Have you reached an actionable root cause?
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-medium">Problem:</h5>
                        <p className="text-sm text-gray-700">{problemStatement}</p>
                      </div>
                      {whys.filter(why => why.trim()).map((why, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <h5 className="font-medium">Why #{index + 1}:</h5>
                          <p className="text-sm text-gray-700">{why}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <Label htmlFor="analysis">Next Steps & Action Items</Label>
                      <Textarea
                        id="analysis"
                        value={analysis}
                        onChange={(e) => setAnalysis(e.target.value)}
                        placeholder="Based on your root cause analysis, what specific actions should be taken?"
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  {currentStep > 0 && !showValidation && (
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      Previous
                    </Button>
                  )}
                  
                  {!showValidation ? (
                    <Button 
                      onClick={currentStep < 5 ? nextStep : validateAnalysis}
                      disabled={
                        (currentStep === 0 && !problemStatement.trim()) ||
                        (currentStep > 0 && !whys[currentStep - 1].trim())
                      }
                      className="ml-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {currentStep < 5 ? 'Next Why' : 'Review Analysis'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={completeAnalysis}
                      disabled={!analysis.trim()}
                      className="ml-auto bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                    >
                      Complete Analysis
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Help & Tips */}
          <div className="space-y-6">
            
            {/* Framework Guide */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HelpCircle className="w-5 h-5" />
                  <span>Framework Guide</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-medium mb-2">Best Practices:</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Focus on processes, not people</li>
                      <li>• Look for systemic issues</li>
                      <li>• Stop when you find actionable causes</li>
                      <li>• Validate with data when possible</li>
                    </ul>
                  </div>
                  
                  {isNovice && (
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        💡 <strong>Tip:</strong> If you're stuck, try asking stakeholders 
                        or looking at data to understand what might be causing each "why."
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { step: 0, label: 'Problem Definition', completed: problemStatement.trim() },
                    ...Array.from({length: 5}, (_, i) => ({
                      step: i + 1,
                      label: `Why #${i + 1}`,
                      completed: whys[i]?.trim()
                    }))
                  ].map((item) => (
                    <div 
                      key={item.step}
                      className={`flex items-center space-x-2 p-2 rounded ${
                        currentStep === item.step ? 'bg-blue-100' : ''
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        item.completed ? 'bg-green-500' : 
                        currentStep === item.step ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <span className={`text-sm ${
                        currentStep === item.step ? 'font-medium' : ''
                      }`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiveWhysAnalysis;
