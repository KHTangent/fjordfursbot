import * as Discord from "discord.js";
import { Command } from "../interfaces/Command";
import { ServerConfigs } from "../db/ServerConfigs";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("setbirthdayschannel")
		.setDescription("Sets channel to wish people happy birthday in")
		.setDMPermission(false)
		.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("Birthday channel")
				.setRequired(true)
				.addChannelTypes(Discord.ChannelType.GuildText)
		)
		.toJSON(),
	async execute(interaction) {
		const channel = interaction.options.getChannel("channel", true);
		const config = ServerConfigs.get(interaction.guild!.id);
		config.birthdaysChannel = channel.id;
		try {
			await ServerConfigs.set(interaction.guild!.id, config);
			interaction.reply(`Birthday message channel set to <#${channel.id}>`);
		} catch (e: unknown) {
			if (e instanceof Error) {
				interaction.reply("Error saving: " + e.message);
			}
		}
	},
};

module.exports = newCommand;
