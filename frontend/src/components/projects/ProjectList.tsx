import { useState } from "react";
import { useGetProjectsQuery } from "../../api/projectApi";
import ProjectCard from "./ProjectCard";
import ProjectCreateEditPopup from "./ProjectCreateEditPopup";
import type { Project } from "../../types/project";

const ProjectList = () => {
  const { data, isLoading, isError } = useGetProjectsQuery();

  const [isProjectPopupOpen, setIsCreationPopupOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  if (isLoading) return <p>Loading Projects</p>;
  if (isError) return <p>Failed to load projects</p>;

  if (data?.length === 0) {
    return <p>No projects found. Create your first project.</p>;
  }

  const handlePopup = async () => {
    setIsCreationPopupOpen(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">My Projects</h1>
      <button
        type="button"
        onClick={handlePopup}
        className="shrink-0 rounded-lg bg-violet-600 px-5 py-3 my-2 font-medium text-white transition hover:bg-violet-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        New Project
      </button>

      {isProjectPopupOpen && (
        <ProjectCreateEditPopup onClose={() => setIsCreationPopupOpen(false)} />
      )}

      {editingProject && (
        <ProjectCreateEditPopup
          project={editingProject}
          onClose={() => setEditingProject(null)}
        />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data?.map((project) => (
          <ProjectCard
            key={project.project_id}
            project={project}
            onEdit={setEditingProject}
          />
        ))}
      </div>
    </main>
  );
};

export default ProjectList;
