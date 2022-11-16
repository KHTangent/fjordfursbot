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
		) as Discord.SlashCommandBuilder,
	async execute(ctx) {
		const subcommand = ctx.interaction.options.getSubcommand();
		if (subcommand === "channel") {
			const channel = ctx.interaction.options.getChannel("channel", true);
			const oldConfig = ServerConfigs.get(ctx.interaction.guild!.id);
			oldConfig.goodbyeChannelId = channel.id;
			try {
				await ServerConfigs.set(ctx.interaction.guild!.id, oldConfig);
				ctx.interaction.reply(
					`Goodbye message channel set to <#${channel.id}>`
				);
			} catch (e: unknown) {
				if (e instanceof Error) {
					ctx.interaction.reply("Error saving: " + e.message);
				}
			}
		} else if (subcommand === "message") {
			const message = ctx.interaction.options.getString("message", true);
			const oldConfig = ServerConfigs.get(ctx.interaction.guild!.id);
			oldConfig.goodbyeMessage = message;
			try {
				await ServerConfigs.set(ctx.interaction.guild!.id, oldConfig);
				ctx.interaction.reply(`Goodbye message set.`);
			} catch (e: unknown) {
				if (e instanceof Error) {
					ctx.interaction.reply("Error saving: " + e.message);
				}
			}
		}
	},
};

module.exports = newCommand;
