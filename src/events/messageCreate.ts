import { Events, type Message } from "discord.js";
import type { Event } from "../types";

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        if (message.author.bot) return;
        if (/\byo\b/i.test(message.content)) {
            await message.reply("Yo !");
        }
    },
} satisfies Event;
