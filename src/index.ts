import { readdirSync } from "node:fs";
import { join } from "node:path";
import { createLogger } from "@3bougsmedia/logger";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import type { Command, Event } from "./types";

// Extend the Client type to include commands collection
declare module "discord.js" {
	export interface Client {
		commands?: Collection<string, Command>;
	}
}

const logger = createLogger({
	service: "discord-bot",
	environment: process.env.NODE_ENV || "development",
	file: "logs/bot.log",
	// lokiUrl: process.env.LOKI_URL,
});

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

// Initialize commands collection
client.commands = new Collection<string, Command>();

// Load commands
const commandsPath = join(import.meta.dir, "commands");
const commandFiles = readdirSync(commandsPath).filter(
	(file) => file.endsWith(".ts") || file.endsWith(".js"),
);

for (const file of commandFiles) {
	const filePath = join(commandsPath, file);
	const command = (await import(filePath)).default as Command;
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
		logger.info(`[COMMAND] Loaded ${ command.data.name }`, {
			event: "command.load.success",
		});
	} else {
		logger.warn(
			`[WARNING] The command at ${ filePath } is missing required "data" or "execute" property.`,
			{ event: "command.load.failure" },
		);
	}
}

// Load events
const eventsPath = join(import.meta.dir, "events");
const eventFiles = readdirSync(eventsPath).filter(
	(file) => file.endsWith(".ts") || file.endsWith(".js"),
);

for (const file of eventFiles) {
	const filePath = join(eventsPath, file);
	const event = (await import(filePath)).default as Event;
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	logger.info(`[EVENT] Loaded ${ event.name }`, { event: "event.load.success" });
}

// Login
const token = process.env.DISCORD_TOKEN;
if (!token) {
	logger.error("DISCORD_TOKEN is not defined in .env file", {
		event: "bot.login.failure",
	});
	process.exit(1);
}

client.login(token);

export { client, logger };
