import React, { useState } from "react";
import { Share2 } from "lucide-react";
import { BsWhatsapp, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
const platforms = [
	{
		name: "WhatsApp",
		icon: <BsWhatsapp fontSize={20} />,
		url: (link) => `https://wa.me/?text=${encodeURIComponent(link)}`,
		color: "#25D366",
	},
	{
		name: "Instagram",
		icon: <BsInstagram fontSize={20} />,
		url: () => `https://www.instagram.com/`, // Instagram does not support direct sharing via URL
		color: "#E1306C",
	},
	{
		name: "LinkedIn",
		icon: <BsLinkedin fontSize={20} />,
		url: (link) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
		color: "#0077B5",
	},
	{
		name: "Twitter",
		icon: <BsTwitter fontSize={20} />,
		url: (link) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`,
		color: "#1DA1F2",
	},
];

export default function ShareButton({ summary }) {
	const [open, setOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const shareId = summary?.shareId;
	const publicLink = shareId ? `${window.location.origin}/share/${shareId}` : "";

	// Close dropdown on outside click
	React.useEffect(() => {
		if (!open) return;
		function handleClick(e) {
			if (!e.target.closest('.share-dropdown-parent')) setOpen(false);
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, [open]);

	return (
		<div className="relative flex gap-2 items-center share-dropdown-parent">
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold shadow transition duration-150"
				title="Share options"
				aria-label="Share options"
			>
				<Share2 size={18} /> <span className="hidden sm:inline">Share</span>
			</button>
			{/* Remove Copy Link from outside, move inside dropdown below */}
			{copied && (
				<span className="absolute top-full left-0 mt-1 px-2 py-1 bg-green-100 text-green-700 rounded shadow text-sm animate-fade">Link copied!</span>
			)}
			{open && (
				<div className="absolute left-0 top-full mt-2 min-w-[200px] max-w-[90vw] bg-white border rounded-xl shadow-2xl z-50 flex flex-col animate-slide-down p-0" style={{boxShadow:'0 8px 32px rgba(0,0,0,0.12)'}}>
					{/* Caret arrow */}
					<div className="absolute -top-2 left-6 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45 z-10"></div>
					<div className="px-4 py-2 text-xs text-gray-500 border-b">Share this summary:</div>
					{shareId && (
						<button
							type="button"
							onClick={() => {
								navigator.clipboard.writeText(publicLink);
								setCopied(true);
								setTimeout(() => setCopied(false), 1500);
							}}
							className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold mb-1 transition duration-150"
							title="Copy public link"
							style={{margin:'4px 0'}}
						>
							<span className="material-icons" style={{fontSize:18}}>link</span>
							<span>Copy Link</span>
						</button>
					)}
					{copied && (
						<span className="px-4 py-2 text-green-700 bg-green-100 rounded shadow text-sm mb-2 animate-fade">Link copied!</span>
					)}
					{platforms.map((p) => (
						<a
							key={p.name}
							href={p.url(publicLink)}
							target="_blank"
							rel="noopener noreferrer"
							className="px-4 py-3 hover:bg-gray-100 flex items-center gap-3 font-semibold transition duration-100"
							style={{ color: p.color }}
						>
							<span>{p.icon}</span>
							<span>{p.name}</span>
						</a>
					))}
				</div>
			)}
			{/* Simple CSS for fade and slide-down animation */}
			<style>{`
        @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade { animation: fade 0.5s; }
        @keyframes slide-down { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slide-down { animation: slide-down 0.2s; }
        .share-dropdown-parent { position: relative; }
      `}</style>
		</div>
	);
}

