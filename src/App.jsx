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

import { Menu, X } from "lucide-react";

function Summarizer() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768); // open by default on desktop
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
      if (response.status === 401) {
        setSummaries([]);
        setSidebarLoading(false);
        alert("Session expired or unauthorized. Please login again.");
        navigate("/login");
        return;
      }
      const data = await response.json();
      setSummaries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching summaries", err);
      setSummaries([]);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col md:flex-row">
      {/* Sidebar open/close icon for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white rounded-full shadow p-2 transition-all duration-300"
        onClick={() => setSidebarOpen(true)}
        style={{ display: sidebarOpen ? 'none' : 'block' }}
        aria-label="Open sidebar"
      >
        <Menu size={28} />
      </button>
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-72 md:w-80 bg-white shadow-lg p-4 flex flex-row md:flex-col gap-4 md:gap-0 z-40 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ minHeight: '100vh' }}
      >
        {/* Close icon for mobile */}
        <button
          className="md:hidden absolute top-4 right-4 bg-white rounded-full shadow p-2"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={28} />
        </button>
        <div className="flex-1 overflow-y-auto pt-10 md:pt-0">
          <h2 className="text-lg font-bold mb-2">History</h2>
          <button
            onClick={e => {
              e.preventDefault();
              setTranscript("");
              setPrompt("");
              setSummary("");
              setShowDashboard(false);
              if (window.innerWidth < 768) setSidebarOpen(false);
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
            <>
              {/* Pinned summaries */}
              <ul className="space-y-2">
                {summaries.filter(s => s.pinned).map((s) => (
                  <li key={s._id} className="border-b pb-2 bg-yellow-100">
                    <div className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleString()}</div>
                    <div className="font-medium">{s.prompt.slice(0, 30)}...</div>
                    <button
                      onClick={e => {e.preventDefault(); alert(s.summary);}}
                      className="mt-1 text-blue-500 hover:underline text-xs"
                    >View</button>
                    <button
                      onClick={async e => {
                        e.preventDefault();
                        const token = localStorage.getItem("token");
                        await fetch(`${import.meta.env.VITE_API_URL}/api/summarize/pin/${s._id}`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ pin: false })
                        });
                        setSidebarLoading(true);
                        await fetchSummaries();
                      }}
                      className="ml-2 text-yellow-700 hover:underline text-xs"
                    >Unpin</button>
                  </li>
                ))}
              </ul>
              {/* Unpinned summaries */}
              <ul className="space-y-2">
                {summaries.filter(s => !s.pinned).map((s) => (
                  <li key={s._id} className="border-b pb-2">
                    <div className="text-xs text-gray-500">{new Date(s.createdAt).toLocaleString()}</div>
                    <div className="font-medium">{s.prompt.slice(0, 30)}...</div>
                    <button
                      onClick={e => {e.preventDefault(); alert(s.summary);}}
                      className="mt-1 text-blue-500 hover:underline text-xs"
                    >View</button>
                    <button
                      onClick={async e => {
                        e.preventDefault();
                        const token = localStorage.getItem("token");
                        await fetch(`${import.meta.env.VITE_API_URL}/api/summarize/pin/${s._id}`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ pin: true })
                        });
                        setSidebarLoading(true);
                        await fetchSummaries();
                      }}
                      className="ml-2 text-yellow-700 hover:underline text-xs"
                    >Pin</button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button
            onClick={e => {e.preventDefault(); setShowDashboard(true); if (window.innerWidth < 768) setSidebarOpen(false);}}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Expand
          </button>
        </div>
        <button
          onClick={e => {e.preventDefault(); handleLogout();}}
          className="self-end md:self-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start py-6 px-2 sm:px-4">
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
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 space-y-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-4 sm:mb-6">
              Transcript <span className="text-blue-600">Summarizer</span>
            </h1>
            <FileUpload onFileLoaded={(text) => setTranscript(text)} />
            <PromptInput prompt={prompt} setPrompt={setPrompt} />

            <button
              onClick={generateSummary}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl font-semibold transition 
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
                <EmailForm 
                  summary={summary} 
                  summaryId={
                    // Find the latest summary for the current user
                    summaries && summaries.length > 0
                      ? summaries[0]._id
                      : null
                  }
                />
              </div>
            )}
          </div>
        )}
      </main>
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
