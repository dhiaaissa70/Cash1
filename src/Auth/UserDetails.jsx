import React, { useState } from 'react';

const UserDetails = () => {
  // État pour gérer la largeur de la première div (gauche)
  const [leftWidth, setLeftWidth] = useState(300);

  // Gestion du clic et du déplacement de la souris pour redimensionner
  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = leftWidth;

    const handleMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth > 100 && newWidth < window.innerWidth - 100) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex items-center h-screen px-4">
      {/* Div de gauche */}
      <div
        className="bg-gray-200 border border-gray-300 rounded text-center"
        style={{ width: leftWidth, minWidth: '100px' }}
      >
        <p>zdadza</p>
      </div>

      {/* Séparateur pour redimensionner */}
      <div
        onMouseDown={handleMouseDown}
        className="cursor-ew-resize mx-2"
        style={{
          width: '4px', // Ajustement de la largeur pour meilleure visibilité
          backgroundColor: 'gray',
          height: '100%',
        }}
      />

      {/* Div de droite */}
      
    </div>
  );
};

export default UserDetails;
