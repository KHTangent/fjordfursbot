import { AutoResponses } from "../db/AutoResponses";
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "listautoresponses",
	async execute(ctx) {
		if (!ctx.msg.guild) return;
		if (!ctx.msg.member!.hasPermission("ADMINISTRATOR")) {
			ctx.msg.channel.send(
				"You need to be an administrator to use that command."
			);
			return;
		}
		const list = AutoResponses.list(ctx.msg.guild.id).map(
			(e) => (e.exact ? "e | " : "a | ") + e.trigger
		);
		const listMessage =
			"List of autoresponse triggers:\n" +
			"`a` refers to a match anywhere in the message, and `e` refers to an exact match\n" +
			"```" +
			list.join("\n") +
			"```";
		ctx.msg.channel.send(listMessage);
	},
};

module.exports = newCommand;
