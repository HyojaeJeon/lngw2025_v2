'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button.js';
import { useLanguage } from '@/contexts/languageContext.js';

export default function Error({ error, reset }) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('error.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {t('error.description')}
        </p>
        <Button
          onClick={reset}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          {t('error.retry')}
        </Button>
      </div>
    </div>
  );
} 