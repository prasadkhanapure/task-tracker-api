import { useState } from "react";
import TaskList from "./TaskList";
import ProjectList from "./projects/ProjectList";

type ActiveView = "tasks" | "projects";

const TaskTrackerPage = () => {
  const [activeView, setActiveView] = useState<ActiveView>("tasks");

  const handleTaskView = () => {
    setActiveView("tasks");
  };

  const handleProjectView = () => {
    setActiveView("projects");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 pt-5">
        <h1 className="mb-4 text-xl font-bold text-slate-900">Task Tracker</h1>
        <nav aria-label="Task tracker views" className="flex gap-6">
          <button
            type="button"
            onClick={handleTaskView}
            aria-pressed={activeView === "tasks"}
            className={`rounded-lg px-5 py-2 font-medium transition ${
              activeView === "tasks"
                ? "bg-violet-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Tasks
          </button>
          <button
            type="button"
            onClick={handleProjectView}
            aria-pressed={activeView === "projects"}
            className={`rounded-lg px-5 py-2 font-medium transition ${
              activeView === "projects"
                ? "bg-violet-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Projects
          </button>
        </nav>
        {activeView === "tasks" ? <TaskList /> : <ProjectList />}
      </div>
    </header>
  );
};

export default TaskTrackerPage;
