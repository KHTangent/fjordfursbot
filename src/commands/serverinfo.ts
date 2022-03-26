import Discord = require("discord.js");
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "serverinfo",
	guildOnly: true,
	async execute(ctx) {
		let members: Discord.Collection<string, Discord.GuildMember>;
		try {
			members = await ctx.msg.guild!.members.fetch();
		} catch {
			ctx.msg.channel.send("Could not get member list");
			return;
		}
		let created = ctx.msg.guild!.createdAt.toUTCString();
		let nonBots = members.filter((v) => !v.user.bot).size;
		let total = members.size;
		ctx.msg.channel.send(
			`Info about **${ctx.msg.guild!.name}**\n\n` +
				`**Created at**: ${created} \n` +
				`**Members**: ${nonBots} \n` +
				`**With bots**: ${total}`
		);
	},
};

module.exports = newCommand;
