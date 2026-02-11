
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, ClockRecord, AuthContextType } from '../types.ts';
import * as storage from '../services/storageService.ts';
import { isConfigured } from '../services/supabaseClient.ts';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);

    const refreshUsers = useCallback(async () => {
        if (!isConfigured()) return;
        const allUsers = await storage.getUsers();
        setUsers(allUsers);
    }, []);

    useEffect(() => {
        refreshUsers();
    }, [refreshUsers]);

    const login = useCallback(async (username: string, password?: string): Promise<boolean> => {
        const passwords = await storage.getUserPasswords();
        const allUsers = await storage.getUsers();
        const user = allUsers.find(u => u.username.toLowerCase() === username.toLowerCase());

        if (user && password) {
            if (passwords[user.id] === password) {
                setCurrentUser(user);
                return true;
            }
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
    }, []);

    const addUser = useCallback(async (username: string, password: string) => {
        const newUser: User = {
            id: new Date().getTime().toString(),
            username,
            role: 'user',
        };
        await storage.saveUser(newUser, password);
        await refreshUsers();
    }, [refreshUsers]);

    const setUserPassword = useCallback(async (userId: string, newPassword: string) => {
        await storage.setUserPassword(userId, newPassword);
    }, []);
    
    const addClockRecord = useCallback(async (userId: string, username: string, type: 'in' | 'out') => {
        const newRecord: ClockRecord = {
            id: new Date().toISOString() + Math.random(),
            userId,
            username,
            timestamp: new Date().toISOString(),
            type,
        };
        await storage.addRecord(newRecord);
    }, []);

    const getRecords = useCallback(async (): Promise<ClockRecord[]> => {
        return await storage.getRecords();
    }, []);

    const getUserRecords = useCallback(async (userId: string): Promise<ClockRecord[]> => {
        const all = await storage.getRecords();
        return all.filter(r => r.userId === userId);
    }, []);

    const deleteRecord = useCallback(async (recordId: string) => {
        await storage.deleteRecord(recordId);
    }, []);

    const updateRecord = useCallback(async (record: ClockRecord) => {
        await storage.updateRecord(record);
    }, []);

    const value = {
        currentUser,
        users,
        login,
        logout,
        addUser,
        setUserPassword,
        addClockRecord,
        getRecords,
        getUserRecords,
        deleteRecord,
        updateRecord
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
