'use client';

import { Button } from '@/components/ui/button.js';
import { useLanguage } from '@/contexts/languageContext.js';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('notFound.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {t('notFound.description')}
        </p>
        <Button
          onClick={() => router.push('/')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          {t('notFound.home')}
        </Button>
      </div>
    </div>
  );
} 