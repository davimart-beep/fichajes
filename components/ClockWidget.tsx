
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { ClockRecord } from '../types.ts';

const ClockWidget: React.FC = () => {
    const { currentUser, addClockRecord, getUserRecords } = useAuth();
    const [lastRecord, setLastRecord] = useState<ClockRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchLastRecord = async () => {
        if (currentUser) {
            setIsLoading(true);
            const records = await getUserRecords(currentUser.id);
            setLastRecord(records.length > 0 ? records[0] : null);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLastRecord();
    }, [currentUser]);

    const handleClock = async (type: 'in' | 'out') => {
        if (currentUser) {
            await addClockRecord(currentUser.id, currentUser.username, type);
            await fetchLastRecord();
        }
    };

    const currentStatus = lastRecord?.type === 'in' ? 'Dentro' : 'Fuera';
    const nextAction = lastRecord?.type === 'in' ? 'out' : 'in';
    const actionText = nextAction === 'in' ? 'Fichar Entrada' : 'Fichar Salida';
    const actionColor = nextAction === 'in' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
    const statusColor = lastRecord?.type === 'in' ? 'text-green-500' : 'text-red-500';

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">Reloj de Fichaje</h2>
            <p className="text-5xl font-mono font-bold text-gray-900 dark:text-white mb-4">
                {currentTime.toLocaleTimeString()}
            </p>
            {isLoading ? (
                 <div className="animate-pulse h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto mb-6"></div>
            ) : (
                <p className={`text-xl font-semibold mb-6 ${statusColor}`}>
                    Estado: {currentStatus}
                </p>
            )}
           
            <button
                onClick={() => handleClock(nextAction)}
                disabled={isLoading}
                className={`w-full py-4 px-6 text-white font-bold rounded-lg transition duration-300 ease-in-out transform hover:scale-105 text-lg ${actionColor} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {actionText}
            </button>
             {lastRecord && (
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                     Última acción: {new Date(lastRecord.timestamp).toLocaleString()}
                 </p>
            )}
        </div>
    );
};

export default ClockWidget;
