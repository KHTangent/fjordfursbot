import * as Discord from "discord.js";
import { AutoResponses } from "../../db/AutoResponses";
import { Command } from "../../interfaces/Command";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("listautoresponses")
		.setDescription("Get a list of autoresponses")
		.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(ctx) {
		const list = AutoResponses.list(ctx.interaction.guild!.id).map(
			(e) => (e.exact ? "e | " : "a | ") + e.trigger
		);
		const listMessage =
			"List of autoresponse triggers:\n" +
			"`a` refers to a match anywhere in the message, and `e` refers to an exact match\n" +
			"```" +
			list.join("\n") +
			"```";
		ctx.interaction.reply(listMessage);
	},
};

module.exports = newCommand;
