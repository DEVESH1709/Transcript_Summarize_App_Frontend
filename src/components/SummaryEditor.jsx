import React from 'react';
function SummaryEditor({ summary, setSummary }) {
  return (
    <div>
      <label className="block font-semibold">Generated Summary (edit as needed):</label>
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={10}
        className="mt-1 w-full border rounded p-2"
      />
    </div>
  );
}

export default SummaryEditor;
