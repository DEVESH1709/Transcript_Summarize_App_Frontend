import React, { useState } from "react";
import { Share2 } from "lucide-react";
import { BsWhatsapp, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
const platforms = [
  {
    icon: <BsWhatsapp fontSize={20} />,
    url: (text) => `https://wa.me/?text=${encodeURIComponent(text)}`,
    color: "#25D366",
  },
  {
    icon: <BsInstagram fontSize={20} />,
    url: () => `https://www.instagram.com/`, // Instagram does not support direct sharing via URL
    color: "#E1306C",
  },
  {
    icon: <BsLinkedin fontSize={20} />,
    url: (text) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(text)}`,
    color: "#0077B5",
  },
  {
    icon: <BsTwitter fontSize={20} />,
    url: (text) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
    color: "#1DA1F2",
  },
];

export default function ShareButton({ summary }) {
  const [open, setOpen] = useState(false);
  const shareText = summary || "Check out this summary!";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold shadow"
        title="Share"
      >
        <Share2 size={18} /> Share
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-20 bg-white border rounded shadow-lg z-50 flex flex-col">
          {platforms.map((p) => (
            <a
              key={p.name}
              href={p.url(shareText)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              style={{ color: p.color }}
            >
              {p.icon}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
