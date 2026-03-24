import { useEffect, useState } from 'react';
import { FileText, Search } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { SkillList } from './components/SkillList';
import { Editor } from './components/Editor';
import { useSkillStore } from './store/skillStore';
import './App.css';

export default function App() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { skills, loadSkills, currentCategory } = useSkillStore();

  useEffect(() => {
    // Load skills from the file system
    loadSkills();
    
    // Check system dark mode preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, [loadSkills]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredSkills = skills.filter(skill => {
    const matchesCategory = currentCategory === 'all' || skill.category === currentCategory;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50`}>
      {/* Left Column: Sidebar */}
      <Sidebar />

      {/* Middle Column: Skill List */}
      <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </div>
        <SkillList 
          skills={filteredSkills}
          selectedSkill={selectedSkill}
          onSelectSkill={setSelectedSkill}
        />
      </div>

      {/* Right Column: Editor */}
      <div className="flex-1 flex flex-col">
        {selectedSkill ? (
          <Editor skillId={selectedSkill} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Select a skill to view and edit</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
