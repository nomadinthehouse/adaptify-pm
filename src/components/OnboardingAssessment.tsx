
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { UserProfile, CompanySize } from '@/types/pmNavigator';
import { saveUserProfile, calculateExperienceLevel } from '@/utils/userProfile';
import { ArrowRight, Target, Users, TrendingUp, Search, MessageSquare } from 'lucide-react';

interface OnboardingAssessmentProps {
  onComplete: (profile: UserProfile) => void;
}

const OnboardingAssessment = ({ onComplete }: OnboardingAssessmentProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    yearsOfExperience: 0,
    currentRole: '',
    companySize: '' as CompanySize,
    industry: '',
    learningStyles: [] as string[],
    confidenceAreas: {
      problemAnalysis: 3,
      metricsDesign: 3,
      stakeholderManagement: 3,
      strategicThinking: 3,
      userResearch: 3,
    }
  });

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleLearningStyleChange = (style: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      learningStyles: checked 
        ? [...prev.learningStyles, style]
        : prev.learningStyles.filter(s => s !== style)
    }));
  };

  const handleSubmit = async () => {
    const experienceLevel = calculateExperienceLevel(formData.yearsOfExperience);
    
    const profileData = {
      user_id: 'anonymous_' + Date.now(), // In real app, this would be auth.uid()
      name: formData.name,
      email: formData.email,
      experience_level: experienceLevel,
      years_of_experience: formData.yearsOfExperience,
      current_role: formData.currentRole,
      company_size: formData.companySize,
      industry: formData.industry,
      learning_styles: formData.learningStyles,
      confidence_areas: formData.confidenceAreas,
      preferences: {
        scaffoldingLevel: experienceLevel === 'novice' ? 3 : experienceLevel === 'intermediate' ? 2 : 1,
        helpVisibility: experienceLevel === 'novice',
        expertMode: experienceLevel === 'senior'
      }
    };

    const profile = await saveUserProfile(profileData);
    if (profile) {
      onComplete(profile);
    }
  };

  const confidenceIcons = {
    problemAnalysis: Target,
    metricsDesign: TrendingUp,
    stakeholderManagement: Users,
    strategicThinking: MessageSquare,
    userResearch: Search
  };

  const confidenceLabels = {
    problemAnalysis: 'Problem Analysis',
    metricsDesign: 'Metrics Design',
    stakeholderManagement: 'Stakeholder Management',
    strategicThinking: 'Strategic Thinking',
    userResearch: 'User Research'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Step {step} of 4</span>
            <span className="text-sm text-gray-500">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to PM Navigator
            </CardTitle>
            <CardDescription className="text-lg">
              Your First Principles Product Management Copilot
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your.email@company.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Current Role</Label>
                    <Input
                      id="role"
                      value={formData.currentRole}
                      onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                      placeholder="e.g., Senior Product Manager"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Professional Background</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Years of PM Experience</Label>
                    <div className="mt-2">
                      <Slider
                        value={[formData.yearsOfExperience]}
                        onValueChange={(value) => setFormData({...formData, yearsOfExperience: value[0]})}
                        max={15}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>0 years</span>
                        <span className="font-medium">{formData.yearsOfExperience} years</span>
                        <span>15+ years</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Company Size</Label>
                    <Select value={formData.companySize} onValueChange={(value: CompanySize) => setFormData({...formData, companySize: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startup">Startup (1-50 employees)</SelectItem>
                        <SelectItem value="scale_up">Scale-up (51-200 employees)</SelectItem>
                        <SelectItem value="mid_market">Mid-market (201-1000 employees)</SelectItem>
                        <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Industry</Label>
                    <Select value={formData.industry} onValueChange={(value: string) => setFormData({...formData, industry: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="b2b_saas">B2B SaaS</SelectItem>
                        <SelectItem value="consumer_tech">Consumer Tech</SelectItem>
                        <SelectItem value="fintech">Fintech</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Learning Preferences</h3>
                <div>
                  <Label className="text-base font-medium mb-3 block">How do you prefer to learn? (Select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'visual', label: 'Visual learner', desc: 'Charts, diagrams, videos' },
                      { id: 'hands-on', label: 'Hands-on practice', desc: 'Interactive exercises' },
                      { id: 'reading', label: 'Reading & research', desc: 'Articles, case studies' },
                      { id: 'discussion', label: 'Discussion & feedback', desc: 'Peer learning, mentoring' }
                    ].map((style) => (
                      <div key={style.id} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                        <Checkbox
                          id={style.id}
                          checked={formData.learningStyles.includes(style.id)}
                          onCheckedChange={(checked) => handleLearningStyleChange(style.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={style.id} className="font-medium cursor-pointer">{style.label}</Label>
                          <p className="text-sm text-gray-500">{style.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Confidence Assessment</h3>
                <p className="text-gray-600 mb-6">Rate your current confidence level in each area (1-5 scale):</p>
                <div className="space-y-6">
                  {Object.entries(confidenceLabels).map(([key, label]) => {
                    const Icon = confidenceIcons[key as keyof typeof confidenceIcons];
                    return (
                      <div key={key} className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-5 h-5 text-blue-600" />
                          <Label className="font-medium">{label}</Label>
                        </div>
                        <div className="px-4">
                          <Slider
                            value={[formData.confidenceAreas[key as keyof typeof formData.confidenceAreas]]}
                            onValueChange={(value) => setFormData({
                              ...formData,
                              confidenceAreas: {
                                ...formData.confidenceAreas,
                                [key]: value[0]
                              }
                            })}
                            max={5}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>Beginner</span>
                            <span className="font-medium">
                              {formData.confidenceAreas[key as keyof typeof formData.confidenceAreas]}/5
                            </span>
                            <span>Expert</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button variant="outline" onClick={handlePrev}>
                  Previous
                </Button>
              )}
              {step < 4 ? (
                <Button 
                  onClick={handleNext}
                  disabled={
                    (step === 1 && (!formData.name || !formData.email || !formData.currentRole)) ||
                    (step === 2 && (!formData.companySize || !formData.industry))
                  }
                  className="ml-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="ml-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  disabled={formData.learningStyles.length === 0}
                >
                  Complete Setup
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingAssessment;
