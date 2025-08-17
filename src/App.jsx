import { useState } from 'react';
import FileUpload from './components/FileUpload';
import PromptInput from './components/PromptInput';
import SummaryEditor from './components/SummaryEditor';
import EmailForm from './components/EmailForm';
import { Loader2 } from "lucide-react"; // optional spinner icon

function App() {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, prompt })
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      alert('Error generating summary');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-start py-10 px-4">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
        Transcript <span className="text-blue-600">Summarizer</span>
      </h1>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <FileUpload onFileLoaded={text => setTranscript(text)} />

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

export default App;
