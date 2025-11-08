import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	ClientEvents,
	SlashCommandBuilder,
} from "discord.js";

export interface Command {
	data: SlashCommandBuilder;
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
	autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export interface Event {
	name: keyof ClientEvents;
	once?: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: Events by definition have varying argument types
	execute: (...args: any[]) => Promise<void> | void;
}
