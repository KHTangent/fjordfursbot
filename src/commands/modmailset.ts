import Discord = require("discord.js");
import { ConfigLoader } from "../ConfigLoader";
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "modmailset",
	execute(ctx) {
		if (!ctx.msg.guild) return;
		if (!ctx.msg.member!.hasPermission("ADMINISTRATOR")) {
			ctx.msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!ctx.servers.has(ctx.msg.guild.id)) {
			ctx.servers.set(ctx.msg.guild.id, {});
		}

		if (ctx.msg.content.startsWith(`${ctx.botConfig.prefix}modmailset channel`)) {
			var id = ctx.msg.content.substring(`${ctx.botConfig.prefix}modmailset channel`.length+1).trim();
			// Check if id is a text channel
			ctx.bot.channels.fetch(id).then((channel:Discord.Channel) => {
				if (channel.type != "text") {
					ctx.msg.channel.send("Must be a text channel.");
					return;
				}
				ctx.servers.get(ctx.msg.guild!.id)!.modmailChannelId = id;
				ctx.msg.channel.send(`Modmail message channel set to <#${id}>`);
				ConfigLoader.writeServerConfig(ctx.servers);
			}).catch(() => {
				ctx.msg.channel.send("Unable to get channel with this id.");
			});
		}

		else if (ctx.msg.content.startsWith(`${ctx.botConfig.prefix}modmailset servername`)) {
			var serverName = ctx.msg.content.substring(`${ctx.botConfig.prefix.length}modmailset servername`.length+1).trim();
			if (serverName == "" || serverName.includes(" ")) {
				ctx.msg.channel.send("Server name must be a single word");
				return;
			}
			var gID;
			ctx.servers.forEach((val, key) => {
				if (val.modmailServerName == serverName) gID = key;
			});
			if (!gID) {
				ctx.servers.get(ctx.msg.guild.id)!.modmailServerName = serverName;
				ctx.msg.channel.send("Modmail server name set.");
				ConfigLoader.writeServerConfig(ctx.servers);
			}
			else {
				ctx.msg.channel.send("Server name already in use, please use a different name.");
			}
		}
	}
}

module.exports = newCommand;