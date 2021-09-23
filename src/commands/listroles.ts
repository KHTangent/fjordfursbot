import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "listroles",
	execute(ctx) {
		if (!ctx.msg.guild) return;
		if (
			!ctx.servers.get(ctx.msg.guild.id) ||
			!ctx.servers.get(ctx.msg.guild.id)!.selfAssignableRoles ||
			ctx.servers.get(ctx.msg.guild.id)!.selfAssignableRoles?.length == 0
		) {
			ctx.msg.channel.send(
				"This server does not have any self-assignable roles."
			);
			return;
		}
		var listMessage =
			"List of self-assignable roles: ```" +
			ctx.servers
				.get(ctx.msg.guild.id)!
				.selfAssignableRoles!.map((r) => r.name)
				.join(", ") +
			"```";
		ctx.msg.channel.send(listMessage);
	},
};

module.exports = newCommand;
