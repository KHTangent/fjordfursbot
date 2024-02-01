import * as Discord from "discord.js";
import { Command } from "../interfaces/Command";
import { ServerConfigs } from "../db/ServerConfigs";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("greeting")
		.setDescription("Set greeting options")
		.setDMPermission(false)
		.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
		.addSubcommand((sub) =>
			sub
				.setName("channel")
				.setDescription("Change channel to greet members in")
				.addChannelOption((option) =>
					option
						.setName("channel")
						.setDescription("Channel to greet in")
						.setRequired(true)
						.addChannelTypes(Discord.ChannelType.GuildText)
				)
		)
		.addSubcommand((sub) =>
			sub
				.setName("message")
				.setDescription("Set greeting message")
				.addStringOption((option) =>
					option
						.setName("message")
						.setDescription("Greeting message content")
						.setRequired(true)
				)
		)
		.toJSON(),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === "channel") {
			const channel = interaction.options.getChannel("channel", true);
			const oldConfig = ServerConfigs.get(interaction.guild!.id);
			oldConfig.welcomeChannelId = channel.id;
			try {
				await ServerConfigs.set(interaction.guild!.id, oldConfig);
				interaction.reply(`Welcome message channel set to <#${channel.id}>`);
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
			oldConfig.welcomeMessage = message;
			try {
				await ServerConfigs.set(interaction.guild!.id, oldConfig);
				interaction.reply(`Welcome message set.`);
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
