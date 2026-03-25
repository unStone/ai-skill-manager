import { FileText, Trash2 } from 'lucide-react';
import { Skill } from '../store/skillStore';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface SkillListProps {
  skills: Skill[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SkillList({ skills, selectedId, onSelect, onDelete }: SkillListProps) {
  return (
    <div className="space-y-1 p-2">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className={cn(
            'group relative rounded-lg border transition-colors',
            selectedId === skill.id
              ? 'border-primary bg-primary/10'
              : 'border-transparent bg-card hover:bg-accent'
          )}
        >
          <button
            onClick={() => onSelect(skill.id)}
            className="w-full text-left p-3 flex items-start gap-3 cursor-pointer"
          >
            <FileText className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-foreground">
                {skill.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {skill.description || '无描述'}
              </p>
            </div>
          </button>

          {/* Delete Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`确定要删除 "${skill.name}" 吗？`)) {
                onDelete(skill.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}
