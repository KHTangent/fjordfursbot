import { Command } from "../interfaces/Command";
import { ServerConfigs } from "../db/ServerConfigs";
import { Role } from "discord.js";

let newCommand: Command = {
	name: "setnoautoresponserole",
	guildOnly: true,
	adminOnly: true,
	async execute(ctx) {
		var roleId = ctx.msg.content
			.substring(`${ctx.botConfig.prefix}setnoautoresponserole`.length + 1)
			.trim();

		let role: Role | null = null;
		if (roleId.toLowerCase().indexOf("none") === -1) {
			try {
				role = await ctx.msg.guild!.roles.fetch(roleId);
			} catch (e) {
				ctx.msg.channel.send("Error getting role with id " + roleId);
			}
			if (!role) {
				ctx.msg.channel.send("Error getting role with id " + roleId);
				return;
			}
		}
		const oldConfig = ServerConfigs.get(ctx.msg.guild!.id);
		oldConfig.noAutoResponseRole = roleId ? roleId : undefined;
		try {
			await ServerConfigs.set(ctx.msg.guild!.id, oldConfig);
			if (!role) {
				ctx.msg.channel.send(`Ignore auto-response role has been unset`);
			} else {
				ctx.msg.channel.send(
					`Role ${role.name} has been set as ignore auto-response role.`
				);
			}
		} catch (e) {
			ctx.msg.channel.send("Something went wrong saving the selected role.");
		}
	},
};

module.exports = newCommand;
