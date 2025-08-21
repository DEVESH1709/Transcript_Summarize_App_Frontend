import React, { useState } from 'react';

function EmailForm({ summary, summaryId }) {
  const [recipients, setRecipients] = useState('');
  const [status, setStatus] = useState('');

  const sendEmail = async () => {
    setStatus('Sending...');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary, recipients, summaryId })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setStatus('Email sent!');
    } catch (err) {
      console.error(err);
      setStatus('Error sending email');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-semibold">Share via Email (comma-separated):</label>
      <input
        type="text"
        value={recipients}
        onChange={(e) => setRecipients(e.target.value)}
        className="mt-1 w-full border rounded p-2"
        placeholder="example1@domain.com, example2@domain.com"
      />
      <button
        onClick={sendEmail}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Send Email
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}

export default EmailForm;
