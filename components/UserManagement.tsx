
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { User } from '../types.ts';

const UserManagement: React.FC = () => {
    const { users, addUser, setUserPassword } = useAuth();
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername.trim()) {
            setError('El nombre de usuario no puede estar vacío.');
            return;
        }
        if (newPassword.length < 4) {
             setError('La contraseña debe tener al menos 4 caracteres.');
            return;
        }
        setError('');
        setSuccess('');
        try {
            await addUser(newUsername.trim(), newPassword);
            setSuccess(`Usuario "${newUsername.trim()}" añadido correctamente.`);
            setNewUsername('');
            setNewPassword('');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error desconocido.');
            }
        }
    };

    const handleResetPassword = (user: User) => {
        const newPassword = prompt(`Introduzca la nueva contraseña para ${user.username}:`);
        if (newPassword) {
             if (newPassword.length < 4) {
                alert('La contraseña debe tener al menos 4 caracteres.');
                return;
            }
            try {
                setUserPassword(user.id, newPassword);
                alert(`Contraseña para ${user.username} actualizada.`);
            } catch (err) {
                 alert('Error al resetear la contraseña.');
            }
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Añadir Nuevo Usuario</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Nombre del nuevo usuario"
                            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Contraseña inicial"
                            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                        />
                    </div>
                    <button type="submit" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition duration-300">
                        Añadir Usuario
                    </button>
                </form>
                {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                {success && <p className="text-green-500 mt-2 text-sm">{success}</p>}
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Usuarios Existentes</h2>
                <div className="overflow-x-auto">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user: User) => (
                            <li key={user.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{user.username}</span>
                                    <span className={`ml-3 px-3 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-indigo-200 text-indigo-800' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100'}`}>
                                        {user.role}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleResetPassword(user)}
                                    className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md transition duration-300">
                                    Resetear Contraseña
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
