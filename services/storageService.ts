
import { User, ClockRecord } from '../types';
import { getClient } from './supabaseClient';

export const getUsers = async (): Promise<User[]> => {
    const supabase = getClient();
    if (!supabase) return [];
    const { data, error } = await supabase.from('fichajes_users').select('id, username, role');
    if (error) console.error(error);
    return data || [];
};

export const getUserPasswords = async (): Promise<{ [userId: string]: string }> => {
    const supabase = getClient();
    if (!supabase) return {};
    const { data, error } = await supabase.from('fichajes_users').select('id, password');
    if (error) return {};
    return data.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.password }), {});
};

export const saveUser = async (user: User, password?: string) => {
    const supabase = getClient();
    if (!supabase) return;
    const userData = { ...user };
    if (password) (userData as any).password = password;
    const { error } = await supabase.from('fichajes_users').upsert(userData);
    if (error) throw error;
};

export const setUserPassword = async (userId: string, password: string) => {
    const supabase = getClient();
    if (!supabase) return;
    const { error } = await supabase.from('fichajes_users').update({ password }).eq('id', userId);
    if (error) throw error;
};

export const getRecords = async (): Promise<ClockRecord[]> => {
    const supabase = getClient();
    if (!supabase) return [];
    const { data, error } = await supabase.from('fichajes_records').select('*').order('timestamp', { ascending: false });
    if (error) return [];
    return data || [];
};

export const addRecord = async (record: ClockRecord) => {
    const supabase = getClient();
    if (!supabase) return;
    const { error } = await supabase.from('fichajes_records').insert(record);
    if (error) throw error;
};

export const deleteRecord = async (recordId: string) => {
    const supabase = getClient();
    if (!supabase) return;
    const { error } = await supabase.from('fichajes_records').delete().eq('id', recordId);
    if (error) throw error;
};

export const updateRecord = async (updatedRecord: ClockRecord) => {
    const supabase = getClient();
    if (!supabase) return;
    const { error } = await supabase.from('fichajes_records').update(updatedRecord).eq('id', updatedRecord.id);
    if (error) throw error;
};
