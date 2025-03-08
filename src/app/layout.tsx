import '../styles/globals.scss';
import Header from './components/Header';
import Footer from './components/Footer';
import { ContextProvider } from '@/app/providers/ContextProvider';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=1"
        />

        <link
          rel="icon"
          type="image/png"
          href=" https://cdn.salla.network/images/logo/logo-square.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          href="https://cdn.salla.network/images/logo/logo-square.png"
        />
        <meta name="msapplication-TileColor" content="#BAF3E6" />
        <meta
          name="msapplication-TileImage"
          content="https://cdn.salla.network/images/logo/logo-square.png"
        />

        <meta name="theme-color" content="#BAF3E6" />
        <meta name="msapplication-navbutton-color" content="#BAF3E6" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#BAF3E6" />

        <link rel="stylesheet" href="https://cdn.salla.network/fonts/pingarlt.css?v=1.0" />
        <link rel="stylesheet" href="https://cdn.salla.network/fonts/sallaicons.css" />
        <link rel="stylesheet" href="./app.css" />
        <title>متجر تجريبي</title>
      </head>

      <body className="w-full min-h-screen bg-gray-50 flex flex-col items-start justify-start">
        <ContextProvider>
          <Header />
          <main className="w-full main flex-auto">
            <div className="container">
              <div className="p-2 sm:p-4 bg-white rounded-lg shadow-4xl">{children}</div>
            </div>
          </main>
          <Footer />
        </ContextProvider>
      </body>
    </html>
  );
}
