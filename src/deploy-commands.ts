import { readdirSync } from "node:fs";
import { join } from "node:path";
import {
	REST,
	type RESTPostAPIApplicationCommandsJSONBody,
	Routes,
} from "discord.js";
import { logger } from "./index.js";
import type { Command } from "./types";

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.APPLICATION_ID;

if (!token) {
	logger.error("DISCORD_TOKEN is not defined in .env file");
	process.exit(1);
}

if (!applicationId) {
	logger.error("APPLICATION_ID is not defined in .env file");
	logger.error(
		"Get your Application ID from https://discord.com/developers/applications",
	);
	process.exit(1);
}

const commands = [];
const commandsPath = join(import.meta.dir, "commands");
const commandFiles = readdirSync(commandsPath).filter(
	(file) => file.endsWith(".ts") || file.endsWith(".js"),
);

// Load all commands
for (const file of commandFiles) {
	const filePath = join(commandsPath, file);
	const command = (await import(filePath)).default as Command;
	if ("data" in command && "execute" in command) {
		commands.push(command.data.toJSON());
		logger.info(`[DEPLOY] Loaded ${command.data.name}`, {
			event: "command.load.success",
		});
	} else {
		logger.warn(
			`[WARNING] The command at ${filePath} is missing required "data" or "execute" property.`,
			{ event: "command.load.failure" },
		);
	}
}

// Deploy commands globally
const rest = new REST().setToken(token);

try {
	logger.info(
		`[DEPLOY] Started refreshing ${commands.length} application (/) commands globally.`,
	);

	const data = (await rest.put(Routes.applicationCommands(applicationId), {
		body: commands,
	})) as RESTPostAPIApplicationCommandsJSONBody[];

	logger.info(
		`[DEPLOY] Successfully reloaded ${data.length} application (/) commands globally.`,
		{ event: "commands.deploy.success" },
	);
	logger.info(
		"[INFO] Global commands can take up to 1 hour to propagate to all servers.",
	);
} catch (error) {
	logger.error("[ERROR] Failed to deploy commands:", error as Error, {
		event: "commands.deploy.failure",
	});
	process.exit(1);
}
