
import React, { useState } from 'react';
import Header from '../components/Header.tsx';
import UserManagement from '../components/UserManagement.tsx';
import PasswordChange from '../components/PasswordChange.tsx';
import RecordsList from '../components/RecordsList.tsx';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('records');

    const renderContent = () => {
        switch (activeTab) {
            case 'records':
                return <RecordsList />;
            case 'users':
                return <UserManagement />;
            case 'password':
                return <PasswordChange />;
            default:
                return <RecordsList />;
        }
    };
    
    const TabButton = ({ tabName, label }: { tabName: string, label: string }) => (
         <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === tabName
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                 <div className="mb-6 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm flex space-x-2">
                    <TabButton tabName="records" label="Registros de Fichaje" />
                    <TabButton tabName="users" label="Gestionar Usuarios" />
                    <TabButton tabName="password" label="Cambiar Contraseña" />
                </div>
                <div>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
