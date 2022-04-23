import { SelfAssignRoles } from "../../db/SelfAssignRoles";
import { Command } from "../../interfaces/Command";

let newCommand: Command = {
	name: "getrole",
	guildOnly: true,
	async execute(ctx) {
		var roleName = ctx.msg.content
			.substring(`${ctx.botConfig.prefix}getrole`.length + 1)
			.trim()
			.toLowerCase();
		const roleId = await SelfAssignRoles.getId(ctx.msg.guild!.id, roleName);
		if (roleId == "") {
			ctx.msg.channel.send("Role not found");
			return;
		}
		try {
			ctx.msg.member!.roles.add(roleId, "Requested");
			ctx.msg.react("☑");
		} catch (e) {
			ctx.msg.channel.send("Something went wrong while giving you the role.");
		}
	},
};

module.exports = newCommand;
