import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-title-link">
          <h1 className="navbar-title">Steve Irwin Chatbot</h1>
        </Link>
      </div>
      <div className="navbar-center">
        <Link to="/chat" className="nav-link">
          Chat
        </Link>
        <Link to="/about" className="nav-link">
          About Me
        </Link>
        <Link to="/conservation" className="nav-link">
          Conservation
        </Link>
      </div>
      <div className="navbar-right">
        <button className="settings-btn" aria-label="Settings">
          <img src="/settings.jpg" alt="Settings" className="settings-icon" />
        </button>
      </div>
    </nav>
  );
}
