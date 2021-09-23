import { ConfigLoader } from "../ConfigLoader";
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "addselfassignrole",
	async execute(ctx) {
		if (!ctx.msg.guild) return;
		if (!ctx.msg.member!.hasPermission("ADMINISTRATOR")) {
			ctx.msg.channel.send(
				"You need to be an administrator to use that command."
			);
			return;
		}
		if (!ctx.servers.has(ctx.msg.guild.id)) {
			ctx.servers.set(ctx.msg.guild.id, {});
		}
		var roleid = ctx.msg.content
			.substring(`${ctx.botConfig.prefix}addselfassignrole`.length + 1)
			.trim();
		var role;
		try {
			role = await ctx.msg.guild.roles.fetch(roleid);
		} catch (e) {
			ctx.msg.channel.send("Error getting role with id " + roleid);
		}
		if (!role) {
			ctx.msg.channel.send("Error getting role with id " + roleid);
			return;
		}
		if (!ctx.servers.get(ctx.msg.guild.id)!.selfAssignableRoles) {
			ctx.servers.get(ctx.msg.guild.id)!.selfAssignableRoles = [];
		} else {
			// Verify that the role isn't there already
			for (var grole of ctx.servers.get(ctx.msg.guild.id)!
				.selfAssignableRoles!) {
				if (grole.id == role.id || grole.name == role.name.toLowerCase()) {
					ctx.msg.channel.send("This role has already been added.");
					return;
				}
			}
		}
		ctx.servers.get(ctx.msg.guild!.id)!.selfAssignableRoles!.push({
			id: role.id,
			name: role.name.toLowerCase(),
		});
		ConfigLoader.writeServerConfig(ctx.servers);
		ctx.msg.channel.send(`Role ${role.name} has been made self-assignable.`);
	},
};

module.exports = newCommand;
