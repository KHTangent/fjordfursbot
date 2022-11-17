import * as Discord from "discord.js";
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("uwu")
		.setDescription("Convert text to uwuspeech")
		.setDMPermission(true)
		.addStringOption((option) =>
			option
				.setRequired(false)
				.setName("text")
				.setDescription("Text to uwuize. If blank, use previous message")
		)
		.toJSON(),
	async execute(ctx) {
		const textParam = ctx.interaction.options.getString("text", false);
		let toUwuize = "";
		if (textParam === null) {
			try {
				var messages = await ctx.interaction.channel!.messages.fetch({
					limit: 1,
				});
				toUwuize = messages.last()!.content;
			} catch (e) {
				ctx.interaction.reply("Something went wrong");
				return;
			}
		} else {
			toUwuize = textParam;
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
		ctx.interaction.reply(toUwuize);
	},
};

module.exports = newCommand;
