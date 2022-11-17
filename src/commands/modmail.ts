import * as Discord from "discord.js";
import { ServerConfigs } from "../db/ServerConfigs";
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("modmail")
		.setDescription("Send a modmail to some server")
		.setDefaultMemberPermissions(0)
		.setDMPermission(true)
		.addStringOption((option) =>
			option
				.setName("server")
				.setDescription("Name of server to send modmail to")
				.setMinLength(3)
				.setMaxLength(25)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription("The message to be sent to server staff")
				.setRequired(true)
				.setMaxLength(2000)
		)
		.toJSON(),
	async execute(interaction) {
		const serverName = interaction.options.getString("server", true);
		const message = interaction.options.getString("message", true);
		const gID = ServerConfigs.getIdFromModmailName(serverName);
		if (!gID || !ServerConfigs.get(gID).modmailChannelId) {
			interaction.reply("Invalid server name.");
			return;
		}
		try {
			const channel = (await interaction.client.channels.fetch(
				ServerConfigs.get(gID).modmailChannelId!
			)) as Discord.TextChannel;
			channel.send(message);
			interaction.reply("Modmail has been sent");
		} catch (e) {
			interaction.reply(
				"Could not send modmail, please contact the server owner."
			);
		}
	},
};

module.exports = newCommand;
