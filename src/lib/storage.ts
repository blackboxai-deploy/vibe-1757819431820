// Local storage utilities for data persistence

import { Task, Note, CodeSnippet, CalculatorHistory, AppSettings, ActivityItem } from './types';

// Storage keys
const STORAGE_KEYS = {
  TASKS: 'productivity_dashboard_tasks',
  NOTES: 'productivity_dashboard_notes',
  SNIPPETS: 'productivity_dashboard_snippets',
  CALCULATOR_HISTORY: 'productivity_dashboard_calc_history',
  SETTINGS: 'productivity_dashboard_settings',
  ACTIVITY: 'productivity_dashboard_activity'
} as const;

// Generic storage functions
export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing storage item ${key}:`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting storage item ${key}:`, error);
  }
}

// Task storage functions
export function getTasks(): Task[] {
  return getStorageItem(STORAGE_KEYS.TASKS, []);
}

export function saveTasks(tasks: Task[]): void {
  setStorageItem(STORAGE_KEYS.TASKS, tasks);
}

export function addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
  const newTask: Task = {
    ...task,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const tasks = getTasks();
  tasks.unshift(newTask);
  saveTasks(tasks);
  addActivity('task', 'created', newTask.title);
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  const updatedTask = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date()
  };
  
  tasks[index] = updatedTask;
  saveTasks(tasks);
  
  if (updates.completed !== undefined) {
    addActivity('task', 'completed', updatedTask.title);
  } else {
    addActivity('task', 'updated', updatedTask.title);
  }
  
  return updatedTask;
}

export function deleteTask(id: string): boolean {
  const tasks = getTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return false;
  
  const filteredTasks = tasks.filter(t => t.id !== id);
  saveTasks(filteredTasks);
  addActivity('task', 'deleted', task.title);
  return true;
}

// Note storage functions
export function getNotes(): Note[] {
  return getStorageItem(STORAGE_KEYS.NOTES, []);
}

export function saveNotes(notes: Note[]): void {
  setStorageItem(STORAGE_KEYS.NOTES, notes);
}

export function addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
  const newNote: Note = {
    ...note,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const notes = getNotes();
  notes.unshift(newNote);
  saveNotes(notes);
  addActivity('note', 'created', newNote.title);
  return newNote;
}

export function updateNote(id: string, updates: Partial<Note>): Note | null {
  const notes = getNotes();
  const index = notes.findIndex(n => n.id === id);
  
  if (index === -1) return null;
  
  const updatedNote = {
    ...notes[index],
    ...updates,
    updatedAt: new Date()
  };
  
  notes[index] = updatedNote;
  saveNotes(notes);
  addActivity('note', 'updated', updatedNote.title);
  return updatedNote;
}

export function deleteNote(id: string): boolean {
  const notes = getNotes();
  const note = notes.find(n => n.id === id);
  if (!note) return false;
  
  const filteredNotes = notes.filter(n => n.id !== id);
  saveNotes(filteredNotes);
  addActivity('note', 'deleted', note.title);
  return true;
}

// Code snippet storage functions
export function getCodeSnippets(): CodeSnippet[] {
  return getStorageItem(STORAGE_KEYS.SNIPPETS, []);
}

export function saveCodeSnippets(snippets: CodeSnippet[]): void {
  setStorageItem(STORAGE_KEYS.SNIPPETS, snippets);
}

export function addCodeSnippet(snippet: Omit<CodeSnippet, 'id' | 'createdAt' | 'updatedAt'>): CodeSnippet {
  const newSnippet: CodeSnippet = {
    ...snippet,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const snippets = getCodeSnippets();
  snippets.unshift(newSnippet);
  saveCodeSnippets(snippets);
  addActivity('snippet', 'created', newSnippet.title);
  return newSnippet;
}

export function updateCodeSnippet(id: string, updates: Partial<CodeSnippet>): CodeSnippet | null {
  const snippets = getCodeSnippets();
  const index = snippets.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  const updatedSnippet = {
    ...snippets[index],
    ...updates,
    updatedAt: new Date()
  };
  
  snippets[index] = updatedSnippet;
  saveCodeSnippets(snippets);
  addActivity('snippet', 'updated', updatedSnippet.title);
  return updatedSnippet;
}

export function deleteCodeSnippet(id: string): boolean {
  const snippets = getCodeSnippets();
  const snippet = snippets.find(s => s.id === id);
  if (!snippet) return false;
  
  const filteredSnippets = snippets.filter(s => s.id !== id);
  saveCodeSnippets(filteredSnippets);
  addActivity('snippet', 'deleted', snippet.title);
  return true;
}

// Calculator history functions
export function getCalculatorHistory(): CalculatorHistory[] {
  return getStorageItem(STORAGE_KEYS.CALCULATOR_HISTORY, []);
}

export function addCalculatorEntry(expression: string, result: string): void {
  const history = getCalculatorHistory();
  const newEntry: CalculatorHistory = {
    id: generateId(),
    expression,
    result,
    timestamp: new Date()
  };
  
  history.unshift(newEntry);
  // Keep only last 100 entries
  if (history.length > 100) {
    history.splice(100);
  }
  
  setStorageItem(STORAGE_KEYS.CALCULATOR_HISTORY, history);
}

export function clearCalculatorHistory(): void {
  setStorageItem(STORAGE_KEYS.CALCULATOR_HISTORY, []);
}

// Settings functions
export function getSettings(): AppSettings {
  return getStorageItem(STORAGE_KEYS.SETTINGS, {
    theme: 'system',
    sidebarCollapsed: false,
    defaultTaskCategory: 'General',
    autoSave: true,
    showWelcome: true
  });
}

export function updateSettings(updates: Partial<AppSettings>): AppSettings {
  const currentSettings = getSettings();
  const newSettings = { ...currentSettings, ...updates };
  setStorageItem(STORAGE_KEYS.SETTINGS, newSettings);
  return newSettings;
}

// Activity functions
export function getActivity(): ActivityItem[] {
  return getStorageItem(STORAGE_KEYS.ACTIVITY, []);
}

export function addActivity(type: ActivityItem['type'], action: ActivityItem['action'], title: string): void {
  const activity = getActivity();
  const newActivity: ActivityItem = {
    id: generateId(),
    type,
    action,
    title,
    timestamp: new Date()
  };
  
  activity.unshift(newActivity);
  // Keep only last 50 activities
  if (activity.length > 50) {
    activity.splice(50);
  }
  
  setStorageItem(STORAGE_KEYS.ACTIVITY, activity);
}

// Export/Import functions
export function exportAllData(): string {
  const data = {
    tasks: getTasks(),
    notes: getNotes(),
    snippets: getCodeSnippets(),
    calculatorHistory: getCalculatorHistory(),
    settings: getSettings(),
    activity: getActivity(),
    exportDate: new Date().toISOString()
  };
  
  return JSON.stringify(data, null, 2);
}

export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.tasks) saveTasks(data.tasks);
    if (data.notes) saveNotes(data.notes);
    if (data.snippets) saveCodeSnippets(data.snippets);
    if (data.calculatorHistory) setStorageItem(STORAGE_KEYS.CALCULATOR_HISTORY, data.calculatorHistory);
    if (data.settings) setStorageItem(STORAGE_KEYS.SETTINGS, data.settings);
    if (data.activity) setStorageItem(STORAGE_KEYS.ACTIVITY, data.activity);
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

// Utility functions
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}