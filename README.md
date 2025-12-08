# Steve Irwin - Historical Figure Chatbot

A web-based conversational chatbot that simulates conversations with Steve Irwin (The Crocodile Hunter). Built as part of a Software Engineering university assignment.

## Project Overview

This application allows users to interact with an AI-powered chatbot that responds in the style of Steve Irwin. The chatbot features a themed user interface with educational content about Steve Irwin's life and conservation work.

## Features

- Interactive chat interface with Steve Irwin-styled responses
- Responsive design for desktop, tablet, and mobile devices
- About Me page with biographical information
- Conservation page with wildlife information
- Dark/Light theme toggle
- Accessible user interface

## Technology Stack

**Frontend:**

- React 19.2.0
- React Router DOM 7.9.5
- Vite 7.2.2
- CSS3 with Akshar font from Google Fonts

**Backend (In Progress):**

- Express.js
- JSON-based scripting engine

## Getting Started

**Prerequisites:**

- Node.js (v16 or higher)
- npm package manager

**Installation:**

1. Clone the repository

   ```bash
   git clone https://github.com/HistoricFigureChatbot/steve-irwin-chatbot.git
   cd steve-irwin-chatbot
   ```

2. Install dependencies and start the development server

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## Project Structure

```
steve-irwin-chatbot/
├── frontend/
│   ├── public/              # Images and static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── App.jsx          # Main app component
│   │   ├── Home.jsx         # Landing page
│   │   ├── ChatPage.jsx     # Chat interface
│   │   ├── AboutMe.jsx      # About page
│   │   ├── Conservation.jsx # Conservation page
│   │   └── Navbar.jsx       # Navigation component
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Backend (In Progress)
└── README.md
```

## Available Scripts

**Frontend:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Automatically fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted

**Backend:**

- `npm start` - Start the backend server
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Automatically fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted

## Code Quality

This project uses **ESLint** and **Prettier** to maintain high code quality and consistent formatting:

- **ESLint**: Catches errors and enforces coding standards
- **Prettier**: Automatically formats code for consistency
- **Auto-formatting**: Code is formatted on save in VS Code (requires Prettier extension)

Run `npm run format` and `npm run lint:fix` before committing to ensure code quality!

## Assignment Requirements

- React front-end application
- Express backend (In Progress)
- JSON-based scripting engine for conversation logic
- Accessible, responsive user interface
- Version control using Git/GitHub
- Documentation included

## License

This project is created for educational purposes as part of a university assignment.
