import { useState } from "react";
import { useDeleteProjectMutation } from "../../api/projectApi";
import type { Project } from "../../types/project";
import { Trash2 } from "lucide-react";
import ConfirmationDialog from "../ConfirmationDialog";

interface ProjectProps {
  project: Project;
  onEdit: (project: Project) => void;
}

const ProjectCard = ({ project, onEdit }: ProjectProps) => {
  const { name, description, project_id } = project;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [deleteProject, { isLoading: isDeleteProjectLoading }] =
    useDeleteProjectMutation();

  const handleDeleteProject = async () => {
    try {
      await deleteProject(project_id).unwrap();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        error.status === 409
      ) {
        setIsDeleteDialogOpen(false);
        alert("Cannot delete this project because it contains tasks.");
        return;
      }

      console.error("Unable to delete the project.", error);
    }
  };

  return (
    <>
      <div
        onDoubleClick={() => onEdit(project)}
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-800">{name}</h3>
          <button
            type="button"
            aria-label={`Delete ${name}`}
            onDoubleClick={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            disabled={isDeleteProjectLoading}
            className="rounded-lg p-2 text-slate-400
             transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={18} className="text-red-500" />
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          {description || "No description"}
        </p>
      </div>

      {isDeleteDialogOpen && (
        <ConfirmationDialog
          title="Delete Project"
          message={`Are you sure you want to delete ${name}?`}
          confirmText="Delete Project"
          isLoading={isDeleteProjectLoading}
          onConfirm={handleDeleteProject}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />
      )}
    </>
  );
};

export default ProjectCard;
