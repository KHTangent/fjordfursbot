import { ServerConfigs } from "../db/ServerConfigs";
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "help",
	execute(ctx) {
		const prefix = ctx.botConfig.prefix;
		var helpMessage =
			"List of commands: \n" +
			`\`${prefix}uwu {text}\` Translates the message above, or the provided text into uwuspeech \n` +
			`\`${prefix}help\` Displays this help message \n` +
			`\`${prefix}about\` Displays info about this bot \n` +
			`\`${prefix}serverinfo\` Displays member count and server creation date \n\n` +
			`\`${prefix}listroles\` Gives a list of self-assignable roles \n` +
			`\`${prefix}getrole [rolename]\` Gives you a self-assignable role \n` +
			`\`${prefix}takerole [rolename]\` Takes away a self-assignable role \n`;
		if (
			ctx.msg.guild &&
			ServerConfigs.get(ctx.msg.guild.id)?.modmailServerName
		) {
			helpMessage +=
				`\`${ctx.botConfig.prefix}modmail ${
					ServerConfigs.get(ctx.msg.guild.id).modmailServerName
				} [message]\`` +
				` (SEND THIS AS A DIRECT MESSAGE TO THE BOT) Sends a modmail\n`;
		}
		if (ctx.msg.member && ctx.msg.member.hasPermission("ADMINISTRATOR")) {
			helpMessage +=
				"\n" +
				`\`${prefix}greeting channel [id]\` Set what channel to greet new users in\n` +
				`\`${prefix}greeting message [message]\` Set a message to greet users with. Replaces \`{user}\` with a mention of the new user.\n` +
				`\`${prefix}goodbye channel [id]\` Set what channel to send a message when someone leaves\n` +
				`\`${prefix}goodbye message [message]\` Set a message to send when someone leaves the server. Replaces \`{user}\` with the name of the user who left.\n` +
				`\`${prefix}modmailset channel [id]\` Set what channel modmails should be forwarded to\n` +
				`\`${prefix}modmailset servername [name]\` Set what name people should use to send modmail to this server\n` +
				`\`${prefix}addselfassignrole [id]\` Makes a role self-assignable for users using the \`${prefix}getrole\`-command\n` +
				`\`${prefix}removeselfassignrole [id]\` Removes a role from being self-assignable`;
		}
		ctx.msg.channel.send(helpMessage);
	},
};

module.exports = newCommand;
