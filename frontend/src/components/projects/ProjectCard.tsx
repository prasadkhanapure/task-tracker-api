import type { Project } from "../../types/project";

interface ProjectProps {
  project: Project;
  onEdit: (project: Project) => void;
}

const ProjectCard = ({ project, onEdit }: ProjectProps) => {
  const { name, description } = project;
  return (
    <div onDoubleClick={() => onEdit(project)}
    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <h3 className="text-lg font-semibold text-slate-800">{name}</h3>
      <p className="mt-2 text-sm text-slate-500">
        {description || "No description"}
      </p>
    </div>
  );
};

export default ProjectCard;
