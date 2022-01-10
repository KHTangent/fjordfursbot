import { SelfAssignRoles } from "../db/SelfAssignRoles";
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "removeselfassignrole",
	async execute(ctx) {
		if (!ctx.msg.guild) return;
		if (!ctx.msg.member!.hasPermission("ADMINISTRATOR")) {
			ctx.msg.channel.send(
				"You need to be an administrator to use that command."
			);
			return;
		}
		var roleName = ctx.msg.content
			.substring(`${ctx.botConfig.prefix}removeselfassignrole`.length + 1)
			.trim();
		const removed = await SelfAssignRoles.remove(ctx.msg.guild.id, roleName);
		if (removed) {
			ctx.msg.channel.send("Role removed from self-assignable roles.");
		} else {
			ctx.msg.channel.send("Role is not self-assignable");
		}
	},
};

module.exports = newCommand;
