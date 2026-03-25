import { Folder, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Sidebar({ currentCategory, onCategoryChange }: SidebarProps) {
  const categories = [
    { id: 'all', name: 'All Skills' },
    { id: 'claude', name: 'Claude Skills' },
    { id: 'cursor', name: 'Cursor Rules' },
    { id: 'custom', name: 'Custom' },
  ];

  return (
    <div className="w-48 border-r bg-card flex flex-col h-screen">
      {/* Logo/Title */}
      <div className="border-b px-4 py-6">
        <h1 className="text-xl font-bold text-foreground">AI Skills</h1>
        <p className="text-xs text-muted-foreground mt-1">Manage your AI skills</p>
      </div>

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={currentCategory === category.id ? 'default' : 'ghost'}
            className="w-full justify-start gap-2"
            onClick={() => onCategoryChange(category.id)}
          >
            <Folder className="h-4 w-4" />
            <span className="truncate">{category.name}</span>
          </Button>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t px-2 py-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>
      </div>
    </div>
  );
}
