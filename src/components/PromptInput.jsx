import React from 'react';

function PromptInput({ prompt, setPrompt }) {
  return (
    <div>
      <label className="block font-semibold">Custom Prompt / Instruction:</label>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="mt-1 w-full border rounded p-2"
        placeholder="e.g. Summarize in bullet points for executives"
      />
    </div>
  );
}

export default PromptInput;
