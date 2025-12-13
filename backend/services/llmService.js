/**
 * LLM Service
 * Handles communication with Groq API for generating Steve Irwin responses
 * Uses Claude Sonnet model for natural language generation
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Call Groq API with given messages
 * Makes a POST request to Groq API with conversation messages
 * 
 * @param {Array} messages - Array of message objects with role and content
 * @param {number} [maxTokens=200] - Maximum tokens in response
 * @returns {Promise<string>} Generated response text
 * @throws {Error} If API request fails
 */
async function callGroqAPI(messages, maxTokens = 200) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.8,
      max_tokens: maxTokens,
      top_p: 0.9,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Groq API error: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content?.trim();
}

/**
 * Validate if the response sounds like Steve Irwin
 * Checks if generated response matches Steve's personality and speaking style
 * 
 * @param {string} response - Generated response to validate
 * @returns {Promise<boolean>} True if response sounds authentic, false otherwise
 */
async function validateSteveIrwinResponse(response) {
  const validationMessages = [
    {
      role: 'system',
      content: `You are validating if a response authentically represents Steve Irwin in 2006.
      
Authentic Steve Irwin response:
- Natural Australian slang (Crikey, beauty, mate, ripper, gorgeous, fair dinkum)
- Genuine enthusiasm about wildlife and conservation
- Educational but exciting tone
- Respectful of all creatures
- No mentions of events after 2006 or knowledge he wouldn't have
- No fabricated facts about animals or places
- Short and energetic (around 30 words)
- Plain English only - no other languages
- No bullet points, dashes, or quotation marks
- Admits uncertainty rather than making things up

Red flags (respond NO):
- Claims knowledge of post-2006 events
- Fabricated facts or statistics
- Non-English language
- Overly technical jargon Steve wouldn't use
- Topics completely outside wildlife/conservation expertise

Respond with ONLY "YES" if authentic, or "NO" if inauthentic or non-English.`
    },
    {
      role: 'user',
      content: `Does this response sound like Steve Irwin would say it?

Response: "${response}"

Answer only YES or NO.`
    }
  ];

  try {
    const validation = await callGroqAPI(validationMessages, 10);
    return validation.toUpperCase().includes('YES');
  } catch (error) {
    console.error('Validation error, accepting response by default:', error);
    return true; // If validation fails, accept the response
  }
}

/**
 * Get a response from Groq LLM when no scripted response is available
 * Generates Steve Irwin-style responses using AI for unscripted questions
 * Includes validation to ensure responses sound authentic
 * 
 * @param {string} userMessage - User's message or question
 * @returns {Promise<string>} Generated response in Steve Irwin's voice
 */
export async function getLLMResponse(userMessage) {
  if (!GROQ_API_KEY) {
    console.error('GROQ_API_KEY not set in environment variables');
    return "Crikey! I need my API key to think properly, mate!";
  }

  const systemPrompt = `You ARE Steve Irwin, the Australian wildlife expert and conservationist. It is currently 2006, and you are at the height of your career running Australia Zoo and filming wildlife documentaries.

Who you are:
- Born in 1962, you've been working with crocodiles since childhood at your parents' reptile park
- You run Australia Zoo in Queensland with your wife Terri
- You're filming The Crocodile Hunter series and doing conservation work worldwide
- Your knowledge comes from hands-on experience with wildlife, not books alone
- You speak English with authentic Australian slang naturally - Crikey, beauty, gorgeous, ripper, fair dinkum, mate

What you know and don't know:
- You know about wildlife, conservation, Australia Zoo, your documentaries, and your expeditions
- You do NOT know about events after 2006 - if asked about the future or recent events you wouldn't know, be honest: "I'm not sure about that, mate"
- You do NOT discuss complex mathematics, modern technology you haven't used, or topics completely outside wildlife and conservation
- If asked about something you wouldn't realistically know, say so honestly rather than making things up

How you communicate:
- Keep responses short and energetic (around 30 words)
- Speak naturally without dashes, bullet points, or quotation marks
- Your enthusiasm is genuine, not exaggerated
- You're educational but make it exciting
- You show respect for all creatures, even dangerous ones

Critical boundaries:
- ONLY speak English - if asked in another language, politely decline in English
- NEVER invent facts about animals, places, or events
- NEVER claim to know things beyond your 2006 timeframe
- If uncertain, admit it honestly rather than fabricating information

Be yourself - passionate, genuine, and real.`;

  try {
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Generating LLM response (attempt ${attempts}/${maxAttempts})...`);

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];

      const llmResponse = await callGroqAPI(messages);
      
      if (!llmResponse) {
        console.error('No response from Groq API');
        continue;
      }

      // Check if response is in English (basic check for non-Latin characters)
      const hasNonEnglishChars = /[^\x00-\x7F\u00C0-\u00FF]/.test(llmResponse);
      if (hasNonEnglishChars) {
        console.log('WARNING: Response contains non-English characters, regenerating...');
        continue;
      }

      console.log('Validating response authenticity...');
      const isValid = await validateSteveIrwinResponse(llmResponse);

      if (isValid) {
        console.log('Response validated as authentic Steve Irwin');
        return llmResponse;
      } else {
        console.log('Response failed validation, regenerating...');
        if (attempts >= maxAttempts) {
          console.log('Max attempts reached, using last response');
          return llmResponse;
        }
      }
    }

    return "Crikey! Something went wrong there, mate!";

  } catch (error) {
    console.error('Error calling Groq API:', error);
    return "Crikey! I'm having a bit of trouble thinking right now, mate! Maybe try asking me something else?";
  }
}
