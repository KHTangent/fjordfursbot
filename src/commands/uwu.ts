import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "uwu",
	async execute(ctx) {
		var toUwuize = "";
		if (ctx.msg.content.length == `${ctx.botConfig.prefix}uwu`.length) {
			try {
				var messages = await ctx.msg.channel.messages.fetch({ limit: 2 });
				toUwuize = messages.last()!.content;
			} catch (e) {
				ctx.msg.channel.send("Something went wrong");
				return;
			}
		} else {
			toUwuize = ctx.msg.content
				.substring(`${ctx.botConfig.prefix}uwu `.length)
				.trim();
		}
		toUwuize = toUwuize
			.replace(/r/g, "w")
			.replace(/R/g, "w")
			.replace(/l/g, "w")
			.replace(/L/g, "W");
		toUwuize = toUwuize
			.replace(/This/g, "Dis")
			.replace(/this/g, "dis")
			.replace(/That/g, "Dat")
			.replace(/that/g, "dat");
		toUwuize += " uwu";
		ctx.msg.channel.send(toUwuize);
	},
};

module.exports = newCommand;
