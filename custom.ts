// sendMessage.ts
import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import dotenv from "dotenv";
import readline from "readline";
dotenv.config();

const CHANNEL_ID = "1291508814591561770"; // right-click channel → Copy Channel ID (Developer Mode must be on)

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}`);

    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || !(channel instanceof TextChannel)) {
        console.error("Channel not found or not a text channel.");
        process.exit(1);
    }

    console.log("Type a message and press Enter to send it. Type 'exit' to quit.\n");
    promptNext(channel);
});

function promptNext(channel: TextChannel) {
    rl.question("> ", async (input) => {
        const trimmed = input.trim();

        if (trimmed.toLowerCase() === "exit") {
            console.log("Exiting.");
            rl.close();
            process.exit(0);
        }

        if (trimmed.length === 0) {
            promptNext(channel); // ignore empty input, ask again
            return;
        }

        try {
            await channel.send(trimmed);
            console.log("Sent.\n");
        } catch (err) {
            console.error("Failed to send message:", err);
        }

        promptNext(channel); // loop for the next message
    });
}

client.login(process.env.DISCORD_TOKEN);