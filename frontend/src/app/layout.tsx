import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './context/AuthContext';
import GlobalNavigation from './components/GlobalNavigation';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Form Builder | KI-gestützter Formular-Editor",
  description: "Erstellen Sie schöne, intelligente Formulare für jede Branche – nicht nur HR.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full bg-white">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
        <AuthProvider>
          <GlobalNavigation />
          {children}
          <footer className="bg-gray-800 text-white py-6 mt-auto dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="mb-4 sm:mb-0">&copy; {new Date().getFullYear()} Formular. All rights reserved.</p>
              <nav className="flex space-x-4">
                <a href="/privacy" className="hover:text-gray-300" aria-label="Datenschutz">Privacy</a>
                <a href="/terms" className="hover:text-gray-300" aria-label="Nutzungsbedingungen">Terms</a>
                <a href="/contact" className="hover:text-gray-300" aria-label="Kontakt">Contact</a>
              </nav>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
