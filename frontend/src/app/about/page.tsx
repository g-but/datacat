'use client'

import React from 'react';
import { CheckCircleIcon, LightBulbIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <main>
        {/* Hero Section */}
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pt-14">
            <div className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white dark:bg-gray-800 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 dark:ring-indigo-900 sm:-mr-80 lg:-mr-96" aria-hidden="true" />
            <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
                    <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:col-span-2 xl:col-auto">
                        Die Zukunft der Formularerstellung
                    </h1>
                    <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                        <p className="text-lg leading-8 text-gray-600 dark:text-gray-300">
                            Wir revolutionieren die Art und Weise, wie Formulare erstellt, verwaltet und analysiert werden. Unsere Mission ist es, den Prozess der Datenerfassung von einer mühsamen Aufgabe in eine intuitive, intelligente und nahtlose Erfahrung zu verwandeln. Wir glauben, dass leistungsstarke Werkzeuge nicht kompliziert sein müssen.
                        </p>
                    </div>
                    <div className="mt-10 max-w-2xl lg:mt-0 lg:max-w-none lg:mx-0">
                        <Image src="/logo.svg" alt="App-Logo" width={192} height={192} className="mt-10 w-48 h-48 object-cover rounded-lg" />
                    </div>
                </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white dark:from-gray-900 sm:h-32" />
        </div>

        {/* Content Section */}
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Unsere Vision</h2>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Wir gestalten eine Zukunft, in der intelligente Technologie die Datenerfassung vereinfacht.
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <CheckCircleIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  Mühelose Erstellung
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Unser intuitiver Drag-and-Drop-Builder macht die Formularerstellung zum Kinderspiel. Konzentrieren Sie sich auf die Fragen, nicht auf das technische Wie.
                  </p>
                </dd>
              </div>

              <div className="flex flex-col items-center text-center">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <LightBulbIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  Intelligente Automatisierung
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    In naher Zukunft wird unsere KI-gestützte Engine Formulare basierend auf Ihren Zielen vorschlagen, optimieren und sogar automatisch erstellen können.
                  </p>
                </dd>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <RocketLaunchIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                  Zukünftige Innovation
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                  <p className="flex-auto">
                    Wir sind bestrebt, die Grenzen der Formulartechnologie zu erweitern. Erwarten Sie Integrationen, erweiterte Analysen und Conversational Forms.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto max-w-7xl px-6 my-24 sm:my-32 lg:px-8">
            <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
                <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Gestalten Sie die Zukunft mit uns.
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                    Haben Sie Ideen oder Feedback? Wir sind immer offen für Anregungen aus der Community, um unser Produkt noch besser zu machen.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a href="/builder" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                        Formular-Builder starten
                    </a>
                    <a href="#" className="text-sm font-semibold leading-6 text-white">
                        Kontakt <span aria-hidden="true">→</span>
                    </a>
                </div>
                 <svg viewBox="0 0 1024 1024" className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]" aria-hidden="true">
                    <circle cx={512} cy={512} r={512} fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)" fillOpacity="0.7" />
                    <defs>
                        <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                            <stop stopColor="#7775D6" />
                            <stop offset={1} stopColor="#E935C1" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage; 