// import { useState } from 'react';
// import FileUpload from './components/FileUpload';
// import PromptInput from './components/PromptInput';
// import SummaryEditor from './components/SummaryEditor';
// import EmailForm from './components/EmailForm';
// import { Loader2 } from "lucide-react"; // optional spinner icon

// function App() {
//   const [transcript, setTranscript] = useState('');
//   const [prompt, setPrompt] = useState('');
//   const [summary, setSummary] = useState('');
//   const [loading, setLoading] = useState(false);

//   const generateSummary = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/summarize`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//         body: JSON.stringify({ transcript, prompt })
//       });
//       const data = await response.json();
//       setSummary(data.summary);
//     } catch (err) {
//       console.error(err);
//       alert('Error generating summary');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-start py-10 px-4">
//       <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
//         Transcript <span className="text-blue-600">Summarizer</span>
//       </h1>

//       <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-6">
//         <FileUpload onFileLoaded={text => setTranscript(text)} />

//         <PromptInput prompt={prompt} setPrompt={setPrompt} />

//         <button
//           onClick={generateSummary}
//           disabled={loading}
//           className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition 
//             ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} 
//             text-white shadow-md`}
//         >
//           {loading ? (
//             <>
//               <Loader2 className="w-5 h-5 animate-spin" />
//               Generating...
//             </>
//           ) : (
//             "✨ Generate Summary"
//           )}
//         </button>

//         {summary && (
//           <div className="space-y-6">
//             <SummaryEditor summary={summary} setSummary={setSummary} />
//             <EmailForm summary={summary} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import PromptInput from "./components/PromptInput";
import SummaryEditor from "./components/SummaryEditor";
import EmailForm from "./components/EmailForm";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

function Summarizer() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  // Removed unused sidebarOpen state
  const [showDashboard, setShowDashboard] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const navigate = useNavigate();

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
    setSidebarLoading(false);
  };
  useEffect(() => {
    fetchSummaries();
  }, []);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transcript, prompt }),
      });
      const data = await response.json();
      setSummary(data.summary);
      // Refetch summaries after generating a new one
      setSidebarLoading(true);
      await fetchSummaries();
    } catch (err) {
      console.error(err);
      alert("Error generating summary");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <div className={`h-full bg-white shadow-lg p-4 w-80 flex flex-col`}>
        <div className="overflow-y-auto">
          <h2 className="text-lg font-bold mb-2">History</h2>
          <button
            onClick={e => {
              e.preventDefault();
              setTranscript("");
              setPrompt("");
              setSummary("");
              setShowDashboard(false);
            }}
            className="mb-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            New Chat
          </button>
          {sidebarLoading ? (
            <p>Loading...</p>
          ) : summaries.length === 0 ? (
            <p className="text-gray-500">No summaries yet.</p>
          ) : (
            <ul className="space-y-2">
              {summaries.map((s) => (
                <li key={s._id} className="border-b pb-2">
                  <div className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleString()}</div>
                  <div className="font-medium">{s.prompt.slice(0, 30)}...</div>
                  <button
                    onClick={e => {e.preventDefault(); alert(s.summary);}}
                    className="mt-1 text-blue-500 hover:underline text-xs"
                  >View</button>
                </li>
              ))}
            </ul>
          )}
          <button
            onClick={e => {e.preventDefault(); setShowDashboard(true);}}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Expand
          </button>
        </div>
        <button
          onClick={e => {e.preventDefault(); handleLogout();}}
          className="mt-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start py-10 px-4">
        {showDashboard ? (
          <Dashboard 
            onClose={() => setShowDashboard(false)}
            onNewChat={() => {
              setShowDashboard(false);
              setTranscript("");
              setPrompt("");
              setSummary("");
            }}
          />
        ) : (
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-6">
            <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
              Transcript <span className="text-blue-600">Summarizer</span>
            </h1>
            <FileUpload onFileLoaded={(text) => setTranscript(text)} />
            <PromptInput prompt={prompt} setPrompt={setPrompt} />

            <button
              onClick={generateSummary}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition 
                ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} 
                text-white shadow-md`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                "\u2728 Generate Summary"
              )}
            </button>

            {summary && (
              <div className="space-y-6">
                <SummaryEditor summary={summary} setSummary={setSummary} />
                <EmailForm summary={summary} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected route */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Summarizer />
            </PrivateRoute>
          }
        />
  {/* /dashboard route removed for cleanup */}
      </Routes>
    </BrowserRouter>
  );
}
