import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "takerole",
	async execute(ctx) {
		if (!ctx.msg.guild) return;
		if (
			!ctx.servers.get(ctx.msg.guild.id) ||
			!ctx.servers.get(ctx.msg.guild.id)!.selfAssignableRoles
		) {
			ctx.msg.channel.send(
				"This server does not have any self-assignable roles."
			);
			return;
		}
		var roleName = ctx.msg.content
			.substring(`${ctx.botConfig.prefix}takerole`.length + 1)
			.trim()
			.toLowerCase();
		var roleObject = ctx.servers
			.get(ctx.msg.guild.id)!
			.selfAssignableRoles!.find((r) => r.name == roleName);
		if (!roleObject) {
			ctx.msg.channel.send("Role not found: `" + roleName + "`");
			return;
		}
		try {
			ctx.msg.member!.roles.remove(roleObject.id, "Requested");
			ctx.msg.react("☑");
		} catch (e) {
			ctx.msg.channel.send("Something went wrong while taking that role.");
		}
	},
};

module.exports = newCommand;
