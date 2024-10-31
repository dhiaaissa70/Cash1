import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Auth from '../service/Auth'; // Service Auth for API requests
import TransferService from '../service/Trunsuction'; // Import the TransferService
import { motion } from 'framer-motion';
import { useAuth } from '../providers/AuthContext'; // Assuming useAuth provides the logged-in user's info
import { ToastContainer, toast } from 'react-toastify'; // Import toast components
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import UserTreeItem from './UsersTree';

const UserDetails = () => {
  const { userId } = useParams(); // Get the userId from URL params (this will be the receiver's ID)
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Store user data
  const [amount, setAmount] = useState(''); // Store amount
  const [newUsername, setNewUsername] = useState(''); // New username state
  const [role, setRole] = useState(''); // Role state
  const [userTreeData, setUserTreeData] = useState([]); // User tree data state
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const { user: authUser } = useAuth(); // Retrieve logged-in user and token from useAuth
  const authService = new Auth();
  const transferService = new TransferService(); // Initialize TransferService
  const [loading, setLoading] = useState(false); // Loading state to disable buttons during actions
  const [transactionMessage, setTransactionMessage] = useState(''); // For displaying transaction success or error messages

  const roles = ["SuperAdmin", "Admin", "Partner", "Assistant", "User"]; // Predefined roles

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const result = await authService.getUserById(userId);

        if (result.success) {
          setUser(result.user);
          setSelectedUser(result.user); // Set the top-level user as selected by default
          setNewUsername(result.user.username);
          setRole(result.user.role);

          const treeResult = await authService.getUsersByCreaterId(userId);
          if (treeResult.success) {
            setUserTreeData(treeResult.user); // Set the root user with children
          } else {
            console.error("Error fetching user tree:", treeResult.message);
          }
        } else {
          console.error("Error fetching user:", result.message);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };


  // Function to update user details
  const handleUpdate = async () => {
    const updatedDetails = {
      username: newUsername, // Updated username
      role: role,            // Updated role
    };

    setLoading(true);
    try {
      const result = await authService.updateUser(userId, updatedDetails);

      if (result.success) {
        toast.success('Utilisateur mis à jour avec succès');
        setUser(result.user); // Update the state with the new user data
        setTimeout(() => navigate('/users'), 2000); // Redirect after 2 seconds
      } else {
        toast.error('Erreur lors de la mise à jour : ' + result.message);
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete user
  const handleDelete = async () => {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?');

    if (confirmed) {
      setLoading(true);
      try {
        const result = await authService.deleteUserById(userId);

        if (result.success) {
          toast.success('Utilisateur supprimé avec succès');
          setTimeout(() => navigate('/users'), 2000); // Redirect after 2 seconds
        } else {
          toast.error('Erreur lors de la suppression : ' + result.message);
        }
      } catch (error) {
        toast.error('Erreur lors de la suppression.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to handle deposits
  const handleDeposit = async () => {
    if (!amount) {
      toast.warn('Veuillez entrer un montant pour le dépôt.');
      return;
    }

    if (!authUser) {
      toast.error('Erreur: Utilisateur non connecté.');
      return;
    }

    setLoading(true);
    try {
      const response = await transferService.makeTransfer(
        authUser.user._id,  // Sender ID (logged-in user)
        userId,             // Receiver ID (selected user)
        amount,
        'deposit',
        'Deposit to user account'
      );

      if (response.success) {
        toast.success('Dépôt réussi.');
        setUser(response.updatedReceiver); // Update the user with the new balance
        setTimeout(() => navigate('/users'), 2000); // Redirect after 2 seconds
      } else {
        toast.error('Erreur lors du dépôt : ' + response.message);
      }
    } catch (error) {
      toast.error('Erreur lors du dépôt.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle withdrawals
  const handleWithdraw = async () => {
    if (!amount) {
      toast.warn('Veuillez entrer un montant pour le retrait.');
      return;
    }

    if (!authUser) {
      toast.error('Erreur: Utilisateur non connecté.');
      return;
    }

    setLoading(true);
    try {
      const response = await transferService.makeTransfer(
        authUser.user._id,  // Sender ID (logged-in user)
        userId,             // Receiver ID (selected user)
        amount,
        'withdraw',
        'Withdraw from user account'
      );

      if (response.success) {
        toast.success('Retrait réussi.');
        setUser(response.updatedReceiver); // Update the user with the new balance
        setTimeout(() => navigate('/users'), 2000); // Redirect after 2 seconds
      } else {
        toast.error('Erreur lors du retrait : ' + response.message);
      }
    } catch (error) {
      toast.error('Erreur lors du retrait.');
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="flex h-screen">
      {/* User tree section */}
      <div className="w-72 bg-gray-50 p-4 h-full shadow-lg overflow-y-auto">
      <h3 className="text-xl font-bold mb-4">Arbre des utilisateurs</h3>
        {userTreeData ? (
          <UserTreeItem user={userTreeData} onUserSelect={handleUserSelect} /> // Pass handleUserSelect
        ) : (
          <p className="text-gray-500">Aucun utilisateur sous ce créateur.</p>
        )}
      </div>

      {/* User details section */}
      <motion.div className="flex-1 p-6 bg-gray-50 overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">{user?.username || 'Nom d\'utilisateur'}</h2>
          <div>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2" onClick={handleDelete} disabled={loading}>
              Supprimer
            </button>
            <button className="bg-yellow-400 text-white px-4 py-2 rounded-lg" onClick={handleUpdate} disabled={loading}>
              Mettre à jour
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="mb-4">
            <label className="font-bold">ID:</label>
            <span className="ml-2">{user?._id}</span>
          </div>

          <div className="mb-4">
            <label className="font-bold">Nom d'utilisateur:</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="ml-2 border p-2 rounded-md w-full"
              placeholder="Nom d'utilisateur"
              disabled={loading}
            />
          </div>

          {/* Dropdown for selecting the role */}
          <div className="mb-4">
            <label className="font-bold">Rôle:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="ml-2 border p-2 rounded-md w-full"
              disabled={loading}
            >
              {roles.map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="font-bold">Solde:</label>
            <span className="ml-2">{user?.balance || 0} TND</span>
          </div>

          {/* Amount field */}
          <div className="mb-4">
            <label className="font-bold">Montant:</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded-md"
              placeholder="Montant"
              disabled={loading}
            />
          </div>

          {/* Quick amount buttons */}
          <div className="flex mb-4 space-x-2">
            {[500, 1000, 5000, 25000].map((value) => (
              <button
                key={value}
                className="bg-gray-200 p-2 rounded-lg"
                onClick={() => setAmount(value)}
                disabled={loading}
              >
                {value.toLocaleString()} TND
              </button>
            ))}
          </div>

          {/* Deposit and withdrawal buttons */}
          <div className="flex space-x-4">
            <button
              className="flex-1 bg-green-500 text-white p-2 rounded-lg"
              onClick={handleDeposit}
              disabled={loading}
            >
              Dépôt
            </button>
            <button
              className="flex-1 bg-red-500 text-white p-2 rounded-lg"
              onClick={handleWithdraw}
              disabled={loading}
            >
              Retrait
            </button>
          </div>

          {/* Display transaction messages */}
          {transactionMessage && (
            <div className="mt-4 p-2 text-center bg-gray-200 rounded">
              {transactionMessage}
            </div>
          )}

          {/* Add ToastContainer for showing notifications */}
          <ToastContainer />
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetails;
