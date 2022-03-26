import { Command } from "../interfaces/Command";
import { AutoResponses } from "../db/AutoResponses";

let newCommand: Command = {
	name: "addautoresponse",
	guildOnly: true,
	adminOnly: true,
	async execute(ctx) {
		const commandParts = ctx.msg.content.split("|").map((e) => e.trim());
		const prefix = ctx.botConfig.prefix;
		if (commandParts.length != 3) {
			ctx.msg.channel.send(
				"Usage: ```" +
					prefix +
					"addautoresponse trigger | e/a | response```\n" +
					"Use `e` to require the trigger to be the only contents of the message, or `a` " +
					"if the trigger could be somewhere within a larger message"
			);
			return;
		}
		const trigger = commandParts[0].substring(
			`${prefix}addautoresponse`.length + 1
		);
		const exactOrAnywhere = commandParts[1];
		const reply = commandParts[2];
		if (exactOrAnywhere != "e" && exactOrAnywhere != "a") {
			ctx.msg.channel.send(
				"Scope must be `e` (exact match) or `a` (any match)"
			);
			return;
		}
		try {
			await AutoResponses.add({
				guildId: ctx.msg.guild!.id,
				reply: reply,
				trigger: trigger,
				exact: exactOrAnywhere == "e",
			});
			ctx.msg.channel.send("Autoresponse added");
		} catch (e) {
			ctx.msg.channel.send("Something went wrong when adding autoresposne.");
		}
	},
};

module.exports = newCommand;
