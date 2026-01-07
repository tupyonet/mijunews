'use client';

import { useEffect } from 'react';

export default function TradingViewTicker() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        {
          proName: 'NASDAQ:QQQ',
          title: 'QQQ'
        },
        {
          proName: 'SP:SPX',
          title: 'S&P 500'
        },
        {
          proName: 'DJI:DJI',
          title: '다우존스'
        },
        {
          proName: 'CRYPTOCAP:BTC',
          title: '비트코인'
        },
        {
          proName: 'CRYPTOCAP:ETH',
          title: '이더리움'
        },
        {
          proName: 'BINANCE:BNBUSDT',
          title: 'BNB'
        },
        {
          proName: 'COINBASE:SOLUSD',
          title: '솔라나'
        },
        {
          proName: 'COINBASE:ADAUSD',
          title: '에이다'
        }
      ],
      showSymbolLogo: true,
      colorTheme: 'dark',
      isTransparent: false,
      displayMode: 'adaptive',
      locale: 'ko'
    });

    const container = document.getElementById('tradingview-ticker-container');
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="bg-gray-900 border-b border-gray-700">
      <div className="w-full overflow-hidden" style={{ height: '46px' }}>
        <div 
          id="tradingview-ticker-container"
          className="tradingview-widget-container"
          style={{ height: '100%', width: '100%' }}
        >
          <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }}></div>
        </div>
      </div>
    </div>
  );
}

