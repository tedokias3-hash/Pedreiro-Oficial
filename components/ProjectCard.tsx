
import React from 'react';
import { Project } from '../types';
import { BeforeAfterSlider } from './BeforeAfterSlider';

interface ProjectCardProps {
  project: Project;
  isAdmin?: boolean;
  onEdit?: (p: Project) => void;
  onDelete?: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-white/5 shadow-2xl transition-transform duration-300 hover:scale-[1.02]">
      <BeforeAfterSlider before={project.beforeImage} after={project.afterImage} />
      <div className="p-5 flex justify-between items-start">
        <div>
          <span className="text-[#FACC15] text-[10px] uppercase font-black tracking-widest mb-1 block">
            {project.category}
          </span>
          <h3 className="text-xl font-bold text-white line-clamp-1">{project.title}</h3>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit?.(project)}
              className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </button>
            <button 
              onClick={() => onDelete?.(project.id)}
              className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
