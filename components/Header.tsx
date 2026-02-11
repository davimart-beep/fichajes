
import React from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';

const Header: React.FC = () => {
    const { currentUser, logout } = useAuth();

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                        Fichaje de Conserjes
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    {currentUser && (
                        <span className="hidden sm:inline text-gray-600 dark:text-gray-300">
                            Bienvenido, <span className="font-semibold">{currentUser.username}</span>
                        </span>
                    )}
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                        </svg>
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
