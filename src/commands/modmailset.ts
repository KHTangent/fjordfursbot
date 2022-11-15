import * as Discord from "discord.js";
import { ServerConfigs } from "../db/ServerConfigs";
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "modmailset",
	guildOnly: true,
	adminOnly: true,
	async execute(ctx) {
		if (
			ctx.msg.content.startsWith(`${ctx.botConfig.prefix}modmailset channel`)
		) {
			let id = ctx.msg.content
				.substring(`${ctx.botConfig.prefix}modmailset channel`.length + 1)
				.trim();
			let channel;
			try {
				channel = await ctx.bot.channels.fetch(id);
			} catch (_: unknown) {
				ctx.msg.channel.send("Unable to get channel with this id.");
				return;
			}
			if (!channel || channel.type != Discord.ChannelType.GuildText) {
				ctx.msg.channel.send("Must be a text channel.");
				return;
			}
			const config = ServerConfigs.get(ctx.msg.guild!.id);
			config.modmailChannelId = id;
			try {
				await ServerConfigs.set(ctx.msg.guild!.id, config);
				ctx.msg.channel.send(`Modmail message channel set to <#${id}>`);
			} catch (e: unknown) {
				if (e instanceof Error) {
					ctx.msg.channel.send("Error saving: " + e.message);
				}
			}
		} else if (
			ctx.msg.content.startsWith(`${ctx.botConfig.prefix}modmailset servername`)
		) {
			var serverName = ctx.msg.content
				.substring(
					`${ctx.botConfig.prefix.length}modmailset servername`.length + 1
				)
				.trim();
			if (serverName == "" || serverName.includes(" ")) {
				ctx.msg.channel.send("Server name must be a single word");
				return;
			}
			let gID = ServerConfigs.getIdFromModmailName(ctx.msg.guild!.id);
			if (gID == "") {
				const config = ServerConfigs.get(ctx.msg.guild!.id);
				config.modmailServerName = serverName;
				try {
					await ServerConfigs.set(ctx.msg.guild!.id, config);
					ctx.msg.channel.send(`Modmail server name set.`);
				} catch (e: unknown) {
					if (e instanceof Error) {
						ctx.msg.channel.send("Error saving: " + e.message);
					}
				}
			} else {
				ctx.msg.channel.send(
					"Server name already in use, please use a different name."
				);
			}
		}
	},
};

module.exports = newCommand;
