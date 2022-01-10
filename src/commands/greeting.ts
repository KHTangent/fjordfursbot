import { Command } from "../interfaces/Command";
import { ServerConfigs } from "../db/ServerConfigs";

let newCommand: Command = {
	name: "greeting",
	async execute(ctx) {
		if (!ctx.msg.guild) return;
		if (!ctx.msg.member!.hasPermission("ADMINISTRATOR")) {
			ctx.msg.channel.send(
				"You need to be an administrator to use that command."
			);
			return;
		}
		if (ctx.msg.content.startsWith(`${ctx.botConfig.prefix}greeting channel`)) {
			var id = ctx.msg.content
				.substring(`${ctx.botConfig.prefix}greeting channel`.length + 1)
				.trim();
			let greetingChannel;
			try {
				greetingChannel = await ctx.bot.channels.fetch(id);
			} catch (e: unknown) {
				ctx.msg.channel.send("Unable to get channel with this id.");
				return;
			}
			if (greetingChannel.type != "text") {
				ctx.msg.channel.send("Must be a text channel.");
				return;
			}
			const oldConfig = ServerConfigs.get(ctx.msg.guild!.id);
			oldConfig.welcomeChannelId = id;
			try {
				await ServerConfigs.set(ctx.msg.guild!.id, oldConfig);
				ctx.msg.channel.send(`Welcome message channel set to <#${id}>`);
			} catch (e: unknown) {
				if (e instanceof Error) {
					ctx.msg.channel.send("Error saving: " + e.message);
				}
			}
		} else if (
			ctx.msg.content.startsWith(`${ctx.botConfig.prefix}greeting message`)
		) {
			var message = ctx.msg.content
				.substring(`${ctx.botConfig.prefix}greeting message`.length + 1)
				.trim();
			const oldConfig = ServerConfigs.get(ctx.msg.guild!.id);
			oldConfig.welcomeMessage = message;
			try {
				await ServerConfigs.set(ctx.msg.guild!.id, oldConfig);
				ctx.msg.channel.send(`Welcome message set.`);
			} catch (e: unknown) {
				if (e instanceof Error) {
					ctx.msg.channel.send("Error saving: " + e.message);
				}
			}
		}
	},
};

module.exports = newCommand;
