import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Skill, useSkillStore } from '../store/skillStore';
import { MarkdownPreview } from './MarkdownPreview';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface EditorProps {
  skill: Skill;
}

export function Editor({ skill }: EditorProps) {
  const [content, setContent] = useState(skill.content);
  const [skillName, setSkillName] = useState(skill.name);
  const [skillDescription, setSkillDescription] = useState(skill.description);
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const { updateSkill, deleteSkill } = useSkillStore();

  useEffect(() => {
    setContent(skill.content);
    setSkillName(skill.name);
    setSkillDescription(skill.description);
    setSaveStatus('idle');
  }, [skill]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('saving');

      const metadata = {
        ...skill.metadata,
        name: skillName,
        description: skillDescription,
      };

      await updateSkill(skill.id, content, metadata);

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save:', error);
      setSaveStatus('idle');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`确定要删除 "${skill.name}" 吗？`)) {
      return;
    }

    try {
      await deleteSkill(skill.id);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <Input
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="Skill 名称"
              className="font-semibold text-lg mb-2"
            />
            <Input
              value={skillDescription}
              onChange={(e) => setSkillDescription(e.target.value)}
              placeholder="描述"
              className="text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowPreview(!showPreview)}
              title={showPreview ? '隐藏预览' : '显示预览'}
            >
              {showPreview ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant={saveStatus === 'saved' ? 'default' : 'outline'}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {saveStatus === 'saving' ? '保存中...' : saveStatus === 'saved' ? '已保存' : '保存'}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Category & Path */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
            {skill.category === 'claude' ? 'Claude Skills' : skill.category === 'cursor' ? 'Cursor Rules' : 'Custom'}
          </span>
          <span className="truncate">{skill.path}</span>
        </div>
      </div>

      {/* Editor & Preview */}
      <div className="flex-1 flex overflow-hidden gap-4 p-4">
        {/* Editor */}
        <div className={`flex flex-col ${showPreview ? 'w-1/2' : 'w-full'} overflow-hidden`}>
          <label className="text-xs font-semibold text-muted-foreground mb-2">
            编辑
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="输入 Markdown 内容..."
            className="flex-1 rounded-lg border border-input bg-background p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 flex flex-col overflow-hidden border-l">
            <label className="text-xs font-semibold text-muted-foreground mb-2">
              预览
            </label>
            <div className="flex-1 overflow-y-auto rounded-lg border border-input bg-card p-4">
              <MarkdownPreview content={content} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
