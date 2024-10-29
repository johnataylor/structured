
import OpenAI from "openai";
import { readFileSync } from 'fs';

const openai = new OpenAI();

const schema = JSON.parse(readFileSync('tshirt.json', 'utf8'));

const completion = await openai.beta.chat.completions.parse({
  model: 'gpt-4o-2024-08-06',
  messages: [
    { role: 'system', content: 'Extract the t-shirt.' },
    { role: 'user', content: 'I would like a medium in green please.' },
  ],
  response_format: { type: 'json_schema', json_schema: schema }
});

console.log(JSON.stringify(completion.choices[0].message.parsed, null, 2));
