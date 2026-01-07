import React from 'react';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
}

interface ProjectCardProps {
  project: Project;
  onPreview: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPreview }) => {
  return (
    <div className="group relative bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative w-full h-56 overflow-hidden bg-muted">
        <Image
          src={project.image}
          alt={project.title}
          width={500}
          height={200}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
          <button
            onClick={() => onPreview(project)}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2 hover:bg-primary/90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Preview
          </button>
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
          {project.category}
        </p>
        <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>
      </div>
    </div>
  );
};