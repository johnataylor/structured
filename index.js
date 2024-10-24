
import OpenAI from "openai";
import { readFileSync } from 'fs';

const openai = new OpenAI();

const schema = JSON.parse(readFileSync('schema2.json', 'utf8'));

const responseFormat = { type: 'json_schema', json_schema: schema };

// const completion1 = await openai.beta.chat.completions.parse({
//   model: 'gpt-4o-2024-08-06',
//   messages: [
//     { role: 'system', content: 'Extract the address information.' },
//     { role: 'user', content: '10630 NE 18th St., Bellevue, 98004, WA' },
//   ],
//   response_format: responseFormat
// });

// console.log(JSON.stringify(completion1.choices[0].message.parsed, null, 2));



const completion2 = await openai.beta.chat.completions.parse({
  model: 'gpt-4o-2024-08-06',
  messages: [
    { role: 'system', content: 'Extract the t-shirt.' },
    { role: 'user', content: 'I would like a medium in green please.' },
  ],
  response_format: responseFormat
});

console.log(JSON.stringify(completion2.choices[0].message.parsed, null, 2));
