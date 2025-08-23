import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Brand / Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          ✨ Summarizer
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
