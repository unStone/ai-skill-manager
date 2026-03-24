import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';
import { useSkillStore } from '../store/skillStore';
import { MarkdownPreview } from './MarkdownPreview';

interface EditorProps {
  skillId: string;
}

export function Editor({ skillId }: EditorProps) {
  const { getSkill, updateSkill } = useSkillStore();
  const skill = getSkill(skillId);
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (skill) {
      setContent(skill.content);
      setHasChanges(false);
    }
  }, [skill]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!skill) return;
    
    setIsSaving(true);
    try {
      await updateSkill(skillId, content);
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save skill:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!skill) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <p>Skill not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {skill.name}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {skill.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={showPreview ? 'Hide preview' : 'Show preview'}
          >
            {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={18} />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className={`flex flex-col ${showPreview ? 'w-1/2' : 'w-full'} border-r border-slate-200 dark:border-slate-800`}>
          <textarea
            value={content}
            onChange={handleContentChange}
            className="flex-1 p-4 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-mono text-sm outline-none resize-none"
            placeholder="Enter your skill content here..."
            spellCheck="false"
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900">
            <MarkdownPreview content={content} />
          </div>
        )}
      </div>
    </div>
  );
}
