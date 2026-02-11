
import React, { useState } from 'react';
import { ClockRecord } from '../types.ts';

interface EditRecordModalProps {
    record: ClockRecord;
    onClose: () => void;
    onSave: (record: ClockRecord) => void;
}

// Helper to format date to YYYY-MM-DDTHH:mm for datetime-local input
const toDateTimeLocal = (isoString: string) => {
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
};

const EditRecordModal: React.FC<EditRecordModalProps> = ({ record, onClose, onSave }) => {
    const [timestamp, setTimestamp] = useState(toDateTimeLocal(record.timestamp));
    const [type, setType] = useState<'in' | 'out'>(record.type);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedRecord = {
            ...record,
            timestamp: new Date(timestamp).toISOString(),
            type,
        };
        onSave(updatedRecord);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Editar Registro</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Usuario: <span className="font-semibold">{record.username}</span>
                        </p>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="datetime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Fecha y Hora
                                </label>
                                <input
                                    type="datetime-local"
                                    id="datetime"
                                    value={timestamp}
                                    onChange={(e) => setTimestamp(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700"
                                />
                            </div>
                             <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tipo de Fichaje
                                </label>
                                <select 
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value as 'in' | 'out')}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="in">Entrada</option>
                                    <option value="out">Salida</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Guardar Cambios
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRecordModal;
