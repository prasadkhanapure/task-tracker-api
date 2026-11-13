import { useGetProjectsQuery } from "../../api/projectApi";
import ProjectCard from "./ProjectCard";

const ProjectList = () => {
  const { data, isLoading, isError } = useGetProjectsQuery();

  if (isLoading) return <p>Loading Projects</p>;
  if (isError) return <p>Failed to load projects</p>;

  if (data?.length === 0) {
    return <p>No projects found. Create your first project.</p>;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data?.map((project) => (
          <ProjectCard key={project.project_id} project={project} />
        ))}
      </div>
    </main>
  );
};

export default ProjectList;
