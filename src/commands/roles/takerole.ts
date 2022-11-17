import * as Discord from "discord.js";
import { SelfAssignRoles } from "../../db/SelfAssignRoles";
import { Command } from "../../interfaces/Command";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("takerole")
		.setDescription("Remove a self-assignable role")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("role")
				.setDescription("Name of role to remove")
				.setRequired(true)
		)
		.toJSON(),
	async execute(ctx) {
		var roleName = ctx.interaction.options
			.getString("role", true)
			.toLowerCase()
			.trim();
		const roleId = await SelfAssignRoles.getId(
			ctx.interaction.guild!.id,
			roleName
		);
		if (roleId == "") {
			ctx.interaction.reply("Role not found");
			return;
		}
		try {
			(ctx.interaction.member!.roles as Discord.GuildMemberRoleManager).remove(
				roleId,
				"Requested"
			);
			ctx.interaction.reply("Role removed");
		} catch (e) {
			ctx.interaction.reply("Something went wrong while taking that role.");
		}
	},
};

module.exports = newCommand;
