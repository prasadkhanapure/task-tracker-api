interface DashboardCardProps {
  label: string;
  value: number;
}

const DashboardCard = ({ label, value }: DashboardCardProps) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
};

export default DashboardCard;
