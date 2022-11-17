import * as Discord from "discord.js";
import { SelfAssignRoles } from "../../db/SelfAssignRoles";
import { Command } from "../../interfaces/Command";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("listroles")
		.setDescription("Get a list of self-assignable roles")
		.setDMPermission(false)
		.toJSON(),
	async execute(ctx) {
		const roles = await SelfAssignRoles.list(ctx.interaction.guild!.id);
		if (roles.length === 0) {
			ctx.interaction.reply("This server has no self-assignable roles");
		} else {
			var listMessage =
				"List of self-assignable roles: ```" + roles.join(", ") + "```";
			ctx.interaction.reply(listMessage);
		}
	},
};

module.exports = newCommand;
