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
	async execute(ctx) {
		const subcommand = ctx.interaction.options.getSubcommand();
		if (subcommand === "channel") {
			let channel = ctx.interaction.options.getChannel("channel", true);
			const config = ServerConfigs.get(ctx.interaction.guild!.id);
			config.modmailChannelId = channel.id;
			try {
				await ServerConfigs.set(ctx.interaction.guild!.id, config);
				ctx.interaction.reply(
					`Modmail message channel set to <#${channel.id}>`
				);
			} catch (e: unknown) {
				if (e instanceof Error) {
					ctx.interaction.reply("Error saving: " + e.message);
				}
			}
		} else if (subcommand === "keyword") {
			const serverName = ctx.interaction.options.getString("keyword", true);
			if (serverName == "" || serverName.includes(" ")) {
				ctx.interaction.reply("Server name must be a single word");
				return;
			}
			let gID = ServerConfigs.getIdFromModmailName(ctx.interaction.guild!.id);
			if (gID === "") {
				const config = ServerConfigs.get(ctx.interaction.guild!.id);
				config.modmailServerName = serverName;
				try {
					await ServerConfigs.set(ctx.interaction.guild!.id, config);
					ctx.interaction.reply(`Modmail server name set.`);
				} catch (e: unknown) {
					if (e instanceof Error) {
						ctx.interaction.reply("Error saving: " + e.message);
					}
				}
			} else {
				ctx.interaction.reply(
					"Server name already in use, please use a different name."
				);
			}
		} else {
			ctx.interaction.reply("Please use a subcommand");
		}
	},
};

module.exports = newCommand;
