'use client'

import * as React from 'react'
import { cn } from '@/lib/utils.js'

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = 'Input'

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 hover:border-purple-400 transition disabled:cursor-not-allowed disabled:opacity-50 appearance-none dark:bg-[#18181b] dark:border-gray-700 dark:text-white',
          'focus:border-purple-500',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {/* 커스텀 드롭다운 화살표 */}
      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      <style jsx>{`
        select::-ms-expand { display: none; }
        select::-webkit-appearance { appearance: none; }
        select { appearance: none; -webkit-appearance: none; -moz-appearance: none; }
        @media (max-width: 480px) {
          select {
            font-size: 0.95rem;
            padding-left: 0.5rem;
            padding-right: 2rem;
            height: 2.25rem;
          }
        }
      `}</style>
    </div>
  );
});
Select.displayName = 'Select';

export { Input, Select }