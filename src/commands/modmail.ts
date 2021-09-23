import Discord = require("discord.js");
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "modmail",
	async execute(ctx) {
		if (ctx.msg.member) {
			ctx.msg.channel.send(
				"This command can only be used in private messages."
			);
			return;
		}
		var splitMessage = ctx.msg.content.split(" ");
		if (splitMessage.length < 3) {
			ctx.msg.channel.send(
				`Usage: \`${ctx.botConfig.prefix}modmail [ServerName] [message]\``
			);
			return;
		}
		var gID;
		ctx.servers.forEach((val, key) => {
			if (val.modmailServerName == splitMessage[1]) gID = key;
		});
		if (!gID || !ctx.servers.get(gID)!.modmailChannelId) {
			ctx.msg.channel.send("Invalid server name.");
			return;
		}
		try {
			var channel = await ctx.bot.channels.fetch(
				ctx.servers.get(gID)!.modmailChannelId!
			);
			(channel as Discord.TextChannel).send(splitMessage.slice(2).join(" "));
			ctx.msg.react("☑");
		} catch (e) {
			ctx.msg.channel.send(
				"Could not send modmail, please contact the server owner."
			);
		}
	},
};

module.exports = newCommand;
