import * as Discord from "discord.js";
import { SelfAssignRoles } from "../../db/SelfAssignRoles";
import { Command } from "../../interfaces/Command";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("getrole")
		.setDescription("Get a self-assignable role")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("role")
				.setDescription("Name of role to get")
				.setRequired(true)
		)
		.toJSON(),
	async execute(interaction) {
		const roleName = interaction.options
			.getString("role", true)
			.toLowerCase()
			.trim();
		const roleId = await SelfAssignRoles.getId(
			interaction.guild!.id,
			roleName
		);
		if (roleId == "") {
			interaction.reply("Role not found");
			return;
		}
		try {
			(interaction.member!.roles as Discord.GuildMemberRoleManager).add(
				roleId,
				"Requested"
			);
			interaction.reply("Role added");
		} catch (e) {
			interaction.reply("Something went wrong while giving you the role.");
		}
	},
};

module.exports = newCommand;
