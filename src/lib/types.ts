// TypeScript interfaces and types for the productivity dashboard

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  category?: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TextAnalysis {
  wordCount: number;
  charCount: number;
  charCountNoSpaces: number;
  paragraphs: number;
  sentences: number;
  readingTime: number;
  readabilityScore: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  keyPhrases: string[];
}

export interface CalculatorHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  totalNotes: number;
  totalSnippets: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'task' | 'note' | 'snippet' | 'calculation';
  action: 'created' | 'updated' | 'completed' | 'deleted';
  title: string;
  timestamp: Date;
}

export interface SearchResult {
  id: string;
  type: 'task' | 'note' | 'snippet';
  title: string;
  snippet: string;
  relevance: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  defaultTaskCategory: string;
  autoSave: boolean;
  showWelcome: boolean;
}