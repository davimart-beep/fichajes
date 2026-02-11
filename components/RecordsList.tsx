
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { ClockRecord } from '../types.ts';
import EditRecordModal from './EditRecordModal.tsx';

interface RecordsListProps {
    userId?: string;
}

const RecordsList: React.FC<RecordsListProps> = ({ userId }) => {
    const { getRecords, getUserRecords, currentUser, deleteRecord, updateRecord } = useAuth();
    const [records, setRecords] = useState<ClockRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingRecord, setEditingRecord] = useState<ClockRecord | null>(null);

    const isAdmin = currentUser?.role === 'admin';

    const fetchRecords = useCallback(async () => {
        setIsLoading(true);
        const data = userId ? await getUserRecords(userId) : await getRecords();
        setRecords(data);
        setIsLoading(false);
    }, [userId, getRecords, getUserRecords]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const handleDelete = async (recordId: string) => {
        if (window.confirm('¿Está seguro de que desea borrar este registro?')) {
            await deleteRecord(recordId);
            await fetchRecords();
        }
    };

    const handleSaveRecord = async (updatedRecord: ClockRecord) => {
        await updateRecord(updatedRecord);
        setEditingRecord(null);
        await fetchRecords();
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Usuario', 'Fecha y Hora', 'Tipo'];
        const rows = records.map(r => [
            `"${r.id}"`,
            `"${r.username}"`,
            `"${new Date(r.timestamp).toLocaleString()}"`,
            `"${r.type.toUpperCase()}"`
        ]);

        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `fichajes_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return <div className="text-center p-8 text-gray-800 dark:text-gray-200">Cargando registros...</div>;
    }

    return (
        <>
            {editingRecord && (
                <EditRecordModal 
                    record={editingRecord}
                    onClose={() => setEditingRecord(null)}
                    onSave={handleSaveRecord}
                />
            )}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                     <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        {userId ? 'Mis Registros' : 'Todos los Registros de Fichaje'}
                     </h2>
                     <button 
                        onClick={exportToCSV}
                        disabled={records.length === 0}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 flex items-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                         </svg>
                         <span>Exportar a CSV</span>
                     </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                {!userId && <th scope="col" className="px-6 py-3">Usuario</th>}
                                <th scope="col" className="px-6 py-3">Fecha</th>
                                <th scope="col" className="px-6 py-3">Hora</th>
                                <th scope="col" className="px-6 py-3">Tipo</th>
                                {isAdmin && !userId && <th scope="col" className="px-6 py-3 text-right">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={isAdmin && !userId ? 5 : (userId ? 3 : 4)} className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        No se encontraron registros.
                                    </td>
                                </tr>
                            ) : (
                                records.map(record => (
                                    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        {!userId && (
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                {record.username}
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            {new Date(record.timestamp).toLocaleDateString()}
                                        </td>
                                         <td className="px-6 py-4">
                                            {new Date(record.timestamp).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                record.type === 'in'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                            }`}>
                                                {record.type === 'in' ? 'ENTRADA' : 'SALIDA'}
                                            </span>
                                        </td>
                                        {isAdmin && !userId && (
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => setEditingRecord(record)} className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline">Editar</button>
                                                <button onClick={() => handleDelete(record.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Borrar</button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default RecordsList;
