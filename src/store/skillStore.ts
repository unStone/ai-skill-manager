import { create as createStore } from 'zustand';
import { readDir, readTextFile, writeTextFile, remove, exists } from '@tauri-apps/plugin-fs';
import { homeDir } from '@tauri-apps/api/path';
import * as YAML from 'yaml';

export interface SkillMetadata {
  name: string;
  description: string;
  context?: string;
  allowedTools?: string[];
  tags?: string[];
}

export interface Skill {
  id: string;
  path: string;
  category: 'claude' | 'cursor' | 'custom';
  name: string;
  description: string;
  content: string;
  metadata: SkillMetadata;
  lastModified: number;
  tags?: string[];
}

interface SkillStore {
  skills: Skill[];
  currentCategory: string;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  loadSkills: () => Promise<void>;
  getSkill: (id: string) => Skill | undefined;
  getFilteredSkills: () => Skill[];
  updateSkill: (id: string, content: string, metadata?: SkillMetadata) => Promise<void>;
  createSkill: (category: string, name: string, content: string, metadata?: SkillMetadata) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  setCurrentCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useSkillStore = createStore<SkillStore>((set, get) => ({
  skills: [],
  currentCategory: 'all',
  searchQuery: '',
  isLoading: false,
  error: null,

  loadSkills: async () => {
    set({ isLoading: true, error: null });
    try {
      const home = await homeDir();
      const skills: Skill[] = [];

      // Load Claude Skills
      try {
        const claudePath = `${home}/.claude/skills`;
        const pathExists = await exists(claudePath);
        
        if (pathExists) {
          const claudeEntries = await readDir(claudePath);
          
          for (const entry of claudeEntries) {
            if (entry.isDirectory) {
              const skillMdPath = `${claudePath}/${entry.name}/SKILL.md`;
              try {
                const content = await readTextFile(skillMdPath);
                const { metadata, body } = parseSkillFile(content);
                
                skills.push({
                  id: `claude-${entry.name}`,
                  path: skillMdPath,
                  category: 'claude',
                  name: metadata.name || entry.name,
                  description: metadata.description || '',
                  content: body,
                  metadata,
                  lastModified: Date.now(),
                  tags: metadata.tags || [],
                });
              } catch (err) {
                console.error(`Failed to read skill: ${skillMdPath}`, err);
              }
            }
          }
        }
      } catch (err) {
        console.log('Claude skills directory not found or empty', err);
      }

      // Load Cursor Rules
      try {
        const cursorPath = `${home}/.cursor/rules`;
        const pathExists = await exists(cursorPath);
        
        if (pathExists) {
          const cursorEntries = await readDir(cursorPath);
          
          for (const entry of cursorEntries) {
            if (!entry.isDirectory && (entry.name.endsWith('.md') || entry.name.endsWith('.mdc'))) {
              const rulePath = `${cursorPath}/${entry.name}`;
              try {
                const content = await readTextFile(rulePath);
                const { metadata, body } = parseSkillFile(content);
                
                skills.push({
                  id: `cursor-${entry.name}`,
                  path: rulePath,
                  category: 'cursor',
                  name: metadata.name || entry.name.replace(/\.(md|mdc)$/, ''),
                  description: metadata.description || '',
                  content: body,
                  metadata,
                  lastModified: Date.now(),
                  tags: metadata.tags || [],
                });
              } catch (err) {
                console.error(`Failed to read rule: ${rulePath}`, err);
              }
            }
          }
        }
      } catch (err) {
        console.log('Cursor rules directory not found or empty', err);
      }

      set({ skills, isLoading: false });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load skills';
      set({ error: errorMsg, isLoading: false });
      console.error('Error loading skills:', error);
    }
  },

  getSkill: (id: string) => {
    return get().skills.find(skill => skill.id === id);
  },

  getFilteredSkills: () => {
    const { skills, currentCategory, searchQuery } = get();
    
    let filtered = skills;
    
    // Filter by category
    if (currentCategory !== 'all') {
      filtered = filtered.filter(skill => skill.category === currentCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(skill =>
        skill.name.toLowerCase().includes(query) ||
        skill.description.toLowerCase().includes(query) ||
        skill.content.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  },

  updateSkill: async (id: string, content: string, metadata?: SkillMetadata) => {
    try {
      const skill = get().getSkill(id);
      if (!skill) throw new Error('Skill not found');

      // Parse the content to extract metadata and body
      const { metadata: parsedMetadata, body } = parseSkillFile(content);
      const finalMetadata = metadata || parsedMetadata;
      
      // Reconstruct the file content
      const frontmatter = YAML.stringify(finalMetadata);
      const fileContent = `---\n${frontmatter}---\n${body}`;

      await writeTextFile(skill.path, fileContent);

      // Update the skill in the store
      set({
        skills: get().skills.map(s =>
          s.id === id
            ? { 
                ...s, 
                content: body, 
                metadata: finalMetadata, 
                name: finalMetadata.name || s.name,
                description: finalMetadata.description || s.description,
                tags: finalMetadata.tags || [],
                lastModified: Date.now() 
              }
            : s
        ),
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update skill';
      set({ error: errorMsg });
      throw error;
    }
  },

  createSkill: async (category: string, name: string, content: string, metadata?: SkillMetadata) => {
    try {
      const home = await homeDir();
      const basePath = category === 'claude' ? `${home}/.claude/skills` : `${home}/.cursor/rules`;
      
      const skillPath = category === 'claude'
        ? `${basePath}/${name}/SKILL.md`
        : `${basePath}/${name}.md`;

      const defaultMetadata = metadata || {
        name,
        description: '',
        tags: [],
      };

      const frontmatter = YAML.stringify(defaultMetadata);
      const skillContent = `---\n${frontmatter}---\n${content}`;

      await writeTextFile(skillPath, skillContent);

      // Reload skills
      await get().loadSkills();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to create skill';
      set({ error: errorMsg });
      throw error;
    }
  },

  deleteSkill: async (id: string) => {
    try {
      const skill = get().getSkill(id);
      if (!skill) throw new Error('Skill not found');

      await remove(skill.path);

      set({
        skills: get().skills.filter(s => s.id !== id),
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete skill';
      set({ error: errorMsg });
      throw error;
    }
  },

  setCurrentCategory: (category: string) => {
    set({ currentCategory: category });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },
}));

function parseSkillFile(content: string): { metadata: SkillMetadata; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (match) {
    const [, frontmatterStr, body] = match;
    try {
      const metadata = YAML.parse(frontmatterStr) as SkillMetadata;
      return { metadata, body };
    } catch (err) {
      console.error('Failed to parse frontmatter:', err);
      return { metadata: { name: '', description: '' }, body: content };
    }
  }

  return { metadata: { name: '', description: '' }, body: content };
}
