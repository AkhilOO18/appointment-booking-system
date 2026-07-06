import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="brand">GlowUp Salon</Link>
        <nav>
          <Link to="/services">Services</Link>
          {user && user.role === "user" && <Link to="/my-appointments">My Appointments</Link>}
          {user && user.role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/register">Sign Up</Link>}
          {user && (
            <>
              <span className="role-tag">{user.role}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
