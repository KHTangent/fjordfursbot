import * as Discord from "discord.js";
import { Command } from "../interfaces/Command";
import { ServerConfigs } from "../db/ServerConfigs";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("goodbye")
		.setDescription("Set goodbye options")
		.setDMPermission(false)
		.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
		.addSubcommand((sub) =>
			sub
				.setName("channel")
				.setDescription(
					"Change channel to announce when someone leaves the server"
				)
				.addChannelOption((option) =>
					option
						.setName("channel")
						.setDescription("Channel to post goodbye in")
						.setRequired(true)
						.addChannelTypes(Discord.ChannelType.GuildText)
				)
		)
		.addSubcommand((sub) =>
			sub
				.setName("message")
				.setDescription("Set goodbye message")
				.addStringOption((option) =>
					option
						.setName("message")
						.setDescription("Goodbye message content")
						.setRequired(true)
				)
		)
		.toJSON(),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === "channel") {
			const channel = interaction.options.getChannel("channel", true);
			const oldConfig = ServerConfigs.get(interaction.guild!.id);
			oldConfig.goodbyeChannelId = channel.id;
			try {
				await ServerConfigs.set(interaction.guild!.id, oldConfig);
				interaction.reply(`Goodbye message channel set to <#${channel.id}>`);
			} catch (e: unknown) {
				if (e instanceof Error) {
					interaction.reply("Error saving: " + e.message);
				}
			}
		} else if (subcommand === "message") {
			const message = interaction.options
				.getString("message", true)
				.replace(/\\n/g, "\n");
			const oldConfig = ServerConfigs.get(interaction.guild!.id);
			oldConfig.goodbyeMessage = message;
			try {
				await ServerConfigs.set(interaction.guild!.id, oldConfig);
				interaction.reply(`Goodbye message set.`);
			} catch (e: unknown) {
				if (e instanceof Error) {
					interaction.reply("Error saving: " + e.message);
				}
			}
		} else {
			interaction.reply("Unknown subcommand");
		}
	},
};

module.exports = newCommand;
