import { type Client, Events } from "discord.js";
import { logger } from "..";
import type { Event } from "../types";

export default {
	name: Events.ClientReady,
	once: true,
	execute(client: Client<true>) {
		logger.info(`Ready! Logged in as ${client.user.tag}`, {
			event: "bot.ready",
		});
	},
} satisfies Event;
