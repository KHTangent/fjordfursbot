import { Command } from "../interfaces/Command";
import { ServerConfigs } from "../db/ServerConfigs";

let newCommand: Command = {
	name: "setbirthdayschannel",
	guildOnly: true,
	adminOnly: true,
	async execute(ctx) {
		let id = ctx.msg.content
			.substring(`${ctx.botConfig.prefix}setbirthdayschannel`.length + 1)
			.trim();
		let channel;
		try {
			channel = await ctx.bot.channels.fetch(id);
		} catch (_: unknown) {
			ctx.msg.channel.send("Unable to get channel with this id.");
			return;
		}
		if (channel.type != "text") {
			ctx.msg.channel.send("Must be a text channel.");
			return;
		}
		const config = ServerConfigs.get(ctx.msg.guild!.id);
		config.birthdaysChannel = id;
		try {
			await ServerConfigs.set(ctx.msg.guild!.id, config);
			ctx.msg.channel.send(`Birthday message channel set to <#${id}>`);
		} catch (e: unknown) {
			if (e instanceof Error) {
				ctx.msg.channel.send("Error saving: " + e.message);
			}
		}
	},
};

module.exports = newCommand;
