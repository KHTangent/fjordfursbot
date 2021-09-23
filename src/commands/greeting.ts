import Discord = require("discord.js");
import { ConfigLoader } from "../ConfigLoader";
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "greeting",
	execute(ctx) {
		if (!ctx.msg.guild) return;
		if (!ctx.msg.member!.hasPermission("ADMINISTRATOR")) {
			ctx.msg.channel.send(
				"You need to be an administrator to use that command."
			);
			return;
		}
		if (!ctx.servers.has(ctx.msg.guild.id)) {
			ctx.servers.set(ctx.msg.guild.id, {});
		}

		if (ctx.msg.content.startsWith(`${ctx.botConfig.prefix}greeting channel`)) {
			var id = ctx.msg.content
				.substring(`${ctx.botConfig.prefix}greeting channel`.length + 1)
				.trim();
			// Check if id is a text channel
			ctx.bot.channels
				.fetch(id)
				.then((channel: Discord.Channel) => {
					if (channel.type != "text") {
						ctx.msg.channel.send("Must be a text channel.");
						return;
					}
					ctx.servers.get(ctx.msg.guild!.id)!.welcomeChannelId = id;
					ctx.msg.channel.send(`Welcome message channel set to <#${id}>`);
					ConfigLoader.writeServerConfig(ctx.servers);
				})
				.catch(() => {
					ctx.msg.channel.send("Unable to get channel with this id.");
				});
		} else if (
			ctx.msg.content.startsWith(`${ctx.botConfig.prefix}greeting message`)
		) {
			var message = ctx.msg.content
				.substring(`${ctx.botConfig.prefix}greeting message`.length + 1)
				.trim();
			ctx.servers.get(ctx.msg.guild.id)!.welcomeMessage = message;
			ctx.msg.channel.send(`Welcome message set.`);
			ConfigLoader.writeServerConfig(ctx.servers);
		}
	},
};

module.exports = newCommand;
