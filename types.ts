
export type Role = 'admin' | 'user';

export interface User {
    id: string;
    username: string;
    role: Role;
}

export interface ClockRecord {
    id: string;
    userId: string;
    username: string;
    timestamp: string;
    type: 'in' | 'out';
}

export interface AuthContextType {
    currentUser: User | null;
    users: User[];
    login: (username: string, password?: string) => Promise<boolean>;
    logout: () => void;
    addUser: (username: string, password: string) => Promise<void>;
    setUserPassword: (userId: string, newPassword: string) => Promise<void>;
    addClockRecord: (userId: string, username: string, type: 'in' | 'out') => Promise<void>;
    getRecords: () => Promise<ClockRecord[]>;
    getUserRecords: (userId: string) => Promise<ClockRecord[]>;
    deleteRecord: (recordId: string) => Promise<void>;
    updateRecord: (record: ClockRecord) => Promise<void>;
}
