import { FileText, Trash2 } from 'lucide-react';
import { Skill } from '../store/skillStore';

interface SkillListProps {
  skills: Skill[];
  selectedSkill: string | null;
  onSelectSkill: (id: string) => void;
}

export function SkillList({ skills, selectedSkill, onSelectSkill }: SkillListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {skills.length === 0 ? (
        <div className="flex items-center justify-center h-full text-slate-400">
          <div className="text-center">
            <FileText size={32} className="mx-auto mb-2 opacity-50" />
            <p>No skills found</p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {skills.map((skill) => (
            <div
              key={skill.id}
              onClick={() => onSelectSkill(skill.id)}
              className={`p-3 cursor-pointer transition-colors ${
                selectedSkill === skill.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-slate-900 dark:text-white truncate">
                    {skill.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                    {skill.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block px-2 py-0.5 text-xs rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {skill.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Delete functionality will be implemented
                  }}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
