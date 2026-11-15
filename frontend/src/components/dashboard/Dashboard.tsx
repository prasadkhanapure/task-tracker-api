import { useGetDashboardStatsQuery } from "../../api/dashboardApi";
import DashboardCard from "./DashboardCard";

const Dashboard = () => {
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useGetDashboardStatsQuery();

  if (isStatsLoading) return <p>Loading Project Stats</p>;
  if (isStatsError) return <p>Failed to load projects stats</p>;

  if (!statsData) {
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
            label="Total Projects"
            value={statsData.completed_tasks}
          />
          <DashboardCard
            label="Total Projects"
            value={statsData.pending_tasks}
          />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
