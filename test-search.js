
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const catalog = [
  { id: '9336993317079', name: 'The Collection Snowboard: Liquid' },
  { id: '9336993415383', name: 'The Collection Snowboard: Hydrogen' },
  { id: '9336993448151', name: 'The Collection Snowboard: Oxygen' }
];

async function run() {
  const prompt = `
      You are an AI Search Engine for an e-commerce store.
      The user searched for: "snowboard".
      
      Here is the available catalog:
      ${JSON.stringify(catalog, null, 2)}
      
      Find the top 1 to 3 products that best match the user's intent. Even if they use slang, synonyms, or broad terms, find the most relevant items.
      Return ONLY a valid JSON array containing the exact IDs of the matching products. Example: ["id1", "id2"]. No other text.
    `;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
    temperature: 0.1,
  });

  console.log("Raw Response:");
  console.log(completion.choices[0].message.content);
}
run();
