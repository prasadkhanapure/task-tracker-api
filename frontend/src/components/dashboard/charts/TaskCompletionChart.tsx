import { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface TaskCompletionChartProps {
  completed: number;
  pending: number;
}
const TaskCompletionChart = ({
  completed,
  pending,
}: TaskCompletionChartProps) => {
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
        trigger: "item",
      },
      legend: {
        bottom: 0,
      },
      series: {
        name: "Task Status",
        type: "pie",
        radius: ["50%", "70%"],
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        data: [
          { name: "Completed", value: completed },
          { name: "Pending", value: pending },
        ],
      },
    });
  }, [completed, pending]);

  return <div ref={chartRef} className="h-80 w-full" />;
};

export default TaskCompletionChart;
