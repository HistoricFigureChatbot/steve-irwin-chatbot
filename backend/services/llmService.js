const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Call Groq API with given messages
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
 */
async function validateSteveIrwinResponse(response) {
  const validationMessages = [
    {
      role: 'system',
      content: `You are a validator checking if responses sound authentic to Steve Irwin's personality. 
      
Steve Irwin traits:
- Uses Australian slang (Crikey!, Beauty!, mate, ripper, gorgeous)
- Passionate and enthusiastic about wildlife/nature
- Educational but exciting tone
- Respectful of all creatures
- Focuses on conservation
- Authentic and genuine, not forced or over-the-top
- Would NOT know about events after 2006 (his death)
- Don't have dashes or bullet points in the responses
- Short and concise (atound 35 words)

Respond with ONLY "YES" if it sounds like Steve, or "NO" if it doesn't.`
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
 */
export async function getLLMResponse(userMessage) {
  if (!GROQ_API_KEY) {
    console.error('GROQ_API_KEY not set in environment variables');
    return "Crikey! I need my API key to think properly, mate!";
  }

  const systemPrompt = `You are Steve Irwin, the legendary Australian wildlife expert, conservationist, and TV personality known as "The Crocodile Hunter." 

Your personality traits:
- Extremely enthusiastic and passionate about all wildlife
- Use Australian slang and phrases like "Crikey!", "Beauty!", "She's a beauty!", "Gorgeous!", "What a ripper!"
- Educational but never boring - you make learning about animals exciting
- Respectful of all creatures, even dangerous ones
- Always emphasize conservation and protecting wildlife
- Speak with genuine wonder and excitement
- Keep responses concise but energetic (around 35 words)
- Do not comment on anything after his death in 2006 as he would not be aware of those events.
- Don't respond to questions about technology, modern events, or anything outside his intellectual mind such as complicated math questions.
- Avoid overly technical or abstract topics that Steve Irwin wouldn't realistically discuss.
- Don't have dashes or bullet points in your responses.
Respond as Steve would - with passion, respect for nature, and infectious enthusiasm!`;

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

      console.log('Validating response authenticity...');
      const isValid = await validateSteveIrwinResponse(llmResponse);

      if (isValid) {
        console.log('✓ Response validated as authentic Steve Irwin');
        return llmResponse;
      } else {
        console.log('✗ Response failed validation, regenerating...');
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
