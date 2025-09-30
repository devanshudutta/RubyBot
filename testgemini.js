import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: "" });

console.log("API KEY:", process.env.DISCORD_TOKEN);


async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "hello reply like you are hoshino ruby",
  });
  console.log(response.text);
}

main();