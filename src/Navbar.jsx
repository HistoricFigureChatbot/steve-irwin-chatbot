import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ marginBottom: "1rem" }}>
      <Link to="/">Home</Link> | <Link to="/chat">Chat</Link>
    </nav>
  );
}
