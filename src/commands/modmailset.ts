import * as Discord from "discord.js";
import { ServerConfigs } from "../db/ServerConfigs";
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("modmailset")
		.setDescription("Set modmail options")
		.setDMPermission(false)
		.setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
		.addSubcommand((sub) =>
			sub
				.setName("channel")
				.setDescription("Change channel to forward modmails to")
				.addChannelOption((option) =>
					option
						.setName("channel")
						.setDescription("Channel to forward modmails to")
						.setRequired(true)
						.addChannelTypes(Discord.ChannelType.GuildText)
				)
		)
		.addSubcommand((sub) =>
			sub
				.setName("keyword")
				.setDescription("Change server keyword")
				.addStringOption((option) =>
					option
						.setName("keyword")
						.setDescription("Server name users should use to contact staff")
						.setMinLength(3)
						.setMaxLength(25)
						.setRequired(true)
				)
		)
		.toJSON(),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand === "channel") {
			let channel = interaction.options.getChannel("channel", true);
			const config = ServerConfigs.get(interaction.guild!.id);
			config.modmailChannelId = channel.id;
			try {
				await ServerConfigs.set(interaction.guild!.id, config);
				interaction.reply(`Modmail message channel set to <#${channel.id}>`);
			} catch (e: unknown) {
				if (e instanceof Error) {
					interaction.reply("Error saving: " + e.message);
				}
			}
		} else if (subcommand === "keyword") {
			const serverName = interaction.options.getString("keyword", true);
			if (serverName == "" || serverName.includes(" ")) {
				interaction.reply("Server name must be a single word");
				return;
			}
			let gID = ServerConfigs.getIdFromModmailName(interaction.guild!.id);
			if (gID === "") {
				const config = ServerConfigs.get(interaction.guild!.id);
				config.modmailServerName = serverName;
				try {
					await ServerConfigs.set(interaction.guild!.id, config);
					interaction.reply(`Modmail server name set.`);
				} catch (e: unknown) {
					if (e instanceof Error) {
						interaction.reply("Error saving: " + e.message);
					}
				}
			} else {
				interaction.reply(
					"Server name already in use, please use a different name."
				);
			}
		} else {
			interaction.reply("Please use a subcommand");
		}
	},
};

module.exports = newCommand;
