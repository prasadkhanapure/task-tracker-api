import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import { useGetProjectStatsQuery } from "../../api/projectApi";
import ProjectTasksChart from "./charts/ProjectTasksChart";
import TaskCompletionChart from "./charts/TaskCompletionChart";
import DashboardCard from "./DashboardCard";

const Dashboard = () => {
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useGetDashboardStatsQuery();

  const {
    data: projectstatsData,
    isLoading: isProjectStatsLoading,
    isError: isProjectStatsError,
  } = useGetProjectStatsQuery();

  if (isStatsLoading || isProjectStatsLoading)
    return <p>Loading Project Stats</p>;
  if (isStatsError || isProjectStatsError)
    return <p>Failed to load projects stats</p>;

  if (!statsData || !projectstatsData) {
    return <p>Dashboard statistics unavailable.</p>;
  }

  return (
    <div>
      <section>
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <DashboardCard
            label="Total Projects"
            value={statsData.total_projects}
          />
          <DashboardCard label="Total Tasks" value={statsData.total_tasks} />
          <DashboardCard
            label="Completed Tasks"
            value={statsData.completed_tasks}
          />
          <DashboardCard
            label="Pending Tasks"
            value={statsData.pending_tasks}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <TaskCompletionChart
              completed={statsData.completed_tasks}
              pending={statsData.pending_tasks}
            />
          </div>

          <div className="lg:col-span-2">
            <ProjectTasksChart projects={projectstatsData} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
