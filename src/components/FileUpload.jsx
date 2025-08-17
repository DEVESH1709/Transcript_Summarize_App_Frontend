import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';

function FileUpload({ onFileLoaded }) {
  const inputRef = useRef();
  const [fileName, setFileName] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      onFileLoaded(evt.target.result);
    };
    reader.readAsText(file);
  };

  const handleRemove = () => {
    setFileName(null);
    onFileLoaded('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="mb-2">
      <label className="block font-semibold mb-1">Upload Transcript (TXT):</label>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="border rounded px-2 py-1"
        />
        {fileName && (
          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
            {fileName}
            <button
              type="button"
              onClick={handleRemove}
              className="ml-1 text-gray-500 hover:text-red-500"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
