
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/pmNavigator';

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data: profile, error } = await (supabase as any)
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
};

export const saveUserProfile = async (profile: Omit<UserProfile, 'created_at' | 'updated_at'>): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const profileData = {
      ...profile,
      user_id: user.id
    };

    const { error } = await (supabase as any)
      .from('user_profiles')
      .upsert([profileData]);

    if (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }

    // Mark onboarding as completed
    localStorage.setItem('onboardingCompleted', 'true');
  } catch (error) {
    console.error('Error in saveUserProfile:', error);
    throw error;
  }
};

export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data: profile, error } = await (supabase as any)
      .from('user_profiles')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    return !error && profile !== null;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};
