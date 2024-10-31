
import OpenAI from "openai";
import fs from 'fs';

const openai = new OpenAI();

function readFileAsBase64(filePath) {
  const img = fs.readFileSync(filePath);
  return 'data:image/png;base64,' + Buffer.from(img).toString('base64');
}

const pngFileName = 'leica34.png';

const schema = JSON.parse(fs.readFileSync('page.json', 'utf8'));

const completion = await openai.beta.chat.completions.parse({
  model: 'gpt-4o-2024-08-06',
  messages: [
    { role: 'system', content: 'Describe the image using the page description schema.' },
    { role: 'user', content: [
      { type: "image_url", image_url: { url: readFileAsBase64(pngFileName) } }
    ]},
  ],
  response_format: { type: 'json_schema', json_schema: schema }
});

console.log(JSON.stringify(completion.choices[0].message.parsed, null, 2));
