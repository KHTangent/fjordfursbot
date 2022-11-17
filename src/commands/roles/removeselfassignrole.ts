import * as Discord from "discord.js";
import { SelfAssignRoles } from "../../db/SelfAssignRoles";
import { Command } from "../../interfaces/Command";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("removeselfassignrole")
		.setDescription("Remove a role from the self-assignable role list")
		.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("role")
				.setDescription("Name of role to remove from self-assignable list")
				.setRequired(true)
		)
		.toJSON(),
	async execute(ctx) {
		var roleName = ctx.interaction.options
			.getString("role", true)
			.toLowerCase()
			.trim();
		const removed = await SelfAssignRoles.remove(
			ctx.interaction.guild!.id,
			roleName
		);
		if (removed) {
			ctx.interaction.reply("Role removed from self-assignable roles.");
		} else {
			ctx.interaction.reply("Role is not self-assignable");
		}
	},
};

module.exports = newCommand;
