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
	async execute(ctx) {
		const trigger = ctx.interaction.options.getString("trigger", true);
		try {
			var removed = await AutoResponses.remove(
				ctx.interaction.guild!.id,
				trigger
			);
			if (removed) {
				ctx.interaction.reply("Autoresponse removed");
			} else {
				ctx.interaction.reply("No auto-response with this trigger found");
			}
		} catch (e) {
			ctx.interaction.reply("Something went wrong when removing autoresposne.");
		}
	},
};

module.exports = newCommand;
