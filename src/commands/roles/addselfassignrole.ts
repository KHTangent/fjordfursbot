import * as Discord from "discord.js";
import { SelfAssignRoles } from "../../db/SelfAssignRoles";
import { Command } from "../../interfaces/Command";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("addselfassignrole")
		.setDescription("Set a new role as self-assignable")
		.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
		.setDMPermission(false)
		.addRoleOption((option) =>
			option
				.setName("role")
				.setDescription("Role to make self-assignable")
				.setRequired(true)
		)
		.toJSON(),
	async execute(interaction) {
		const role = interaction.options.getRole("role", true);
		// Verify that the role isn't there already
		if (
			(await SelfAssignRoles.getId(
				interaction.guild!.id,
				role.name.toLowerCase()
			)) != ""
		) {
			interaction.reply("This role has already been added.");
			return;
		}
		try {
			await SelfAssignRoles.add(interaction.guild!.id, {
				id: role.id,
				name: role.name.toLowerCase(),
			});
		} catch (e) {
			interaction.reply("Error adding self-assignable role");
			return;
		}
		interaction.reply(`Role ${role.name} has been made self-assignable.`);
	},
};

module.exports = newCommand;
