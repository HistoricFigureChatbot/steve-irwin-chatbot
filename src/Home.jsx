import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Chat App</h1>
      <Link to="/chat">Go to Chat</Link>
    </div>
  );
}
