import { EmbedBuilder } from "discord.js";

/**
 * Creates a success embed with Discord's green color
 */
export function createSuccessEmbed(title: string, description?: string) {
	const embed = new EmbedBuilder()
		.setColor(0x57f287)
		.setTitle(`✅ ${title}`)
		.setTimestamp();

	if (description) {
		embed.setDescription(description);
	}

	return embed;
}

/**
 * Creates an error embed with Discord's red color
 */
export function createErrorEmbed(title: string, description?: string) {
	const embed = new EmbedBuilder()
		.setColor(0xed4245)
		.setTitle(`❌ ${title}`)
		.setTimestamp();

	if (description) {
		embed.setDescription(description);
	}

	return embed;
}

/**
 * Creates an info embed with Discord's blurple color
 */
export function createInfoEmbed(title: string, description?: string) {
	const embed = new EmbedBuilder()
		.setColor(0x5865f2)
		.setTitle(title)
		.setTimestamp();

	if (description) {
		embed.setDescription(description);
	}

	return embed;
}

/**
 * Creates a warning embed with Discord's yellow color
 */
export function createWarningEmbed(title: string, description?: string) {
	const embed = new EmbedBuilder()
		.setColor(0xfee75c)
		.setTitle(`⚠️ ${title}`)
		.setTimestamp();

	if (description) {
		embed.setDescription(description);
	}

	return embed;
}
