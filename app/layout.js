<<<<<<< HEAD
import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'Weather App | Smart Forecast',
  description: 'Advanced weather app with AI-powered insights and forecasting',
  keywords: 'weather, forecast, AI weather advisor, comparison',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={poppins.className}>{children}</body>
    </html>
  );
}

=======
import './globals.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'Weather App | Smart Forecast',
  description: 'Advanced weather app with AI-powered insights and forecasting',
  keywords: 'weather, forecast, AI weather advisor, comparison',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={poppins.className}>{children}</body>
    </html>
  );
}

>>>>>>> 43126c96babf3afbbcccf11101a80700601a7caa
