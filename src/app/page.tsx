"use client";

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { getTasks, getNotes, getCodeSnippets, getActivity } from '@/lib/storage';
import { DashboardStats, ActivityItem } from '@/lib/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    totalNotes: 0,
    totalSnippets: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load dashboard data
    const loadDashboardData = () => {
      try {
        const tasks = getTasks();
        const notes = getNotes();
        const snippets = getCodeSnippets();
        const activity = getActivity();

        setStats({
          totalTasks: tasks.length,
          completedTasks: tasks.filter(t => t.completed).length,
          totalNotes: notes.length,
          totalSnippets: snippets.length,
          recentActivity: activity.slice(0, 10)
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const completionPercentage = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  const quickActions = [
    { label: 'New Task', icon: '✅', action: () => console.log('New task') },
    { label: 'New Note', icon: '📝', action: () => console.log('New note') },
    { label: 'New Snippet', icon: '💻', action: () => console.log('New snippet') },
    { label: 'Analyze Text', icon: '📊', action: () => console.log('Analyze text') },
  ];

  const formatActivityTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getActivityIcon = (type: ActivityItem['type'], action: ActivityItem['action']) => {
    const iconMap = {
      'task': { 'created': '➕', 'updated': '✏️', 'completed': '✅', 'deleted': '🗑️' },
      'note': { 'created': '📝', 'updated': '✏️', 'completed': '✅', 'deleted': '🗑️' },
      'snippet': { 'created': '💻', 'updated': '✏️', 'completed': '✅', 'deleted': '🗑️' },
      'calculation': { 'created': '🧮', 'updated': '✏️', 'completed': '✅', 'deleted': '🗑️' }
    };
    return iconMap[type]?.[action] || '📄';
  };

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header 
          title="Dashboard" 
          subtitle="Welcome to your productivity workspace"
        />
        
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              
              {/* Welcome Section */}
              <div className="rounded-lg border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Good morning! 👋</h2>
                    <p className="text-muted-foreground mt-1">
                      Ready to boost your productivity? Here's what's happening today.
                    </p>
                  </div>
                  <div className="text-6xl opacity-20">🚀</div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                    <span className="text-2xl">✅</span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalTasks}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.completedTasks} completed
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Notes</CardTitle>
                    <span className="text-2xl">📝</span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalNotes}</div>
                    <p className="text-xs text-muted-foreground">
                      Ideas & thoughts captured
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Code Snippets</CardTitle>
                    <span className="text-2xl">💻</span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalSnippets}</div>
                    <p className="text-xs text-muted-foreground">
                      Reusable code blocks
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <span className="text-2xl">📈</span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{completionPercentage}%</div>
                    <Progress value={completionPercentage} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="mr-2">⚡</span>
                      Quick Actions
                    </CardTitle>
                    <CardDescription>
                      Common tasks to get you started
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={action.action}
                      >
                        <span className="mr-3">{action.icon}</span>
                        {action.label}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="mr-2">📊</span>
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Your latest actions and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats.recentActivity.length > 0 ? (
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {stats.recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                              <div className="flex-shrink-0">
                                <span className="text-lg">
                                  {getActivityIcon(activity.type, activity.action)}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} {activity.type}: {activity.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatActivityTime(activity.timestamp)}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {activity.type}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <span className="text-4xl block mb-2">🎯</span>
                        <p>No recent activity yet.</p>
                        <p className="text-sm">Start by creating a task or note!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Features Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="mr-2">🎯</span>
                    Available Tools
                  </CardTitle>
                  <CardDescription>
                    Explore all the productivity tools at your disposal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: 'Text Analyzer', desc: 'Analyze readability, sentiment, and metrics', icon: '📊' },
                      { name: 'Task Manager', desc: 'Organize and track your to-do items', icon: '✅' },
                      { name: 'Note Taking', desc: 'Capture ideas and thoughts', icon: '📝' },
                      { name: 'Code Snippets', desc: 'Store and manage reusable code', icon: '💻' },
                      { name: 'Calculator', desc: 'Advanced calculations with history', icon: '🧮' },
                      { name: 'Data Export', desc: 'Backup and export your data', icon: '📤' }
                    ].map((tool, index) => (
                      <div key={index} className="p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{tool.icon}</span>
                          <div>
                            <h3 className="font-medium">{tool.name}</h3>
                            <p className="text-sm text-muted-foreground">{tool.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}