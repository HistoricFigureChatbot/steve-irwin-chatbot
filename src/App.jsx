import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import ChatPage from "./ChatPage.jsx";
import Navbar from "./Navbar.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </>
  );
}

