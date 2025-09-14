"use client";

import { useState } from 'react';

// Custom hook for managing local storage with React state
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Hook for managing app settings
export function useSettings() {
  return useLocalStorage('productivity_dashboard_settings', {
    theme: 'system' as 'light' | 'dark' | 'system',
    sidebarCollapsed: false,
    defaultTaskCategory: 'General',
    autoSave: true,
    showWelcome: true
  });
}

// Hook for managing tasks
export function useTasks() {
  return useLocalStorage('productivity_dashboard_tasks', []);
}

// Hook for managing notes
export function useNotes() {
  return useLocalStorage('productivity_dashboard_notes', []);
}

// Hook for managing code snippets
export function useCodeSnippets() {
  return useLocalStorage('productivity_dashboard_snippets', []);
}