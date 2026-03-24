import { Folder, Settings, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useSkillStore } from '../store/skillStore';

export function Sidebar() {
  const { currentCategory, setCurrentCategory } = useSkillStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const categories = [
    { id: 'all', name: 'All Skills', icon: Folder },
    { id: 'claude', name: 'Claude Skills', icon: Folder },
    { id: 'cursor', name: 'Cursor Rules', icon: Folder },
    { id: 'custom', name: 'Custom', icon: Folder },
  ];

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="w-48 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
          AI Skills
        </h1>
      </div>

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto p-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = currentCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setCurrentCategory(category.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              <span>{category.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-2 space-y-2">
        <button
          onClick={handleDarkModeToggle}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          <span>{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Settings size={18} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
