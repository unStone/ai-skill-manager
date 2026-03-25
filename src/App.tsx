import { useEffect, useState } from 'react';
import { Search, Plus, Moon, Sun } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { SkillList } from './components/SkillList';
import { Editor } from './components/Editor';
import { useSkillStore } from './store/skillStore';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import './App.css';

export default function App() {
  const {
    skills,
    currentCategory,
    searchQuery,
    isLoading,
    error,
    loadSkills,
    setSearchQuery,
  } = useSkillStore();

  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredSkills = skills.filter(skill => {
    if (currentCategory !== 'all' && skill.category !== currentCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.content.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const selectedSkill = selectedSkillId ? skills.find(s => s.id === selectedSkillId) : null;

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar
        currentCategory={currentCategory}
        onCategoryChange={(cat) => {
          useSkillStore.setState({ currentCategory: cat });
          setSelectedSkillId(null);
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-card px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="搜索 Skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                title="创建新 Skill"
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsDarkMode(!isDarkMode)}
                title={isDarkMode ? '浅色模式' : '深色模式'}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mt-3 text-sm text-muted-foreground">
              加载中...
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Skills List */}
          <div className="w-64 border-r bg-card overflow-y-auto">
            {filteredSkills.length === 0 ? (
              <div className="flex h-full items-center justify-center p-4 text-center">
                <div className="text-muted-foreground">
                  {searchQuery ? '没有找到匹配的 Skill' : '暂无 Skill'}
                </div>
              </div>
            ) : (
              <SkillList
                skills={filteredSkills}
                selectedId={selectedSkillId}
                onSelect={setSelectedSkillId}
                onDelete={(id) => {
                  useSkillStore.getState().deleteSkill(id);
                  if (selectedSkillId === id) {
                    setSelectedSkillId(null);
                  }
                }}
              />
            )}
          </div>

          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            {selectedSkill ? (
              <Editor skill={selectedSkill} />
            ) : (
              <div className="flex h-full items-center justify-center bg-background">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg font-medium">选择一个 Skill 开始编辑</p>
                  <p className="mt-2 text-sm">或者创建一个新的 Skill</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
