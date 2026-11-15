import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import type { ProjectStats } from "../../../types/project";

interface ProjectTasksChartProps {
  projects: ProjectStats[];
}

const ProjectTasksChart = ({ projects }: ProjectTasksChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartInstanceRef.current;
    if (!chart) return;

    chart.setOption({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: { bottom: 0 },
      xAxis: {
        type: "value",
      },
      yAxis: {
        type: "category",
        
        data: projects.map((project) => project.name),
      },
      grid: {
        left: 20,
        right: 20,
        bottom: 50,
        containLabel: true,
      },
      series: [
        {
          name: "Completed",
          type: "bar",
          stack: "tasks",
          data: projects.map((project) => project.completed_tasks),
        },
        {
          name: "Pending",
          type: "bar",
          stack: "tasks",
          data: projects.map((project) => project.pending_tasks),
        },
      ],
    });
  }, [projects]);

  return <div ref={chartRef} className="h-80 w-full" />;
};

export default ProjectTasksChart;
