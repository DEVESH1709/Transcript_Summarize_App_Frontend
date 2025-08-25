import React,{useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import ShareButton from "./ShareButton"; // Adjust the import path as necessary

export default function ShareSummary(){
    const {shareId} = useParams();
    const [summary,setSummary] = useState("");
    const [prompt,setPrompt] = useState("");
    const [comments,setComments] = useState([]);
    const [commentText,setCommentsText]  = useState("");
    const [name,setName] = useState("");
    const [loading,setLoading] = useState(true);


      useEffect(()=>{
        fetch(`${import.meta.env.VITE_API_URL}/api/share/${shareId}`)
        .then(res=> res.json())
        .then(data=>{
                 setSummary(data.summary);
                 setPrompt(data.prompt);
                 setComments(data.comments || []);
                 setLoading(false);
        })
      },[shareId])

   
 const handleComment = async (e)=>{
    e.preventDefault();
    if(!commentText.trim()) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/share/${shareId}/comment`,{
    method :"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        text:commentText,
        name
    })
    });

    const data = await res.json();
    setComments(data.comments || []);
    setCommentsText("");
};





    return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center mb-2">Shared Summary</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
             <>
            <div className="mb-4">
              <div className="font-semibold text-gray-700 mb-1">Prompt:</div>
              <div className="bg-gray-100 rounded p-2">{prompt}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-1">Summary:</div>
              <div className="bg-gray-100 rounded p-2">{summary}</div>
            </div>
            <div className="mt-6">
              <h3 className="font-bold mb-2">Comments</h3>
              <form onSubmit={handleComment} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                   value={name}
                  onChange={e => setName(e.target.value)}
                  className="border rounded px-2 py-1 flex-1"
                />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  className="border rounded px-2 py-1 flex-2"
                  required
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Send</button>
              </form>
              <div className="space-y-2">
                {comments.length === 0 ? (
 <p className="text-gray-500">No comments yet.</p>
                ) : (
                  comments.map((c, idx) => (
                    <div key={idx} className="bg-gray-50 border rounded p-2">
                      <span className="font-semibold">{c.name || "Guest"}:</span> {c.text}
                      <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <ShareButton summary={summary && summary.length > 0 ? summary[0] : {}} />
    </div>
  );

}