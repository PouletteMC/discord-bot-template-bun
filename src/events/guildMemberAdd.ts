import { Events, type GuildMember } from "discord.js";
import { logger } from "..";
import type { Event } from "../types";

export default {
	name: Events.GuildMemberAdd,
	async execute(member: GuildMember) {
		try {

			const defaultRoleId = process.env.DEFAULT_ROLE_ID;

			let memberRole = null;
			if (defaultRoleId) {
				memberRole = member.guild.roles.cache.get(defaultRoleId) ?? null;
				if (!memberRole) {
					logger.warn(
						`[MEMBER JOIN] DEFAULT_ROLE_ID set (${ defaultRoleId }) but role not found in ${ member.guild.name }. Falling back to name lookup.`,
						{ event: "member.role.id.notfound" },
					);
				}
			}

			if (!memberRole) {
				logger.error(
					`[MEMBER JOIN] Role "member" not found in ${ member.guild.name }`,
					{ event: "member.role.notfound" },
				);
				return;
			}

			// Add the role to the new member
			await member.roles.add(memberRole);
			logger.info(
				`[MEMBER JOIN] Assigned "member" role to ${ member.user.tag } in ${ member.guild.name }`,
				{ event: "member.role.assign.success" },
			);
		} catch (error) {
			console.error(
				`[MEMBER JOIN] Failed to assign role to ${ member.user.tag }:`,
				error,
				{ event: "member.role.assign.failure" },
			);
		}
	},
} satisfies Event;
