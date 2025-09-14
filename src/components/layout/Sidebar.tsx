"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useLocalStorage';

interface SidebarProps {
  className?: string;
}

const menuItems = [
  {
    section: 'Dashboard',
    items: [
      { id: 'home', label: 'Home', icon: '🏠', path: '/' },
      { id: 'search', label: 'Search', icon: '🔍', path: '/search' },
    ]
  },
  {
    section: 'Tools',
    items: [
      { id: 'text-analyzer', label: 'Text Analyzer', icon: '📝', path: '/text-analyzer' },
      { id: 'code-manager', label: 'Code Snippets', icon: '💻', path: '/code-manager' },
      { id: 'task-manager', label: 'Task Manager', icon: '✅', path: '/task-manager' },
      { id: 'notes', label: 'Notes', icon: '📔', path: '/notes' },
      { id: 'calculator', label: 'Calculator', icon: '🧮', path: '/calculator' },
    ]
  },
  {
    section: 'Data',
    items: [
      { id: 'export', label: 'Export Data', icon: '📤', path: '/export' },
      { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
    ]
  }
];

export function Sidebar({ className }: SidebarProps) {
  const [settings, setSettings] = useSettings();
  const [activeItem, setActiveItem] = useState('home');
  const { sidebarCollapsed } = settings;

  const toggleSidebar = () => {
    setSettings(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  return (
    <div className={cn(
      "flex flex-col border-r bg-card transition-all duration-300",
      sidebarCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SP</span>
            </div>
            <div>
              <h1 className="font-semibold text-sm">Smart Productivity</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {sidebarCollapsed ? '▶️' : '◀️'}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-4">
          {menuItems.map((section, sectionIndex) => (
            <div key={section.section}>
              {!sidebarCollapsed && (
                <div className="px-2 mb-2">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {section.section}
                  </h2>
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeItem === item.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      sidebarCollapsed ? "h-10 w-10 px-0" : "h-9 px-2"
                    )}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <span className={cn("flex-shrink-0", sidebarCollapsed ? "" : "mr-2")}>
                      {item.icon}
                    </span>
                    {!sidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.id === 'task-manager' && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        3
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
              {sectionIndex < menuItems.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        {!sidebarCollapsed ? (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              Storage Used: 2.4MB / 10MB
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: '24%' }} />
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-2 w-2 rounded-full bg-green-500" title="Online" />
          </div>
        )}
      </div>
    </div>
  );
}