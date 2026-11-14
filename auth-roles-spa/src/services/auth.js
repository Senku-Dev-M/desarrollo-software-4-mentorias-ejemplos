import { api } from './api.js';

// Configura el cliente con @supabase/supabase-js y la clave publicable del proyecto.
// import { createClient } from '@supabase/supabase-js';
// const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

const getProfile = (token, signal) => api('/api/me', { token, signal });

async function signInWithProvider({ email, password }, signal) {
  // TODO: llama a supabase.auth.signInWithPassword({ email, password }).
  //
  // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  // if (error) throw error;
  // signal.throwIfAborted();
  // if (!data.session) throw new Error('No se pudo iniciar sesión.');
  // return data.session.access_token;
  signal.throwIfAborted();
  throw new Error('El inicio de sesión no está disponible.');
}

export const auth = {
  async token(signal) {
    // TODO: obtén el access token vigente de supabase.auth.getSession().
    // Si no hay sesión, devuelve null.
    //
    // const { data, error } = await supabase.auth.getSession();
    // if (error) throw error;
    // signal.throwIfAborted();
    // return data.session?.access_token ?? null;
    signal.throwIfAborted();
    return null;
  },
  profile: getProfile,
  async signIn(credentials, signal) {
    const token = await signInWithProvider(credentials, signal);
    return getProfile(token, signal);
  },
  async signOut() {
    // TODO: cierra la sesión con supabase.auth.signOut() y gestiona su error.
    //
    // const { error } = await supabase.auth.signOut();
    // if (error) throw error;
  },
};
