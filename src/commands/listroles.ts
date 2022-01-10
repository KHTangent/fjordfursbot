import { SelfAssignRoles } from "../db/SelfAssignRoles";
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "listroles",
	async execute(ctx) {
		if (!ctx.msg.guild) return;
		const roles = await SelfAssignRoles.list(ctx.msg.guild.id);
		var listMessage =
			"List of self-assignable roles: ```" + roles.join(", ") + "```";
		ctx.msg.channel.send(listMessage);
	},
};

module.exports = newCommand;
