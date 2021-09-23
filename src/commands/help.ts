import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "help",
	execute(ctx) {
		var helpMessage =
			"List of commands: \n" +
			`\`${ctx.botConfig.prefix}uwu {text}\` Translates the message above, or the provided text into uwuspeech \n` +
			`\`${ctx.botConfig.prefix}help\` Displays this help message \n` +
			`\`${ctx.botConfig.prefix}about\` Displays info about this bot \n` +
			`\`${ctx.botConfig.prefix}serverinfo\` Displays member count and server creation date \n\n` +
			`\`${ctx.botConfig.prefix}listroles\` Gives a list of self-assignable roles \n` +
			`\`${ctx.botConfig.prefix}getrole [rolename]\` Gives you a self-assignable role \n` +
			`\`${ctx.botConfig.prefix}takerole [rolename]\` Takes away a self-assignable role \n`;
		if (
			ctx.msg.guild &&
			ctx.servers.has(ctx.msg.guild.id) &&
			ctx.servers.get(ctx.msg.guild.id)!.modmailServerName
		) {
			helpMessage +=
				`\`${ctx.botConfig.prefix}modmail ${ctx.servers.get(ctx.msg.guild.id)!
					.modmailServerName!} [message]\`` +
				` (SEND THIS AS A DIRECT MESSAGE TO THE BOT) Sends a modmail\n`;
		}
		if (ctx.msg.member && ctx.msg.member.hasPermission("ADMINISTRATOR")) {
			helpMessage +=
				"\n" +
				`\`${ctx.botConfig.prefix}greeting channel [id]\` Set what channel to greet new users in\n` +
				`\`${ctx.botConfig.prefix}greeting message [message]\` Set a message to greet users with. Replaces \`{user}\` with a mention of the new user.\n` +
				`\`${ctx.botConfig.prefix}goodbye channel [id]\` Set what channel to send a message when someone leaves\n` +
				`\`${ctx.botConfig.prefix}goodbye message [message]\` Set a message to send when someone leaves the server. Replaces \`{user}\` with the name of the user who left.\n` +
				`\`${ctx.botConfig.prefix}modmailset channel [id]\` Set what channel modmails should be forwarded to\n` +
				`\`${ctx.botConfig.prefix}modmailset servername [name]\` Set what name people should use to send modmail to this server\n` +
				`\`${ctx.botConfig.prefix}addselfassignrole [id]\` Makes a role self-assignable for users using the \`${ctx.botConfig.prefix}getrole\`-command\n` +
				`\`${ctx.botConfig.prefix}removeselfassignrole [id]\` Removes a role from being self-assignable`;
		}
		ctx.msg.channel.send(helpMessage);
	},
};

module.exports = newCommand;
