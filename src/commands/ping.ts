import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../types";

export default {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong and bot latency"),
	async execute(interaction) {
		const reply = await interaction.reply({
			content: "Pinging...",
			flags: MessageFlags.Ephemeral,
		});
		const sent = await reply.fetch();
		const latency = sent.createdTimestamp - interaction.createdTimestamp;

		const embed = new EmbedBuilder()
			.setColor(0x5865f2)
			.setTitle("🏓 Pong!")
			.addFields(
				{ name: "Latency", value: `${latency}ms`, inline: true },
				{
					name: "WebSocket",
					value: `${interaction.client.ws.ping}ms`,
					inline: true,
				},
			)
			.setTimestamp();

		await interaction.editReply({
			content: "",
			embeds: [embed],
		});
	},
} satisfies Command;
