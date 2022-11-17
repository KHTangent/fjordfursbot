import * as Discord from "discord.js";
import { Command } from "../../interfaces/Command";
import { AutoResponses } from "../../db/AutoResponses";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("addautoresponse")
		.setDescription("Add a new autoresponse")
		.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("trigger")
				.setDescription("Word or phrase that should trigger the autoresponse")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("exact")
				.setDescription("Wether the trigger should be the entire message")
				.setRequired(true)
				.addChoices(
					{
						name: "exact",
						value: "exact",
					},
					{
						name: "anywhere",
						value: "anywhere",
					}
				)
		)
		.addStringOption((option) =>
			option
				.setName("reply")
				.setDescription("What the bot should respond with")
				.setRequired(true)
		)
		.toJSON(),
	async execute(ctx) {
		const trigger = ctx.interaction.options.getString("trigger", true);
		const exact = ctx.interaction.options.getString("exact", true) === "exact";
		const reply = ctx.interaction.options.getString("reply", true);
		try {
			await AutoResponses.add({
				guildId: ctx.interaction.guild!.id,
				trigger,
				exact,
				reply,
			});
			ctx.interaction.reply("Autoresponse added");
		} catch (e) {
			ctx.interaction.reply("Something went wrong when adding autoresposne.");
		}
	},
};

module.exports = newCommand;
