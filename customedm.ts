// sendMessage.ts
import { Client, GatewayIntentBits, Partials } from "discord.js";
import dotenv from "dotenv";
import readline from "readline";
dotenv.config();

const USER_ID = "301811959827922954"; // right-click the user → Copy User ID

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent, // needed to actually see message text
    ],
    partials: [Partials.Channel, Partials.Message], // needed for DM messages to arrive reliably
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}`);

    const user = await client.users.fetch(USER_ID);
    const dmChannel = await user.createDM();

    console.log(`DM channel with ${user.username} ready. Type a message, or 'exit' to quit.\n`);
    promptNext(dmChannel);
});

client.on("messageCreate", (message) => {
    // only log messages from this specific user, and ignore the bot's own messages
    if (message.author.id !== USER_ID) return;

    console.log(`\n[${message.author.username}]: ${message.content}`);
    rl.prompt(); // redraw the "> " prompt after printing so it doesn't look broken
});

function promptNext(dmChannel: any) {
    rl.setPrompt("> ");
    rl.prompt();

    rl.on("line", async (input) => {
        const trimmed = input.trim();

        if (trimmed.toLowerCase() === "exit") {
            console.log("Exiting.");
            rl.close();
            process.exit(0);
        }

        if (trimmed.length === 0) {
            rl.prompt();
            return;
        }

        try {
            await dmChannel.send(trimmed);
            console.log("Sent.");
        } catch (err) {
            console.error("Failed to send message:", err);
        }

        rl.prompt();
    });
}

client.login(process.env.DISCORD_TOKEN);