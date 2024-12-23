import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Web3ModalProvider from '../context/index';
import Navbar from '../components/Navbar';

// Server component for layout
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <title>Your Application Title</title>
        <meta name="description" content="Your application description goes here." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Web3ModalProvider>
          <AuthProvider>
            <Navbar />
            <main>{children}</main>
          </AuthProvider>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
