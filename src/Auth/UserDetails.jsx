import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // To get user ID from URL
import Auth from '../service/Auth'; // Assuming you have your Auth service setup
import { motion } from 'framer-motion'; // For some animations
import UserTree from './UsersTree'; // Import the UserTree component

const UserDetails = () => {
  const { userId } = useParams(); // Get the userId from the URL params
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // For storing the user data
  const [amount, setAmount] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [role, setRole] = useState('');
  const [userTreeData, setUserTreeData] = useState([]); // State for user tree data
  const authService = new Auth();

  // Fetch user by ID when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const result = await authService.getUserById(userId);
      if (result.success) {
        setUser(result.user);
        setNewUsername(result.user.username); // Set default value for update fields
        setRole(result.user.role);

        // Fetch the users created by this user for the user tree
        const treeResult = await authService.getUsersByCreaterId(userId);
        if (treeResult.success) {
          setUserTreeData(treeResult.users); // Set the user tree data
        } else {
          console.error(treeResult.message);
        }
      } else {
        console.error(result.message);
      }
    };

    fetchUser();
  }, [userId, authService]);

  // Function to update user details
  const handleUpdate = async () => {
    const updatedDetails = {
      username: newUsername,
      role: role
    };
    const result = await authService.updateUserById(userId, updatedDetails);
    if (result.success) {
      alert('Utilisateur mis à jour avec succès');
      setUser(result.user); // Update the user in state after successful update
    } else {
      console.error(result.message);
    }
  };

  // Function to delete the user
  const handleDelete = async () => {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?');
    if (confirmed) {
      const result = await authService.deleteUserById(userId);
      if (result.success) {
        alert('Utilisateur supprimé avec succès');
        navigate('/users'); // Redirect back to users list
      } else {
        console.error(result.message);
      }
    }
  };

  // If user data is not yet loaded
  if (!user) {
    return <div>Chargement des données de l'utilisateur...</div>;
  }

  return (
    <div className="flex h-screen"> {/* Full height screen layout */}
      {/* User Tree Section */}
      <div className="w-64 bg-gray-50 p-6 h-full shadow-lg">
        <h3 className="text-xl font-bold mb-4">Arbre des utilisateurs</h3>
        {userTreeData.length > 0 ? (
          <UserTree users={userTreeData} />
        ) : (
          <p className="text-gray-500">Aucun utilisateur sous ce créateur.</p>
        )}
      </div>

      {/* User Details Section */}
      <motion.div className="flex-1 p-6 bg-gray-50 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">{user.username}</h2>
          <div>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2" onClick={handleDelete}>
              Supprimer
            </button>
            <button className="bg-yellow-400 text-white px-4 py-2 rounded-lg" onClick={handleUpdate}>
              Mettre à jour
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="mb-4">
            <label className="font-bold">ID:</label>
            <span className="ml-2">{user._id}</span>
          </div>

          <div className="mb-4">
            <label className="font-bold">Nom d'utilisateur:</label>
            <input
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="ml-2 border p-2 rounded-md w-full"
              placeholder="Nom d'utilisateur"
            />
          </div>

          <div className="mb-4">
            <label className="font-bold">Rôle:</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="ml-2 border p-2 rounded-md w-full"
              placeholder="Rôle"
            />
          </div>

          <div className="mb-4">
            <label className="font-bold">Solde:</label>
            <span className="ml-2">{user.balance} TND</span>
          </div>

          {/* Amount Input */}
          <div className="mb-4">
            <label className="font-bold">Montant:</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded-md"
              placeholder="Montant"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex mb-4 space-x-2">
            {[500, 1000, 5000, 25000].map((value) => (
              <button
                key={value}
                className="bg-gray-200 p-2 rounded-lg"
                onClick={() => setAmount(value)}
              >
                {value.toLocaleString()} TND
              </button>
            ))}
          </div>

          {/* Deposit and Withdraw Buttons */}
          <div className="flex space-x-4">
            <button className="flex-1 bg-green-500 text-white p-2 rounded-lg">Dépôt</button>
            <button className="flex-1 bg-red-500 text-white p-2 rounded-lg">Retrait</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetails;
