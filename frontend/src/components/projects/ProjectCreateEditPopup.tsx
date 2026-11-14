import { useEffect, useRef, useState } from "react";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "../../api/projectApi";
import type { Project } from "../../types/project";

interface ProjectCreationPopupProps {
  onClose: () => void;
  project?: Project;
}
const ProjectCreateEditPopup = ({
  onClose,
  project,
}: ProjectCreationPopupProps) => {
  const [createProject, { isLoading: isCreateProjectLoading }] =
    useCreateProjectMutation();

  const [updateProject, { isLoading: isEditProjectLoading }] =
    useUpdateProjectMutation();

  const [name, setName] = useState<string>(project?.name ?? "");
  const [description, setDescription] = useState<string>(
    project?.description ?? "",
  );
  const isEditMode = Boolean(project);
  const isSubmitting = isCreateProjectLoading || isEditProjectLoading;

  const submitLabel = isSubmitting
    ? isEditMode
      ? "Updating..."
      : "Creating..."
    : isEditMode
      ? "Update Project"
      : "Create Project";

  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();

    return () => dialog?.close();
  }, []);

  const handleProjectCreateEditForm = async () => {
    if (!name.trim() || isSubmitting) return;

    try {
      if (project) {
        await updateProject({
          project_id: project.project_id,
          name: name.trim(),
          description: description.trim(),
        }).unwrap();
      } else {
        await createProject({
          name: name.trim(),
          description: description.trim(),
        }).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("Unable to save the project.", error);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      aria-labelledby="create-project-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg
             max-h-[calc(100vh-2rem)] overflow-y-auto
             rounded-2xl border border-slate-200
             bg-white p-6 shadow-2xl
             backdrop:bg-slate-950/50 sm:p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {isEditMode ? "Update Project" : "Create New Project"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Organize your tasks into a project.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label
            htmlFor="project-name"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g., Office Project"
            className="w-full rounded-lg border border-slate-300
                 px-4 py-3 text-sm outline-none transition
                 focus:border-violet-500 focus:ring-2
                 focus:ring-violet-100"
          />
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Description <span className="ml-1 text-slate-400">(Optional)</span>
          </label>
          <textarea
            id="project-description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe your project..."
            className="w-full resize-none rounded-lg border
                 border-slate-300 px-4 py-3 text-sm
                 outline-none transition focus:border-violet-500
                 focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300
               px-5 py-2.5 text-sm font-medium
               text-slate-700 transition hover:bg-slate-100
               disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleProjectCreateEditForm}
          disabled={!name.trim() || isSubmitting}
          className="rounded-lg bg-violet-600 px-5 py-2.5
               text-sm font-semibold text-white transition
               hover:bg-violet-700
               disabled:cursor-not-allowed
               disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </dialog>
  );
};

export default ProjectCreateEditPopup;
