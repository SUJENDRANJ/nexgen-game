import { supabase } from './supabase';

export const login = async (email, password) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .maybeSingle();

  if (error || !user) {
    throw new Error('Invalid email or password');
  }

  return user;
};

export const getCurrentUser = (email) => {
  return supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();
};
