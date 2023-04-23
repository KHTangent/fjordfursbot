import * as Discord from "discord.js";
import { Command } from "../../interfaces/Command";
import { AutoResponses } from "../../db/AutoResponses";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("removeautoresponse")
		.setDescription("Remove an autoresponse")
		.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("trigger")
				.setDescription("Trigger for autoresponse to remove")
				.setRequired(true)
		)
		.toJSON(),
	async execute(interaction) {
		const trigger = interaction.options.getString("trigger", true).replace(/\\n/g, "\n");
		try {
			var removed = await AutoResponses.remove(
				interaction.guild!.id,
				trigger
			);
			if (removed) {
				interaction.reply("Autoresponse removed");
			} else {
				interaction.reply("No auto-response with this trigger found");
			}
		} catch (e) {
			interaction.reply("Something went wrong when removing autoresposne.");
		}
	},
};

module.exports = newCommand;
