'use client';

import { useState } from 'react';

export default function AddToFavorites() {
  const [showMessage, setShowMessage] = useState(false);

  const handleAddToFavorites = () => {
    // Ctrl+D (Windows) 또는 Cmd+D (Mac) 안내
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleAddToFavorites}
        className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium text-sm whitespace-nowrap"
        title="즐겨찾기에 추가"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="hidden sm:inline">즐겨찾기</span>
      </button>
      
      {showMessage && (
        <div className="absolute top-full mt-2 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap z-50">
          <div className="flex items-center gap-2">
            <span>💡</span>
            <span>Ctrl+D (Windows) 또는 ⌘+D (Mac)을 눌러주세요</span>
          </div>
        </div>
      )}
    </div>
  );
}

