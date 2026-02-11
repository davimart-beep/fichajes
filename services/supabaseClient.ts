
import { createClient } from '@supabase/supabase-js';

const getSupabaseConfig = () => {
    const url = localStorage.getItem('SUPABASE_URL');
    const key = localStorage.getItem('SUPABASE_ANON_KEY');
    return { url, key };
};

export const isConfigured = () => {
    const { url, key } = getSupabaseConfig();
    return !!url && !!key;
};

export const getClient = () => {
    const { url, key } = getSupabaseConfig();
    if (!url || !key) return null;
    return createClient(url, key);
};

export const saveConfig = (url: string, key: string) => {
    localStorage.setItem('SUPABASE_URL', url);
    localStorage.setItem('SUPABASE_ANON_KEY', key);
    // Forzamos una recarga limpia al root
    window.location.href = window.location.pathname;
};
