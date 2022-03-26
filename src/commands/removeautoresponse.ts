import { Command } from "../interfaces/Command";
import { AutoResponses } from "../db/AutoResponses";

let newCommand: Command = {
	name: "removeautoresponse",
	guildOnly: true,
	adminOnly: true,
	async execute(ctx) {
		const prefix = ctx.botConfig.prefix;
		const trigger = ctx.msg.content.substring(
			`${prefix}removeautoresponse `.length
		);
		try {
			var removed = await AutoResponses.remove(ctx.msg.guild!.id, trigger);
			if (removed) {
				ctx.msg.channel.send("Autoresponse removed");
			} else {
				ctx.msg.channel.send("No auto-response with this trigger found");
			}
		} catch (e) {
			ctx.msg.channel.send("Something went wrong when removing autoresposne.");
		}
	},
};

module.exports = newCommand;
