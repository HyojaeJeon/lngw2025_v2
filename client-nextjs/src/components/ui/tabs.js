
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const Tabs = React.forwardRef(({ className, orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    data-orientation={orientation}
    className={cn("w-full", className)}
    {...props}
  />
));
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ className, children, value, ...props }, ref) => {
  const [activeTab, setActiveTab] = React.useState(null);
  const context = React.useContext(TabsContext);
  
  const isActive = context?.value === value;
  
  const handleClick = () => {
    if (context?.onValueChange) {
      context.onValueChange(value);
    }
  };

  return (
    <button
      ref={ref}
      role="tab"
      data-state={isActive ? "active" : "inactive"}
      data-value={value}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  const isActive = context?.value === value;

  if (!isActive) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      data-value={value}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TabsContent.displayName = "TabsContent";

// Context for managing tab state
const TabsContext = React.createContext();

// Provider wrapper for Tabs
const TabsProvider = ({ children, defaultValue, value, onValueChange }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  
  const currentValue = value !== undefined ? value : internalValue;
  const handleValueChange = onValueChange || setInternalValue;

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      {children}
    </TabsContext.Provider>
  );
};

// Enhanced Tabs component with provider
const TabsWithProvider = React.forwardRef(({ defaultValue, value, onValueChange, children, ...props }, ref) => {
  return (
    <TabsProvider defaultValue={defaultValue} value={value} onValueChange={onValueChange}>
      <Tabs ref={ref} {...props}>
        {children}
      </Tabs>
    </TabsProvider>
  );
});
TabsWithProvider.displayName = "TabsWithProvider";

export { TabsWithProvider as Tabs, TabsList, TabsTrigger, TabsContent };
