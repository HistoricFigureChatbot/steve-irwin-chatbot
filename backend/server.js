import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// Load responses from the JSON file
const responses = JSON.parse(fs.readFileSync("responses.json"));


function getResponse(userMessage){

  const message = userMessage.toLowerCase();

  







}


