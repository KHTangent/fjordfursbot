import * as Discord from "discord.js";
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("serverinfo")
		.setDescription("Get info about the server")
		.setDMPermission(false)
		.toJSON(),
	async execute(ctx) {
		let members: Discord.Collection<string, Discord.GuildMember>;
		try {
			members = await ctx.interaction.guild!.members.fetch();
		} catch {
			ctx.interaction.reply("Could not get member list");
			return;
		}
		let created = ctx.interaction.guild!.createdAt.toUTCString();
		let nonBots = members.filter((v) => !v.user.bot).size;
		let total = members.size;
		ctx.interaction.reply(
			`Info about **${ctx.interaction.guild!.name}**\n\n` +
				`**Created at**: ${created} \n` +
				`**Members**: ${nonBots} \n` +
				`**With bots**: ${total}`
		);
	},
};

module.exports = newCommand;
