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
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import PromptInput from "./components/PromptInput";
import SummaryEditor from "./components/SummaryEditor";
import EmailForm from "./components/EmailForm";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute";
import { Loader2 } from "lucide-react";

function Summarizer() {
  const [transcript, setTranscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      console.error(err);
      alert("Error generating summary");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full flex justify-between items-center mb-6 max-w-3xl">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center">
          Transcript <span className="text-blue-600">Summarizer</span>
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-6">
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
            "✨ Generate Summary"
          )}
        </button>

        {summary && (
          <div className="space-y-6">
            <SummaryEditor summary={summary} setSummary={setSummary} />
            <EmailForm summary={summary} />
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
      </Routes>
    </BrowserRouter>
  );
}
