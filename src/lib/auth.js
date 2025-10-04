import { supabase } from './supabase';

export const signUp = async (email, password, name) => {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: undefined,
      data: {
        name: name || email.split('@')[0],
      },
    },
  });

  if (authError) throw authError;

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .insert({
      user_id: authData.user.id,
      email: authData.user.email,
      name: name || email.split('@')[0],
      role: 'employee',
      points: 0,
    })
    .select()
    .single();

  if (profileError) throw profileError;

  return { user: authData.user, profile };
};

export const signIn = async (email, password) => {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw authError;

  let { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', authData.user.id)
    .maybeSingle();

  if (profileError) throw profileError;

  if (!profile) {
    const { data: newProfile, error: insertError } = await supabase
      .from('users')
      .insert({
        user_id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name || email.split('@')[0],
        role: 'employee',
        points: 0,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    profile = newProfile;
  }

  return { user: authData.user, profile };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;

  return { user, profile };
};

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    (() => {
      callback(event, session);
    })();
  });
};
