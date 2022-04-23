import { SelfAssignRoles } from "../../db/SelfAssignRoles";
import { Command } from "../../interfaces/Command";

let newCommand: Command = {
	name: "addselfassignrole",
	adminOnly: true,
	guildOnly: true,
	async execute(ctx) {
		var roleId = ctx.msg.content
			.substring(`${ctx.botConfig.prefix}addselfassignrole`.length + 1)
			.trim();
		let role;
		try {
			role = await ctx.msg.guild!.roles.fetch(roleId);
		} catch (e) {
			ctx.msg.channel.send("Error getting role with id " + roleId);
		}
		if (!role) {
			ctx.msg.channel.send("Error getting role with id " + roleId);
			return;
		}
		// Verify that the role isn't there already
		if (
			(await SelfAssignRoles.getId(
				ctx.msg.guild!.id,
				role.name.toLowerCase()
			)) != ""
		) {
			ctx.msg.channel.send("This role has already been added.");
			return;
		}
		try {
			await SelfAssignRoles.add(ctx.msg.guild!.id, {
				id: role.id,
				name: role.name.toLowerCase(),
			});
		} catch (e) {
			ctx.msg.channel.send("Error adding self-assignable role");
			return;
		}
		ctx.msg.channel.send(`Role ${role.name} has been made self-assignable.`);
	},
};

module.exports = newCommand;
