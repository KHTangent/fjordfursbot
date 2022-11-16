import * as Discord from "discord.js";
import { Command } from "../../interfaces/Command";
import { ServerConfigs } from "../../db/ServerConfigs";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("setnoautoresponserole")
		.setDescription("Set a role that will have autoresponses muted")
		.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
		.setDMPermission(false)
		.addRoleOption((option) =>
			option
				.setName("role")
				.setDescription("Role to have autorepsonses muted")
				.setRequired(false)
		) as Discord.SlashCommandBuilder,
	async execute(ctx) {
		const role = ctx.interaction.options.getRole("role", false);
		const oldConfig = ServerConfigs.get(ctx.interaction.guild!.id);
		oldConfig.noAutoResponseRole = role ? role.id : undefined;
		try {
			await ServerConfigs.set(ctx.interaction.guild!.id, oldConfig);
			if (!role) {
				ctx.interaction.reply(`Ignore auto-response role has been unset`);
			} else {
				ctx.interaction.reply(
					`Role ${role.name} has been set as ignore auto-response role.`
				);
			}
		} catch (e: unknown) {
			ctx.interaction.reply("Something went wrong saving the selected role.");
		}
	},
};

module.exports = newCommand;
