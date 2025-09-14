"use client";

import { useState, useMemo } from 'react';
import { Task, Note, CodeSnippet, SearchResult } from '@/lib/types';

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const searchItems = useMemo(() => {
    if (!searchTerm.trim()) return [];

    setIsSearching(true);
    const results: SearchResult[] = [];
    const term = searchTerm.toLowerCase();

    // Search tasks from localStorage
    try {
      const tasks: Task[] = JSON.parse(localStorage.getItem('productivity_dashboard_tasks') || '[]');
      tasks.forEach(task => {
        const relevance = calculateRelevance(term, task.title, task.description || '');
        if (relevance > 0) {
          results.push({
            id: task.id,
            type: 'task',
            title: task.title,
            snippet: task.description || task.title,
            relevance
          });
        }
      });
    } catch (error) {
      console.error('Error searching tasks:', error);
    }

    // Search notes from localStorage
    try {
      const notes: Note[] = JSON.parse(localStorage.getItem('productivity_dashboard_notes') || '[]');
      notes.forEach(note => {
        const relevance = calculateRelevance(term, note.title, note.content, note.tags.join(' '));
        if (relevance > 0) {
          results.push({
            id: note.id,
            type: 'note',
            title: note.title,
            snippet: truncateText(note.content, 100),
            relevance
          });
        }
      });
    } catch (error) {
      console.error('Error searching notes:', error);
    }

    // Search code snippets from localStorage
    try {
      const snippets: CodeSnippet[] = JSON.parse(localStorage.getItem('productivity_dashboard_snippets') || '[]');
      snippets.forEach(snippet => {
        const relevance = calculateRelevance(term, snippet.title, snippet.description || '', snippet.tags.join(' '), snippet.language);
        if (relevance > 0) {
          results.push({
            id: snippet.id,
            type: 'snippet',
            title: snippet.title,
            snippet: snippet.description || `${snippet.language} code snippet`,
            relevance
          });
        }
      });
    } catch (error) {
      console.error('Error searching code snippets:', error);
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);
    
    setTimeout(() => setIsSearching(false), 100);
    return results.slice(0, 20); // Return top 20 results
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults: searchItems,
    isSearching,
    hasResults: searchItems.length > 0
  };
}

// Calculate relevance score based on term matches
function calculateRelevance(term: string, ...fields: string[]): number {
  let score = 0;
  const words = term.split(' ').filter(word => word.length > 0);

  fields.forEach((field, fieldIndex) => {
    if (!field) return;
    
    const fieldText = field.toLowerCase();
    const fieldWeight = fieldIndex === 0 ? 3 : fieldIndex === 1 ? 2 : 1; // Title gets higher weight

    words.forEach(word => {
      if (fieldText.includes(word)) {
        // Exact word match
        const wordRegex = new RegExp(`\\b${word}\\b`, 'g');
        const exactMatches = (fieldText.match(wordRegex) || []).length;
        score += exactMatches * fieldWeight * 2;

        // Partial matches
        const partialMatches = fieldText.split(word).length - 1;
        score += partialMatches * fieldWeight;

        // Bonus for matches at the beginning
        if (fieldText.startsWith(word)) {
          score += fieldWeight * 3;
        }
      }
    });
  });

  return score;
}

// Truncate text for display
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}