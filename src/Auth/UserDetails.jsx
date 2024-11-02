import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Auth from '../service/Auth';
import TransferService from '../service/Trunsuction';
import { motion } from 'framer-motion';
import { useAuth } from '../providers/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserTreeItem from './UsersTree';

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [role, setRole] = useState('');
  const [userTreeData, setUserTreeData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState(''); // État pour le nouveau mot de passe
  const  authUser  = useAuth();
  const authService = new Auth();
  const transferService = new TransferService();
  const [loading, setLoading] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const roles = ["SuperAdmin", "Admin", "Partner", "Assistant", "User"];

  const closeModals = () => {
    setShowUpdateModal(false);
    setShowTransferModal(false);
    setShowDeleteModal(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const result = await authService.getUserById(userId);
        if (result.success) {
          setUser(result.user);
          setSelectedUser(result.user);
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

  const handleUpdate = async () => {
    const userUpdateData = {
      username: newUsername,
      role: role,
      password: newPassword,
    };

    const updateUser = await authService.updateUser(selectedUser._id, userUpdateData);
    if (updateUser.success) {
      toast.success("Utilisateur mis à jour avec succès!");
    } else {
      toast.error("Erreur lors de la mise à jour de l'utilisateur.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");

    if (confirmed) {
      const deleteUserResponse = await authService.deleteUserById(selectedUser._id);
      if (deleteUserResponse.success) {
        toast.success("Utilisateur supprimé avec succès !");
        // Redirigez ou effectuez une action après la suppression, par exemple :
        navigate('/users'); // Remplacez par la route appropriée
      } else {
        toast.error("Erreur lors de la suppression de l'utilisateur.");
      }
    }
  };


  const handleDeposit = async () => {
    try {
      const response = await transferService.makeTransfer(
        authUser.user.user._id,
        selectedUser._id,
        amount,
        "deposit",
        ""
      );
      console.log(response)
      if (response.success) {
        toast.success("Depot effectué avec succès !");
        setTimeout(() => {
          window.location.reload(); // Recharge la page après 2 secondes
        }, 3000);
      } else {
        toast.error("Erreur lors de l'exécution du dépôt.");
      }
    } catch (error) {
      console.error("Erreur lors du dépôt:", error);
      toast.error("Une erreur est survenue lors du dépôt. Veuillez réessayer.");
    }
  };
  

  const handleWithdraw = async () => {
    try {
      const response = await transferService.makeTransfer(
        authUser.user.user._id,
        selectedUser._id,
        amount,
        "withdraw",
        ""
      );
  
      if (response.success) {
        toast.success("Retrait effectué avec succès !");
        setTimeout(() => {
          window.location.reload(); // Recharge la page après 2 secondes
        }, 3000);
      } else {
        toast.error("Erreur lors de l'exécution du retrait.");
      }
    } catch (error) {
      console.error("Erreur lors du retrait:", error);
      toast.error("Une erreur est survenue lors du retrait. Veuillez réessayer.");
    }
  };
  

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center items-center pt-8">
          <h4 className="text-2xl font-bold text-gray-800">Modifier Utilisateur</h4>
        </div>
        <div className="mb-4">
          <label className="font-bold">ID:</label>
          <span className="ml-2 text-gray-600">{user?._id}</span>
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
          <label className="font-bold">Nouveau mot de passe:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="ml-2 border p-2 rounded-md w-full"
            placeholder="Nouveau mot de passe"
            disabled={loading}
          />
        </div>

        <div className='pt-1 pb-4'>
          <div className="flex space-x-4">
            <button
              className="flex-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-500 transition"
              onClick={handleUpdate}
              disabled={loading}
            >
              Mettre à jour
            </button>
            <button
              className="flex-1 bg-red-600 text-white p-2 rounded-lg hover:bg-red-500 transition"
              onClick={handleDelete}
              disabled={loading}
            >
              Supprimer
            </button>
          </div>
        </div>

        <hr className="my-4 border-gray-300" />

        <div className="flex justify-center items-center pt-8">
          <h4 className="text-2xl font-bold text-gray-800">Faire un transfert</h4>
        </div>

        <div className="mb-4">
          <div className="mb-4">
            <label className="font-bold">Solde:</label>
            <span className="ml-2 text-gray-600">{user?.balance || 0} TND</span>
          </div>
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

        <div className="flex mb-4 space-x-2">
          {[500, 1000, 5000, 25000].map((value) => (
            <button
              key={value}
              className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
              onClick={() => setAmount(value)}
              disabled={loading}
            >
              {value.toLocaleString()} TND
            </button>
          ))}
        </div>

        <div className="flex space-x-4">
          <button
            className="flex-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-500 transition"
            onClick={handleDeposit}
            disabled={loading}
          >
            Dépôt
          </button>
          <button
            className="flex-1 bg-red-600 text-white p-2 rounded-lg hover:bg-red-500 transition"
            onClick={handleWithdraw}
            disabled={loading}
          >
            Retrait
          </button>
        </div>

        {transactionMessage && (
          <div className="mt-4 p-2 text-center bg-gray-200 rounded">
            {transactionMessage}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default UserDetails;
