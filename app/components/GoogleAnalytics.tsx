'use client';

import Script from 'next/script';

const GoogleAnalytics: React.FC = () => {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-YGRCQX4BW3"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YGRCQX4BW3');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;

