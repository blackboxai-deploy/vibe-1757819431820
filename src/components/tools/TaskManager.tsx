"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getTasks, addTask, updateTask, deleteTask } from '@/lib/storage';
import { Task } from '@/lib/types';
import { toast } from 'sonner';

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
  };

  const categories = ['General', 'Work', 'Personal', 'Shopping', 'Health', 'Learning'];

  const filteredTasks = tasks.filter(task => {
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && task.completed) ||
      (filterStatus === 'pending' && !task.completed);
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleSubmit = () => {
    if (!newTask.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    try {
      if (editingTask) {
        // Update existing task
        const updatedTask = updateTask(editingTask.id, {
          title: newTask.title,
          description: newTask.description,
          category: newTask.category,
          priority: newTask.priority,
          dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined
        });
        
        if (updatedTask) {
          setTasks(prev => prev.map(t => t.id === editingTask.id ? updatedTask : t));
          toast.success('Task updated successfully');
        }
      } else {
        // Create new task
        const task = addTask({
          title: newTask.title,
          description: newTask.description,
          category: newTask.category,
          priority: newTask.priority,
          completed: false,
          dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined
        });
        
        setTasks(prev => [task, ...prev]);
        toast.success('Task created successfully');
      }

      // Reset form
      setNewTask({
        title: '',
        description: '',
        category: 'General',
        priority: 'medium',
        dueDate: ''
      });
      setEditingTask(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Failed to save task');
      console.error('Error saving task:', error);
    }
  };

  const handleToggleComplete = (task: Task) => {
    try {
      const updatedTask = updateTask(task.id, { completed: !task.completed });
      if (updatedTask) {
        setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
        toast.success(updatedTask.completed ? 'Task completed!' : 'Task marked as pending');
      }
    } catch (error) {
      toast.error('Failed to update task');
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    try {
      if (deleteTask(taskId)) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        toast.success('Task deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete task');
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      category: task.category,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    const taskDate = new Date(date);
    const today = new Date();
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    return `In ${diffDays} days`;
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    high: tasks.filter(t => t.priority === 'high' && !t.completed).length
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">✅ Task Manager</h1>
        <p className="text-muted-foreground">
          Organize and track your tasks with categories, priorities, and due dates.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.high}</div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:flex-1"
            />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingTask(null);
                  setNewTask({
                    title: '',
                    description: '',
                    category: 'General',
                    priority: 'medium',
                    dueDate: ''
                  });
                }}>
                  ➕ New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter task title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter task description (optional)"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newTask.category} onValueChange={(value) => 
                        setNewTask(prev => ({ ...prev, category: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newTask.priority} onValueChange={(value: 'low' | 'medium' | 'high') => 
                        setNewTask(prev => ({ ...prev, priority: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                      {editingTask ? 'Update' : 'Create'} Task
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tasks ({filteredTasks.length})</span>
            {filteredTasks.length !== tasks.length && (
              <Badge variant="outline">Filtered</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTasks.length > 0 ? (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {filteredTasks.map((task, index) => (
                  <div key={task.id}>
                    <div className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors ${
                      task.completed ? 'bg-accent/30 opacity-75' : 'hover:bg-accent/50'
                    }`}>
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleComplete(task)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h3>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} 
                               title={`${task.priority} priority`} />
                        </div>
                        {task.description && (
                          <p className={`text-sm mb-2 ${task.completed ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 text-xs">
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {task.priority}
                          </Badge>
                          {task.dueDate && (
                            <Badge 
                              variant={new Date(task.dueDate) < new Date() && !task.completed ? 'destructive' : 'outline'}
                              className="text-xs"
                            >
                              {formatDate(task.dueDate)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditTask(task)}
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                    {index < filteredTasks.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="text-center py-8">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' ? (
                <>
                  <span className="text-4xl block mb-2">🔍</span>
                  <p className="text-muted-foreground">No tasks match your current filters</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterCategory('all');
                      setFilterStatus('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-4xl block mb-2">✅</span>
                  <p className="text-muted-foreground">No tasks yet. Create your first task to get started!</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}