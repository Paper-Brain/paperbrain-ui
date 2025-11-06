import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const BurnChartWidget = ({
  labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
  dataPoints = [20, 18, 15, 12, 8],
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Remaining Work",
        data: dataPoints,
        borderColor: "#A78BFA",
        tension: 0.4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: { family: "system-ui", weight: "300" },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#fff", font: { weight: "300" } },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#fff", font: { weight: "300" } },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default BurnChartWidget;
