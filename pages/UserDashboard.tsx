
import React from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import Header from '../components/Header.tsx';
import ClockWidget from '../components/ClockWidget.tsx';
import RecordsList from '../components/RecordsList.tsx';

const UserDashboard: React.FC = () => {
    const { currentUser } = useAuth();

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <ClockWidget />
                    </div>
                    <div className="lg:col-span-2">
                         <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Mis Registros</h2>
                        <RecordsList userId={currentUser.id} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
