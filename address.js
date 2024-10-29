
import OpenAI from "openai";
import { readFileSync } from 'fs';

const openai = new OpenAI();

const schema = JSON.parse(readFileSync('address.json', 'utf8'));

const completion = await openai.beta.chat.completions.parse({
  model: 'gpt-4o-2024-08-06',
  messages: [
    { role: 'system', content: 'Extract the address information.' },
    { role: 'user', content: '10630 NE 18th St., Bellevue, 98004, WA' },
  ],
  response_format: { type: 'json_schema', json_schema: schema }
});

console.log(JSON.stringify(completion.choices[0].message.parsed, null, 2));
