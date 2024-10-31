import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronRight, FaUser, FaEllipsisV } from 'react-icons/fa';

const UserTreeItem = ({ user, onUserSelect, isRoot = false, level = 0, menuOpenId, setMenuOpenId, openModals }) => {
    const [isOpen, setIsOpen] = useState(isRoot);

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setMenuOpenId(menuOpenId === user._id ? null : user._id); // Toggle menu
    };

    const handleOptionSelect = (option) => {
        setMenuOpenId(null);
        switch (option) {
            case 'Modifier l\'utilisateur':
                openModals.openUpdateModal();
                break;
            case 'Transférer des utilisateurs':
                openModals.openTransferModal();
                break;
            case 'Supprimer l\'utilisateur':
                openModals.openDeleteModal();
                break;
            default:
                console.log('Unknown option');
        }
    };

    return (
        <div className="mb-1 relative" style={{ paddingLeft: `${level * 15}px` }}>
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

                    <AnimatePresence>
                        {menuOpenId === user._id && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                            >
                                <ul className="text-sm text-gray-700">
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleOptionSelect('Modifier l\'utilisateur')}>
                                        Modifier l'utilisateur
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleOptionSelect('Transférer des utilisateurs')}>
                                        Transférer des utilisateurs
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleOptionSelect('Ajouter un utilisateur')}>
                                        Ajouter un utilisateur
                                    </li>
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleOptionSelect('Supprimer l\'utilisateur')}>
                                        Supprimer l'utilisateur
                                    </li>
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
                        <UserTreeItem 
                            key={child._id} 
                            user={child} 
                            onUserSelect={onUserSelect} 
                            level={level + 1} 
                            menuOpenId={menuOpenId} 
                            setMenuOpenId={setMenuOpenId} 
                            openModals={openModals}
                        />
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default UserTreeItem;
