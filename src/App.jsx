import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import ChatPage from "./ChatPage.jsx";
import Navbar from "./Navbar.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

