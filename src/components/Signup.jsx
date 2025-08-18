import {useState} from "react";

export default function Signup(){
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword]= useState("");
    const [message,setMessage] = useState("");
    
   const handleSignup = async(e)=>{
    e.preventDefault();
    setMessage("Creating Account");

    try{
        const response= await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`,{
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({name,email,password}),
        });
        const data =  await response.json();

        if(response.ok){
            setMessage("Account created successfully");
            setName("");setEmail("");setPassword("");
        }else{
            setMessage(data.error || "Failed to create account");
        }
    }catch(err){
        setMessage("Error creating account");
    }
   }
    return(


          <div className="max-w-md mx-auto p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>
      <form onSubmit={handleSignup} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
      {message && <p className="mt-3 text-sm">{message}</p>}
    </div>
    );
    
}