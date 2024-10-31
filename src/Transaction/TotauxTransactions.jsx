import React from 'react';

const TotauxTransactions = () => {
  const totals = [
    { title: 'Total Deposits', amount: 12345 },
    { title: 'Total Withdrawals', amount: 6789 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-indigo-700 p-8 text-white">
      <h2 className="text-2xl font-bold mb-4">Transaction Totals</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {totals.map((total) => (
          <div key={total.title} className="bg-white/20 p-6 rounded-lg shadow-md text-center transition-shadow hover:shadow-lg">
            <p className="font-medium">{total.title}</p>
            <p className="text-3xl font-bold mt-2">{total.amount.toLocaleString()} TND</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotauxTransactions;
