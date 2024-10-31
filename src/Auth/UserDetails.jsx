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
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [role, setRole] = useState('');
  const [userTreeData, setUserTreeData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Updated user selection
  const { user: authUser } = useAuth();
  const authService = new Auth();
  const transferService = new TransferService();
  const [loading, setLoading] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const roles = ["SuperAdmin", "Admin", "Partner", "Assistant", "User"];

  const [menuOpenId, setMenuOpenId] = useState(null);
  const openUpdateModal = () => {
    if (selectedUser) {
      setNewUsername(selectedUser.username); // Ensure modal shows the selected user's data
      setRole(selectedUser.role);
    }
    setShowUpdateModal(true);
  };
  const openTransferModal = () => setShowTransferModal(true);
  const openDeleteModal = () => setShowDeleteModal(true);

  const closeModals = () => {
    setShowUpdateModal(false);
    setShowTransferModal(false);
    setShowDeleteModal(false);
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const result = await authService.getUserById(userId);

        if (result.success) {
          setUser(result.user);
          setSelectedUser(result.user); // Initialize selectedUser with the top-level user
          setNewUsername(result.user.username);
          setRole(result.user.role);

          const treeResult = await authService.getUsersByCreaterId(userId);
          if (treeResult.success) {
            setUserTreeData(treeResult.user);
          }
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
    setSelectedUser(user); // Set selected user based on tree click
    setNewUsername(user.username);
    setRole(user.role);
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;

    const updatedDetails = {
      username: newUsername,
      role: role,
    };

    setLoading(true);
    try {
      const result = await authService.updateUser(selectedUser._id, updatedDetails);

      if (result.success) {
        toast.success('Utilisateur mis à jour avec succès');
        setUser(result.user); // Update the main user data
        setSelectedUser(result.user); // Update the selected user
        setTimeout(() => navigate('/users'), 2000); // Redirect after 2 seconds
      } else {
        toast.error('Erreur lors de la mise à jour : ' + result.message);
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
      closeModals();
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?');

    if (confirmed) {
      setLoading(true);
      try {
        const result = await authService.deleteUserById(selectedUser._id);

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
        closeModals();
      }
    }
  };

  const handleDeposit = async () => {
    if (!amount) {
      toast.warn('Veuillez entrer un montant pour le dépôt.');
      return;
    }

    if (!authUser || !selectedUser) {
      toast.error('Erreur: Utilisateur non connecté ou sélectionné.');
      return;
    }

    setLoading(true);
    try {
      const response = await transferService.makeTransfer(
        authUser.user._id,
        selectedUser._id,
        amount,
        'deposit',
        'Deposit to user account'
      );

      if (response.success) {
        toast.success('Dépôt réussi.');
        setUser(response.updatedReceiver);
        setSelectedUser(response.updatedReceiver);
      } else {
        toast.error('Erreur lors du dépôt : ' + response.message);
      }
    } catch (error) {
      toast.error('Erreur lors du dépôt.');
    } finally {
      setLoading(false);
      closeModals();
    }
  };

  const handleWithdraw = async () => {
    if (!amount) {
      toast.warn('Veuillez entrer un montant pour le retrait.');
      return;
    }

    if (!authUser || !selectedUser) {
      toast.error('Erreur: Utilisateur non connecté ou sélectionné.');
      return;
    }

    setLoading(true);
    try {
      const response = await transferService.makeTransfer(
        authUser.user._id,
        selectedUser._id,
        amount,
        'withdraw',
        'Withdraw from user account'
      );

      if (response.success) {
        toast.success('Retrait réussi.');
        setUser(response.updatedReceiver);
        setSelectedUser(response.updatedReceiver);
      } else {
        toast.error('Erreur lors du retrait : ' + response.message);
      }
    } catch (error) {
      toast.error('Erreur lors du retrait.');
    } finally {
      setLoading(false);
      closeModals();
    }
  };

  return (
   <div className="flex h-screen">
      {/* User tree section */}
      <div className="w-64 bg-gray-50 p-4 h-full shadow-lg overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Arbre des utilisateurs</h3>
        {userTreeData ? (
          <UserTreeItem 
            user={userTreeData} 
            onUserSelect={handleUserSelect} 
            menuOpenId={menuOpenId} 
            setMenuOpenId={setMenuOpenId} 
            openModals={{ openUpdateModal, openTransferModal, openDeleteModal }}
          />
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

           {/* Modals for Update, Transfer, and Delete Actions */}
           {showUpdateModal && selectedUser && (
          <motion.div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={closeModals}>
            <div className="bg-white p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4">Modifier l'utilisateur</h2>
              <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full border p-2 rounded-md mb-4" placeholder="Nom d'utilisateur" />
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpdate}>Mettre à jour</button>
              <button className="ml-4 px-4 py-2 rounded" onClick={closeModals}>Annuler</button>
            </div>
          </motion.div>
        )}

        {/* Transfer Modal */}
        {showTransferModal && (
          <motion.div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={closeModals}>
            <div className="bg-white p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Transférer des fonds</h2>

{/* Quick amount selection buttons */}
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

{/* Amount input */}
<input 
  type="text" 
  value={amount} 
  onChange={(e) => setAmount(e.target.value)} 
  className="w-full border p-2 rounded-md mb-4" 
  placeholder="Montant" 
  disabled={loading} 
/>

{/* Deposit and Withdraw buttons */}
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

<button className="mt-4 px-4 py-2 rounded" onClick={closeModals}>Annuler</button>
</div>
            
          </motion.div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <motion.div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={closeModals}>
            <div className="bg-white p-6 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4">Supprimer l'utilisateur</h2>
              <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDelete}>Supprimer</button>
              <button className="ml-4 px-4 py-2 rounded" onClick={closeModals}>Annuler</button>
            </div>
          </motion.div>
        )}
          <ToastContainer />
        </div>
      </motion.div>
    </div>
  );
};

export default UserDetails;
