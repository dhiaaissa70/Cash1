import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronRight, FaUser, FaEllipsisV } from 'react-icons/fa';

const UserTreeItem = ({ user, onUserSelect, isRoot = false, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(isRoot); // Only keep the root node expanded by default
    const [menuOpen, setMenuOpen] = useState(false); // State to control dropdown visibility

    const getBalanceColor = (balance) => {
        return balance > 0 ? 'text-green-600' : 'text-gray-600';
    };

    const handleMenuClick = (e) => {
        e.stopPropagation(); // Prevent the menu click from toggling the user expand/collapse
        setMenuOpen(!menuOpen);
    };

    const handleOptionSelect = (option) => {
        setMenuOpen(false);
        console.log(`Selected option: ${option} for user ${user.username}`);
        // Add specific actions for each option here
    };

    return (
        <div className="mb-1 relative" style={{ paddingLeft: `${level * 15}px` }}> {/* Adjust padding based on level */}
            <div
                className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                onClick={() => {
                    setIsOpen(!isOpen);
                    onUserSelect(user);
                }}
            >
                <div className="flex items-center space-x-2">
                    {user.children && (isOpen ? <FaChevronDown className="text-indigo-600" /> : <FaChevronRight className="text-indigo-600" />)}
                    <FaUser className="text-indigo-600" />
                    <span className="text-gray-800 font-semibold">{user.username}</span>
                   
                </div>
                <div className="flex items-center space-x-2 relative">
                 
                    <FaEllipsisV className="text-gray-500" onClick={handleMenuClick} />

                    {/* Options menu */}
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <ul className="text-sm text-gray-700">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleOptionSelect('Modify User')}>
                                    Modifier l'utilisateur
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleOptionSelect('Transfer Users')}>
                                    Transférer des utilisateurs
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleOptionSelect('Add User')}>
                                    Ajouter un utilisateur
                                </li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleOptionSelect('Delete User')}>
                                    Supprimer l'utilisateur
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {isOpen && user.children && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    {user.children.map((child) => (
                        <UserTreeItem key={child._id} user={child} onUserSelect={onUserSelect} level={level + 1} /> 
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default UserTreeItem;
