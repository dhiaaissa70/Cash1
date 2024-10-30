import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Pour obtenir l'ID de l'utilisateur depuis l'URL
import Auth from '../service/Auth'; // Service Auth
import { motion } from 'framer-motion'; // Pour les animations
import UserTree from './UsersTree'; // Composant UserTree

const UserDetails = () => {
  const { userId } = useParams(); // Obtenir l'ID de l'utilisateur depuis les paramètres de l'URL
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Pour stocker les données de l'utilisateur
  const [amount, setAmount] = useState(''); // Pour stocker le montant
  const [newUsername, setNewUsername] = useState(''); // Pour le nouveau nom d'utilisateur
  const [role, setRole] = useState(''); // Pour le rôle de l'utilisateur
  const [userTreeData, setUserTreeData] = useState([]); // État pour les données de l'arbre des utilisateurs
  const authService = new Auth();

  // Récupérer l'utilisateur par ID lors du montage du composant
  useEffect(() => {
    const fetchUser = async () => {
      const result = await authService.getUserById(userId);
      if (result.success) {
        setUser(result.user);
        setNewUsername(result.user.username); // Définir la valeur par défaut pour les champs de mise à jour
        setRole(result.user.role);

        // Récupérer les utilisateurs créés par cet utilisateur pour l'arbre des utilisateurs
        const treeResult = await authService.getUsersByCreaterId(userId);
        if (treeResult.success) {
          setUserTreeData(treeResult.users); // Définir les données de l'arbre des utilisateurs
        } else {
          console.error(treeResult.message);
        }
      } else {
        console.error(result.message);
      }
    };

    fetchUser();
  }, [userId, authService]); // Utilisez userId et authService comme dépendances

  // Fonction pour mettre à jour les détails de l'utilisateur
  const handleUpdate = async () => {
    const updatedDetails = {
      username: newUsername,
      role: role,
    };

    const result = await authService.updateUser(userId, updatedDetails); // Passer les détails mis à jour
    if (result.success) {
      alert('Utilisateur mis à jour avec succès');
      setUser(result.user); // Mettre à jour l'utilisateur dans l'état après une mise à jour réussie
    } else {
      console.error(result.message);
    }
  };

  // Fonction pour supprimer l'utilisateur
  const handleDelete = async () => {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?');
    if (confirmed) {
      const result = await authService.deleteUserById(userId);
      if (result.success) {
        alert('Utilisateur supprimé avec succès');
        navigate('/users'); // Rediriger vers la liste des utilisateurs
      } else {
        console.error(result.message);
      }
    }
  };

  // Si les données de l'utilisateur ne sont pas encore chargées
  if (!user) {
    return <div>Chargement des données de l'utilisateur...</div>;
  }

  return (
    <div className="flex h-screen"> {/* Disposition pleine hauteur */}
      {/* Section de l'arbre des utilisateurs */}
      <div className="w-64 bg-gray-50 p-6 h-full shadow-lg">
        <h3 className="text-xl font-bold mb-4">Arbre des utilisateurs</h3>
        {userTreeData.length > 0 ? (
          <UserTree users={userTreeData} />
        ) : (
          <p className="text-gray-500">Aucun utilisateur sous ce créateur.</p>
        )}
      </div>

      {/* Section des détails de l'utilisateur */}
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
              type="text" // S'assurer que le type est correct
              value={newUsername} // Liaison à l'état
              onChange={(e) => setNewUsername(e.target.value)} // Met à jour la valeur du nom d'utilisateur
              className="ml-2 border p-2 rounded-md w-full"
              placeholder="Nom d'utilisateur"
            />
          </div>

          <div className="mb-4">
            <label className="font-bold">Rôle:</label>
            <input
              type="text" // S'assurer que le type est correct
              value={role} // Liaison à l'état
              onChange={(e) => setRole(e.target.value)} // Met à jour la valeur du rôle
              className="ml-2 border p-2 rounded-md w-full"
              placeholder="Rôle"
            />
          </div>

          <div className="mb-4">
            <label className="font-bold">Solde:</label>
            <span className="ml-2">{user.balance} TND</span>
          </div>

          {/* Champ de montant */}
          <div className="mb-4">
            <label className="font-bold">Montant:</label>
            <input
              type="text" // S'assurer que le type est correct
              value={amount} // Liaison à l'état
              onChange={(e) => setAmount(e.target.value)} // Mettre à jour la valeur du montant
              className="w-full border p-2 rounded-md"
              placeholder="Montant"
            />
          </div>

          {/* Boutons de montant rapide */}
          <div className="flex mb-4 space-x-2">
            {[500, 1000, 5000, 25000].map((value) => (
              <button
                key={value}
                className="bg-gray-200 p-2 rounded-lg"
                onClick={() => setAmount(value)} // Définir le montant au clic
              >
                {value.toLocaleString()} TND
              </button>
            ))}
          </div>

          {/* Boutons de dépôt et retrait */}
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
