import { Events, type Interaction } from "discord.js";
import { logger } from "../index.js";
import type { Command, Event } from "../types";
import { createErrorEmbed } from "../utils/embeds";

export default {
	name: Events.InteractionCreate,
	async execute(interaction: Interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands?.get(interaction.commandName) as
			| Command
			| undefined;

		if (!command) {
			logger.error(
				`No command matching ${interaction.commandName} was found.`,
				{ event: "command.execute.missing" },
			);
			return;
		}

		try {
			await command.execute(interaction);
			logger.info(
				`Executed ${interaction.commandName} command for ${interaction.user.tag}`,
				{ event: "command.execute.success" },
			);
		} catch (error) {
			logger.error(
				`Error executing ${interaction.commandName}:`,
				error as Error,
				{ event: "command.execute.failure" },
			);

			const errorEmbed = createErrorEmbed(
				"Error",
				"There was an error while executing this command!",
			);

			const reply = {
				embeds: [errorEmbed],
				ephemeral: true,
			};

			if (interaction.replied || interaction.deferred) {
				await interaction.followUp(reply);
			} else {
				await interaction.reply(reply);
			}
		}
	},
} satisfies Event;
