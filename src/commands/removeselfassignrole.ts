import { ConfigLoader } from "../ConfigLoader";
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "removeselfassignrole",
	execute(ctx) {
		if (!ctx.msg.guild) return;
		if (!ctx.msg.member!.hasPermission("ADMINISTRATOR")) {
			ctx.msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!ctx.servers.has(ctx.msg.guild.id)) {
			ctx.servers.set(ctx.msg.guild.id, {});
		}
		if (!ctx.servers.get(ctx.msg.guild.id)!.selfAssignableRoles) {
			ctx.msg.channel.send("This server does not have any self-assignable roles");
		}
		var roleid = ctx.msg.content.substring(`${ctx.botConfig.prefix}removeselfassignrole`.length+1).trim();
		for (var i = 0; i < ctx.servers.get(ctx.msg.guild.id)!.selfAssignableRoles!.length; i++) {
			if (ctx.servers.get(ctx.msg.guild.id)!.selfAssignableRoles![i].id == roleid) {
				ctx.servers.get(ctx.msg.guild.id)!.selfAssignableRoles!.splice(i, 1);
				ctx.msg.channel.send("Role removed");
				ConfigLoader.writeServerConfig(ctx.servers);
				return;
			}
		}
		ctx.msg.channel.send("Role not found.");
	}
}

module.exports = newCommand;