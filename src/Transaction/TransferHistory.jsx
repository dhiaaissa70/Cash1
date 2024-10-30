import React, { useState, useEffect } from 'react';
import TransferService from '../service/Trunsuction';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

const TransferHistory = ({ username }) => {
  const transferService = new TransferService();
  const [history, setHistory] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [error, setError] = useState('');

  // Fetch transfer history when component mounts
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token'); // Make sure to pass the token for authenticated requests
      const result = await transferService.getAllTransfers();
      if (result.success) {
        setHistory(result.transferHistory || []); // Ensure it's always an array
      } else {
        setError(result.message);
      }
      setLoading(false);
    };

    fetchHistory();
  }, [username]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedHistory = [...history].sort((a, b) => {
      if (key === 'amount' || key === 'balanceBefore' || key === 'balanceAfter') {
        return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
      }
      return direction === 'asc'
        ? a[key]?.localeCompare(b[key])
        : b[key]?.localeCompare(a[key]);
    });

    setHistory(sortedHistory);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <table className="min-w-full bg-gray-100 rounded-lg overflow-hidden shadow">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('date')}>
              Établi {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
            </th>
            <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('sender')}>
              Utilisateur de {sortConfig.key === 'sender' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
            </th>
            <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('receiver')}>
              Utilisateur à {sortConfig.key === 'receiver' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
            </th>
            <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('type')}>
              Taper {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
            </th>
            <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('amount')}>
              Montant {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
            </th>
            <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('balanceBefore')}>
              Solde Avant {sortConfig.key === 'balanceBefore' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
            </th>
            <th className="p-3 text-left cursor-pointer" onClick={() => handleSort('balanceAfter')}>
              Solde Après {sortConfig.key === 'balanceAfter' && (sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />)}
            </th>
            <th className="p-3 text-left">Devise</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(history) && history.length > 0 ? (
            history.map((transfer) => (
              <tr key={transfer._id} className="bg-white hover:bg-gray-200 transition-colors">
                <td className="p-3">{new Date(transfer.date).toLocaleString()}</td>
                <td className="p-3">{transfer.sender?.username}</td>
                <td className="p-3">{transfer.receiver?.username}</td>
                <td className="p-3">{transfer.type}</td>
                <td className="p-3">{transfer.amount} TND</td>
                <td className="p-3">{transfer.balanceBefore} TND</td>
                <td className="p-3">{transfer.balanceAfter} TND</td>
                <td className="p-3">{transfer.currency || 'TND'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-gray-500 p-3">Aucune transaction trouvée</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransferHistory;
