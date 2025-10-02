import { Client, GatewayIntentBits, Message } from "discord.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
    TextChannel,
    NewsChannel,
    ThreadChannel,
    DMChannel,
} from "discord.js";
dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });



client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

client.on("messageCreate", async (message: Message) => {
    if (message.author.bot) return;

    // Trigger only when bot is mentioned or starts with !chat
    if (message.content.startsWith("!chat") || message.mentions.has(client.user!)) {


        // const userPrompt = "You are Hoshino Ruby from Oshi no ko. Reply like she would " + message.content.replace(/<@!?(\d+)>/, "").trim();

        const messageContent = message.content.replace(/<@!?(\d+)>/, "").trim()

          const fetched = await message.channel.messages.fetch({ limit: 10 });
           const chatHistory = fetched
      .map(m => `${m.author.displayName}: ${m.cleanContent}`)
      .reverse() // so oldest → newest
      .join("\n");


        const userPrompt = `You are Hoshino Ruby from *Oshi no Ko*. 
                            Stay strictly in character: playful, energetic, Cheerful, Positive. 
                            Do NOT break character or mention you are an AI.

                            Chat history (most recent messages, oldest → newest) take this into account when replying:
                            ${chatHistory}

                            User message:
                            ${messageContent}

                            Response instructions:
                            - Reply as Hoshino Ruby would.
                            - Keep the reply natural and conversational.
                            - Limit the response to about 20 words.
                            - Use casual, friendly language with occasional slang.
                            - Talk like a Hoshino Ruby would.
                            - No emojis or emoticons.`;


        // console.log("User Prompt:", userPrompt); // Debugging line

        if (!userPrompt) {
            message.reply("Give me something to say!");
            return;
        }

        try {
            // Typing indicator

            if (
                message.channel instanceof TextChannel ||
                message.channel instanceof NewsChannel ||
                message.channel instanceof ThreadChannel ||
                message.channel instanceof DMChannel
            ) {
                await message.channel.sendTyping();
            }


            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro",
                contents: userPrompt,
            });

            message.reply(response.text!);

            console.log(response.text);



        } catch (err) {
            console.error(err);
            message.reply("Oops, something went wrong with Gemini!");
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
