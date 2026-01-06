'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function AddToFavorites() {
  const [showMessage, setShowMessage] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleAddToFavorites = async () => {
    // PWA 설치 가능하면 설치 프롬프트 띄우기
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA 설치됨');
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    } else {
      // 설치 불가능하면 즐겨찾기 단축키 안내
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleAddToFavorites}
        className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium text-sm whitespace-nowrap"
        title={isInstallable ? "앱으로 설치" : "즐겨찾기에 추가"}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="hidden sm:inline">{isInstallable ? '앱 설치' : '즐겨찾기'}</span>
      </button>
      
      {showMessage && (
        <div className="absolute top-full mt-2 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap z-50">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span>💡</span>
              <span className="font-semibold">즐겨찾기 추가 방법:</span>
            </div>
            <div className="pl-6 text-gray-300">
              • Windows: Ctrl + D
            </div>
            <div className="pl-6 text-gray-300">
              • Mac: ⌘ + D
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

