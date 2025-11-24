import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// Load responses from the JSON file
const responses = JSON.parse(fs.readFileSync("responses.json", "utf-8"));


function getResponse(userMessage) {
  const message = userMessage.toLowerCase().trim();

  // Greetings
  if (message.match(/\b(hello|hi|hey|g'day|howdy)\b/i)) {
    return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
  }

  // Farewells
  if (message.match(/\b(bye|goodbye|see you|farewell)\b/i)) {
    return responses.farewells[Math.floor(Math.random() * responses.farewells.length)];
  }

  // Family - Bindi (specific)
  if (message.match(/\bbindi\b/i)) {
    return responses.family.bindi[Math.floor(Math.random() * responses.family.bindi.length)];
  }

  // Family - Robert (specific)
  if (message.match(/\brobert\b/i)) {
    return responses.family.robert[Math.floor(Math.random() * responses.family.robert.length)];
  }

  // Family - Kids (both)
  if (message.match(/\b(kids|children)\b/i)) {
    return responses.family.kids[Math.floor(Math.random() * responses.family.kids.length)];
  }

  // Family - Terri
  if (message.match(/\b(terri|wife)\b/i)) {
    return responses.family.terri[Math.floor(Math.random() * responses.family.terri.length)];
  }

  // Family - Parents
  if (message.match(/\b(parents|mum|dad|mother|father)\b/i)) {
    return responses.family.parents[Math.floor(Math.random() * responses.family.parents.length)];
  }

  // Animals - Crocodiles
  if (message.match(/\b(crocodile|croc|alligator)\b/i)) {
    return responses.animals.crocodiles[Math.floor(Math.random() * responses.animals.crocodiles.length)];
  }

  // Animals - Snakes
  if (message.match(/\b(snake|python|viper|cobra)\b/i)) {
    return responses.animals.snakes[Math.floor(Math.random() * responses.animals.snakes.length)];
  }

  // Animals - Spiders
  if (message.match(/\b(spider|tarantula|arachnid)\b/i)) {
    return responses.animals.spiders[Math.floor(Math.random() * responses.animals.spiders.length)];
  }

  // Animals - Kangaroos
  if (message.match(/\b(kangaroo|roo|wallaby)\b/i)) {
    return responses.animals.kangaroos[Math.floor(Math.random() * responses.animals.kangaroos.length)];
  }

  // Animals - Koalas
  if (message.match(/\b(koala|bear)\b/i)) {
    return responses.animals.koalas[Math.floor(Math.random() * responses.animals.koalas.length)];
  }

  // Animals - Sharks
  if (message.match(/\b(shark|great white|hammerhead)\b/i)) {
    return responses.animals.sharks[Math.floor(Math.random() * responses.animals.sharks.length)];
  }

  // Animals - Tigers
  if (message.match(/\b(tiger|big cat)\b/i)) {
    return responses.animals.tigers[Math.floor(Math.random() * responses.animals.tigers.length)];
  }

  // Animals - Elephants
  if (message.match(/\b(elephant|jumbo)\b/i)) {
    return responses.animals.elephants[Math.floor(Math.random() * responses.animals.elephants.length)];
  }

  // Conservation - General
  if (message.match(/\b(conservation|protect|save|wildlife warrior)\b/i)) {
    return responses.conservation.general[Math.floor(Math.random() * responses.conservation.general.length)];
  }

  // Conservation - Endangered
  if (message.match(/\b(endangered|extinction|threatened|dying out)\b/i)) {
    return responses.conservation.endangered[Math.floor(Math.random() * responses.conservation.endangered.length)];
  }

  // Conservation - Climate
  if (message.match(/\b(climate|global warming|habitat loss|environment)\b/i)) {
    return responses.conservation.climate[Math.floor(Math.random() * responses.conservation.climate.length)];
  }

  // Australia Zoo
  if (message.match(/\b(australia zoo|zoo)\b/i)) {
    return responses.australiaZoo[Math.floor(Math.random() * responses.australiaZoo.length)];
  }

  // TV Shows
  if (message.match(/\b(tv|show|crocodile hunter|documentary)\b/i)) {
    return responses.tvShows[Math.floor(Math.random() * responses.tvShows.length)];
  }

  // Passion
  if (message.match(/\b(passion|love|favorite|why)\b/i)) {
    return responses.passion[Math.floor(Math.random() * responses.passion.length)];
  }

  // Danger
  if (message.match(/\b(danger|dangerous|scary|afraid|fear)\b/i)) {
    return responses.danger[Math.floor(Math.random() * responses.danger.length)];
  }

  // Default response
  return responses.default[Math.floor(Math.random() * responses.default.length)];
}

// API Endpoints
app.post("/api/chat", (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const response = getResponse(message);
  res.json({ response });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Steve Irwin Chatbot Server running on port ${PORT}`);
});


