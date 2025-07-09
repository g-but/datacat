'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

// Define types for navigation items
type NavItem = {
  name: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

// Example Icon (you can create more specific icons)
const DocumentChartBarIcon = (props: { className?: string }) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const DocumentDuplicateIcon = (props: { className?: string }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);
const FolderIcon = (props: { className?: string }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);

interface User {
  id: number;
  username: string;
  email: string;
}

interface TopNavigationProps {
  currentView: 'builder' | 'templates' | 'saved-forms' | 'about';
  onViewChange: (view: 'builder' | 'templates' | 'saved-forms' | 'about') => void;
  // Other props from the old component can be added here if needed
  onNewForm: () => void;
  onSaveForm: () => void;
  onPreviewForm: () => void;
  formTitle: string;
  onTitleChange: (title: string) => void;
  hasUnsavedChanges: boolean;
}

const navigation = [
    { name: 'Builder', href: '/builder' },
    { name: 'Forms', href: '/forms' },
    { name: 'Templates', href: '/templates' },
    { name: 'About', href: '/about' },
];


export function TopNavigation({
  currentView,
  onViewChange,
  onNewForm,
  onSaveForm,
  onPreviewForm,
  formTitle,
  onTitleChange,
  hasUnsavedChanges,
}: TopNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, user, logout, loading } = useAuth(); // Use the auth context

  const [isMegaMenuOpen, setMegaMenuOpen] = useState(false);

  const primaryLinks: NavItem[] = [
    { name: 'Formular Builder', href: '/builder', description: 'Erstellen und bearbeiten Sie Ihre Formulare.', icon: DocumentChartBarIcon },
    { name: 'Vorlagen-Bibliothek', href: '/templates', description: 'Starten Sie mit einer vorgefertigten Vorlage.', icon: DocumentDuplicateIcon },
    { name: 'Gespeicherte Formulare', href: '/forms', description: 'Verwalten Sie Ihre gespeicherten Formulare.', icon: FolderIcon },
  ];
  
  const handleViewChange = (view: 'builder' | 'templates' | 'saved-forms') => {
    onViewChange(view);
    setMegaMenuOpen(false);
  };
  
  return (
    <header className="relative isolate z-10 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/builder" onClick={() => onViewChange('builder')} className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900 dark:text-white">Form Builder</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 -my-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-white dark:bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Menü öffnen</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-10">
            <div className="relative">
              <button
                onClick={() => setMegaMenuOpen(!isMegaMenuOpen)}
                className="text-gray-500 group bg-white dark:bg-gray-800 rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span>Lösungen</span>
                <svg className="ml-2 h-5 w-5 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Mega Menu */}
              {isMegaMenuOpen && (
                <div 
                    className="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2"
                    onMouseLeave={() => setMegaMenuOpen(false)}
                >
                  <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="relative grid gap-6 bg-white dark:bg-gray-700 px-5 py-6 sm:gap-8 sm:p-8">
                      {primaryLinks.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            const view = item.href.replace('/', '');
                            if (view === 'about') {
                              onViewChange('about');
                            } else {
                              handleViewChange(view as 'builder' | 'templates' | 'saved-forms');
                            }
                          }}
                          className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                        >
                          {item.icon && <item.icon className="flex-shrink-0 h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900 dark:text-white">{item.name}</p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="px-5 py-5 bg-gray-50 dark:bg-gray-800 space-y-6 sm:flex sm:space-y-0 sm:space-x-10 sm:px-8">
                       <div className="flow-root">
                         <Link
                           href="/about"
                           onClick={() => {
                             onViewChange('about');
                             setMegaMenuOpen(false);
                           }}
                             className="-m-3 p-3 flex items-center rounded-md text-base font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                         >
                            <svg className="flex-shrink-0 h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                           <span className="ml-3">Über uns</span>
                         </Link>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" onClick={() => onViewChange('about')} className="text-base font-medium text-gray-500 hover:text-gray-900">
              Über uns
            </Link>
          </nav>
          
           {/* Actions (only for builder view) */}
          {currentView === 'builder' && (
             <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                <input 
                  type="text"
                  value={formTitle}
                  onChange={(e) => onTitleChange(e.target.value)}
                  className="w-48 mr-4 p-2 border rounded-md bg-white dark:bg-gray-700 text-sm"
                />
                 <button onClick={onPreviewForm} className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                     Vorschau
                 </button>
                 <button
                     onClick={onSaveForm}
                     className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                 >
                     Speichern {hasUnsavedChanges && <span className="ml-2 w-2 h-2 bg-green-400 rounded-full"></span>}
                 </button>
                 <button
                     onClick={onNewForm}
                     className="ml-2 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                 >
                     + Neu
                 </button>
             </div>
          )}
        </div>
      </div>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt=""
                  width={32}
                  height={32}
                />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  {!loading && (
                    <>
                      {token && user ? (
                        <div>
                          <p className="text-base font-medium text-gray-900 dark:text-white">
                            Angemeldet als {user.username}
                          </p>
                          <button
                            onClick={logout}
                            className="mt-2 w-full whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700"
                          >
                            Logout
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Link
                            href="/register"
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                          >
                            Registrieren
                          </Link>
                          <p className="mt-6 text-center text-base font-medium text-gray-500">
                            Bestehender Kunde?{' '}
                            <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
                              Anmelden
                            </Link>
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
      </Dialog>
    </header>
  );
}