import { Command } from "../interfaces/Command";
import { ServerConfigs } from "../db/ServerConfigs";

let newCommand: Command = {
	name: "goodbye",
	async execute(ctx) {
		if (!ctx.msg.guild) return;
		if (!ctx.msg.member!.hasPermission("ADMINISTRATOR")) {
			ctx.msg.channel.send(
				"You need to be an administrator to use that command."
			);
			return;
		}
		if (ctx.msg.content.startsWith(`${ctx.botConfig.prefix}goodbye channel`)) {
			var id = ctx.msg.content
				.substring(`${ctx.botConfig.prefix}goodbye channel`.length + 1)
				.trim();
			let goodbyeChannel;
			try {
				goodbyeChannel = await ctx.bot.channels.fetch(id);
			} catch (e: unknown) {
				ctx.msg.channel.send("Unable to get channel with this id.");
				return;
			}
			if (goodbyeChannel.type != "text") {
				ctx.msg.channel.send("Must be a text channel.");
				return;
			}
			const oldConfig = ServerConfigs.get(ctx.msg.guild!.id);
			oldConfig.goodbyeChannelId = id;
			try {
				await ServerConfigs.set(ctx.msg.guild!.id, oldConfig);
				ctx.msg.channel.send(`Goodbye message channel set to <#${id}>`);
			} catch (e: unknown) {
				if (e instanceof Error) {
					ctx.msg.channel.send("Error saving: " + e.message);
				}
			}
		} else if (
			ctx.msg.content.startsWith(`${ctx.botConfig.prefix}goodbye message`)
		) {
			var message = ctx.msg.content
				.substring(`${ctx.botConfig.prefix}goodbye message`.length + 1)
				.trim();
			const oldConfig = ServerConfigs.get(ctx.msg.guild!.id);
			oldConfig.goodbyeMessage = message;
			try {
				await ServerConfigs.set(ctx.msg.guild!.id, oldConfig);
				ctx.msg.channel.send(`Goodbye message set.`);
			} catch (e: unknown) {
				if (e instanceof Error) {
					ctx.msg.channel.send("Error saving: " + e.message);
				}
			}
		}
	},
};

module.exports = newCommand;
