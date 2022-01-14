import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "help",
	execute(ctx) {
		const prefix = ctx.botConfig.prefix;
		let helpMessage =
			"Please see the README on Github for a list of commands.\n" +
			"<https://github.com/KHTangent/FjordFursBot>";
		if (prefix != "+") {
			helpMessage +=
				`\n\n**Note**: This bot uses \`${prefix}\` as prefix for commands. ` +
				`Remember to replace all occurances of \`+\` with \`${prefix}\`!`;
		}
		ctx.msg.channel.send(helpMessage);
	},
};

module.exports = newCommand;
