/**
 * Main Entry Point
 * Initializes the React application with routing and theme provider
 * Renders the App component into the root DOM element
 * 
 * Setup:
 * - BrowserRouter for client-side routing
 * - ThemeProvider for dark/light mode context
 * - Root App component
 */

import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./ThemeContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);

