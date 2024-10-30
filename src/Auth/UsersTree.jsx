import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaChevronRight, FaUser } from 'react-icons/fa';

// Individual tree item component
const UserTreeItem = ({ user, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-1">
      {/* Main User Item */}
      <div 
        className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          {children && (isOpen ? <FaChevronDown className="text-indigo-600" /> : <FaChevronRight className="text-indigo-600" />)}
          <FaUser className="text-indigo-600" />
          <span className="text-gray-800 font-semibold">{user.username}</span>
        </div>
        <span className="text-sm font-bold text-gray-600">{user.balance} TND</span>
      </div>

      {/* Collapsible Children */}
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="pl-4 overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

// Main User Tree component
const UserTree = ({ users }) => {
  return (
    <div className="w-64 bg-white shadow-lg h-full overflow-y-auto p-4 rounded-lg">
      {users.map(user => (
        <UserTreeItem key={user.id} user={user}>
          {user.children && user.children.map(child => (
            <UserTreeItem key={child.id} user={child}>
              {child.children && child.children.map(subChild => (
                <UserTreeItem key={subChild.id} user={subChild} />
              ))}
            </UserTreeItem>
          ))}
        </UserTreeItem>
      ))}
    </div>
  );
};

export default UserTree;
