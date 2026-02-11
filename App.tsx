
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import LoginPage from './pages/LoginPage.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import UserDashboard from './pages/UserDashboard.tsx';
import { isConfigured, saveConfig } from './services/supabaseClient.ts';

const ConfigPanel: React.FC = () => {
    const [url, setUrl] = useState('');
    const [key, setKey] = useState('');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Conectar Base de Datos</h2>
                <p className="text-sm text-gray-600 mb-6">Introduzca las credenciales de su proyecto Supabase para sincronizar los datos en la nube.</p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Project URL</label>
                        <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://xyz.supabase.co" className="w-full p-2 border rounded mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Anon Key</label>
                        <input type="text" value={key} onChange={e => setKey(e.target.value)} placeholder="eyJhbG..." className="w-full p-2 border rounded mt-1" />
                    </div>
                    <button onClick={() => saveConfig(url, key)} className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 transition">Conectar y Reiniciar</button>
                </div>
            </div>
        </div>
    );
};

const AppContent: React.FC = () => {
    const { currentUser } = useAuth();

    if (!isConfigured()) {
        return <ConfigPanel />;
    }

    if (!currentUser) {
        return <LoginPage />;
    }

    if (currentUser.role === 'admin') {
        return <AdminDashboard />;
    }

    return <UserDashboard />;
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300">
                <AppContent />
            </div>
        </AuthProvider>
    );
};

export default App;
