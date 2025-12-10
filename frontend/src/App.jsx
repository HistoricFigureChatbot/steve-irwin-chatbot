/**
 * App Component
 * Root application component that sets up routing for the entire application
 * Contains navigation bar and route definitions for all pages
 * 
 * Routes:
 * - / : Home page with hero section
 * - /chat : Main chatbot interface
 * - /about : Information about Steve Irwin
 */

import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import ChatPage from "./ChatPage.jsx";
import AboutMe from "./AboutMe.jsx";
import Navbar from "./Navbar.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/about" element={<AboutMe />} />
      </Routes>
    </div>
  );
}

