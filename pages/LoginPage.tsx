
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { User } from '../types.ts';

const LoginPage: React.FC = () => {
    const { login, users } = useAuth();
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        if(users.length > 0 && !selectedUserId) {
            setSelectedUserId(users[0].id);
        }
    }, [users, selectedUserId]);
    
    useEffect(() => {
        const user = users.find(u => u.id === selectedUserId) || null;
        setSelectedUser(user);
        setPassword('');
        setError('');
    }, [selectedUserId, users]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) {
            setError('Por favor, seleccione un usuario.');
            return;
        }

        setError('');
        setIsLoading(true);

        const success = await login(selectedUser.username, password);

        if (!success) {
            setError('Error de acceso. Por favor, compruebe sus credenciales.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <h2 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">
                            Fichaje de Conserjes
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Seleccione su perfil para iniciar sesión
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="user-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Usuario
                            </label>
                            <select
                                id="user-select"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.username}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700"
                                placeholder="Introduzca su contraseña"
                            />
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}
                        
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading || !selectedUserId}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-colors"
                            >
                                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
