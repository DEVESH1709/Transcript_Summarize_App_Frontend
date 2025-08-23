import { useEffect, useState } from "react";
import Analytics from "./Analytics";
import { Eye } from "lucide-react";

export default function Dashboard({ onClose, onNewChat, setTranscript, setPrompt, setSummary, setShowDashboard, setSidebarOpen }) {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/summarize`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setSummaries(data);
      } catch (err) {
        console.error("Error fetching summaries", err);
      }
      setLoading(false);
    };
    fetchSummaries();
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-start p-8 overflow-auto">
      <div className="flex w-full justify-end gap-2 mb-4">
        <button
          onClick={onNewChat}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          New Chat
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
      <h2 className="text-3xl font-bold mb-6 text-center">📜 Your Summaries</h2>
      <Analytics />
      {loading ? (
        <p>Loading...</p>
      ) : summaries.length === 0 ? (
        <p className="text-gray-500">No summaries yet.</p>
      ) : (
        <table className="w-full max-w-4xl border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Date</th>
              <th className="border p-2">Prompt</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((s) => (
              <tr key={s._id} className="border-b hover:bg-gray-50">
                <td className="border p-2">
                  {new Date(s.createdAt).toLocaleString()}
                </td>
                <td className="border p-2">{s.prompt.slice(0, 40)}...</td>
                <td className="border p-2">
                  <button
                    onClick={e => {
                      e.preventDefault();
                      setTranscript(s.transcript || "");
                      setPrompt(s.prompt || "");
                      setSummary(s.summary || "");
                      setShowDashboard(false);
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    className="bg-blue-500 hover:bg-blue-100 p-1 rounded"
                    title="View"
                  >
                    <Eye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
