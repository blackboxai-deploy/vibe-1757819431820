"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './ThemeToggle';
import { useSearch } from '@/hooks/useSearch';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

export function Header({ className, title = "Dashboard", subtitle }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const { searchTerm, setSearchTerm, searchResults, isSearching } = useSearch();

  return (
    <header className={cn("flex h-16 items-center justify-between border-b bg-background px-6", className)}>
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "transition-all duration-300",
              showSearch ? "w-80" : "w-0 opacity-0"
            )}>
              <Input
                type="text"
                placeholder="Search tasks, notes, snippets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-8"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setShowSearch(!showSearch);
                if (showSearch) {
                  setSearchTerm('');
                }
              }}
            >
              🔍
            </Button>
          </div>

          {/* Search Results Dropdown */}
          {showSearch && searchTerm && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-popover border rounded-md shadow-lg z-50">
              <div className="p-4">
                {isSearching ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    <div className="text-sm font-medium mb-2">
                      Found {searchResults.length} results
                    </div>
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {result.type}
                            </Badge>
                            <span className="font-medium text-sm">{result.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(result.relevance)}% match
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {result.snippet}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No results found for "{searchTerm}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              ⚡
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              ➕ New Task
            </DropdownMenuItem>
            <DropdownMenuItem>
              📝 New Note
            </DropdownMenuItem>
            <DropdownMenuItem>
              💻 New Snippet
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              📤 Export Data
            </DropdownMenuItem>
            <DropdownMenuItem>
              📥 Import Data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              🔔
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
              >
                2
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4">
              <h3 className="font-medium mb-3">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">Task "Review quarterly reports" is due today</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">Note "Project ideas" was updated</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="relative h-8 w-8 rounded-full">
              👤
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">Productivity User</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              ⚙️ Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              📊 Statistics
            </DropdownMenuItem>
            <DropdownMenuItem>
              ❓ Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              🚪 Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}