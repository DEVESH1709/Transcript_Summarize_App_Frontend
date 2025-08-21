import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (!stats) return <p>No analytics data.</p>;

  const barData = {
    labels: stats.topPrompts.map(p => p._id),
    datasets: [
      {
        label: "Prompt Usage",
        data: stats.topPrompts.map(p => p.count),
        backgroundColor: "#3b82f6"
      }
    ]
  };

  const pieData = {
    labels: ["Summaries", "Emails Sent"],
    datasets: [
      {
        data: [stats.totalSummaries, stats.emailSendCount],
        backgroundColor: ["#6366f1", "#10b981"]
      }
    ]
  };

  return (
    <div className="my-8 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">🔹 Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2">Most Common Prompts</h3>
          <Bar data={barData} />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Summary & Email Counts</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
}
