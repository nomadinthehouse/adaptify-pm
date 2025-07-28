
import { useState } from 'react';
import { UserProfile, ExperienceLevel, CompanySize } from '@/types/pmNavigator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { saveUserProfile, calculateExperienceLevel } from '@/utils/userProfile';
import { Brain, Target, Users, TrendingUp, Search } from 'lucide-react';

interface OnboardingAssessmentProps {
  onComplete: (profile: UserProfile) => void;
}

const OnboardingAssessment = ({ onComplete }: OnboardingAssessmentProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    years_of_experience: 0,
    role_title: '',
    company_size: '' as CompanySize,
    industry: '',
    learning_styles: [] as string[],
    confidence_areas: {
      problemAnalysis: 3,
      metricsDesign: 3,
      stakeholderManagement: 3,
      strategicThinking: 3,
      userResearch: 3
    }
  });

  const totalSteps = 4;

  const handleLearningStyleChange = (style: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      learning_styles: checked 
        ? [...prev.learning_styles, style]
        : prev.learning_styles.filter(s => s !== style)
    }));
  };

  const handleConfidenceChange = (area: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      confidence_areas: {
        ...prev.confidence_areas,
        [area]: value[0]
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      const experience_level = calculateExperienceLevel(formData.years_of_experience);
      
      const profileData = {
        id: '',
        ...formData,
        experience_level: experience_level as ExperienceLevel,
        user_id: '', // Will be set in saveUserProfile
        preferences: {},
        created_at: new Date(),
        updated_at: new Date()
      };

      await saveUserProfile(profileData);
      onComplete(profileData);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to PM Navigator</h2>
              <p className="text-gray-600">Let's personalize your experience to help you make better product decisions</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="role">Current Role</Label>
                <Input
                  id="role"
                  value={formData.role_title}
                  onChange={(e) => setFormData(prev => ({...prev, role_title: e.target.value}))}
                  placeholder="e.g., Product Manager, Senior PM, APM"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Experience</h2>
              <p className="text-gray-600">Help us understand your background</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Years of Product Management Experience</Label>
                <div className="mt-2">
                  <Slider
                    value={[formData.years_of_experience]}
                    onValueChange={(value) => setFormData(prev => ({...prev, years_of_experience: value[0]}))}
                    max={20}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>0 years</span>
                    <span className="font-medium">{formData.years_of_experience} years</span>
                    <span>20+ years</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Company Size</Label>
                <Select value={formData.company_size} onValueChange={(value: CompanySize) => setFormData(prev => ({...prev, company_size: value}))}>
                  <SelectTrigger>
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
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({...prev, industry: e.target.value}))}
                  placeholder="e.g., SaaS, E-commerce, Fintech, Healthcare"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning Preferences</h2>
              <p className="text-gray-600">How do you prefer to learn and work?</p>
            </div>

            <div>
              <Label className="text-base font-medium mb-4 block">Learning Styles (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'visual', label: 'Visual (charts, diagrams)' },
                  { id: 'hands_on', label: 'Hands-on practice' },
                  { id: 'reading', label: 'Reading & research' },
                  { id: 'collaborative', label: 'Collaborative learning' },
                  { id: 'case_studies', label: 'Case studies' },
                  { id: 'frameworks', label: 'Structured frameworks' }
                ].map((style) => (
                  <div key={style.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={style.id}
                      checked={formData.learning_styles.includes(style.id)}
                      onCheckedChange={(checked) => handleLearningStyleChange(style.id, checked as boolean)}
                    />
                    <Label htmlFor={style.id} className="text-sm">{style.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confidence Assessment</h2>
              <p className="text-gray-600">Rate your confidence in these PM areas (1 = beginner, 5 = expert)</p>
            </div>

            <div className="space-y-6">
              {[
                { key: 'problemAnalysis', label: 'Problem Analysis & Root Cause', icon: Target },
                { key: 'metricsDesign', label: 'Metrics Design & Analytics', icon: TrendingUp },
                { key: 'stakeholderManagement', label: 'Stakeholder Management', icon: Users },
                { key: 'strategicThinking', label: 'Strategic Thinking & Planning', icon: Brain },
                { key: 'userResearch', label: 'User Research & Insights', icon: Search }
              ].map(({ key, label, icon: Icon }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <Label className="font-medium">{label}</Label>
                  </div>
                  <div className="px-4">
                    <Slider
                      value={[formData.confidence_areas[key as keyof typeof formData.confidence_areas]]}
                      onValueChange={(value) => handleConfidenceChange(key, value)}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Beginner</span>
                      <span className="font-medium">
                        {formData.confidence_areas[key as keyof typeof formData.confidence_areas]}/5
                      </span>
                      <span>Expert</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.role_title;
      case 2:
        return formData.company_size && formData.industry;
      case 3:
        return formData.learning_styles.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Setup Your PM Profile</CardTitle>
              <CardDescription>Step {step} of {totalSteps}</CardDescription>
            </div>
            <div className="text-sm text-gray-500">
              {Math.round((step / totalSteps) * 100)}% complete
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 1}
            >
              Previous
            </Button>
            
            {step < totalSteps ? (
              <Button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                Complete Setup
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingAssessment;
