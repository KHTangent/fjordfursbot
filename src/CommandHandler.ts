import Discord = require("discord.js");
import { ConfigLoader } from "./ConfigLoader";


export class CommandHandler {
	bot:Discord.Client;
	botConfig:BotConfig;

	constructor(bot:Discord.Client, botConfig:BotConfig) {
		this.bot = bot;
		this.botConfig = botConfig;
	}

	help(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		var helpMessage = "List of commands: \n" +
			`\`${this.botConfig.prefix}uwu {text}\` Translates the message above, or the provided text into uwuspeech \n` +
			`\`${this.botConfig.prefix}help\` Displays this help message \n` +
			`\`${this.botConfig.prefix}about\` Displays info about this bot \n` +
			`\`${this.botConfig.prefix}serverinfo\` Displays member count and server creation date \n` +
			`\`${this.botConfig.prefix}listroles\` Gives a list of self-assignable roles \n` +
			`\`${this.botConfig.prefix}getrole [rolename]\` Gives you a self-assignable role \n` +
			`\`${this.botConfig.prefix}takerole [rolename]\` Takes away a self-assignable role \n`;
		if (msg.guild && servers.has(msg.guild.id) && servers.get(msg.guild.id)!.modmailServerName) {
			helpMessage += `\`${this.botConfig.prefix}modmail ${servers.get(msg.guild.id)!.modmailServerName!} [message]\`` +
				` (SEND THIS AS A DIRECT MESSAGE TO THE BOT) Sends a modmail`;
		}
		if (msg.member && msg.member.hasPermission("ADMINISTRATOR")) {
			helpMessage += "\n" + 
			`\`${this.botConfig.prefix}greeting channel [id]\` Set what channel to greet new users in\n` +
			`\`${this.botConfig.prefix}greeting message [message]\` Set a message to greet users with. Replaces \`{user}\` with a mention of the new user.\n` +
			`\`${this.botConfig.prefix}goodbye channel [id]\` Set what channel to send a message when someone leaves\n` +
			`\`${this.botConfig.prefix}goodbye message [message]\` Set a message to send when someone leaves the server. Replaces \`{user}\` with the name of the user who left.\n` +
			`\`${this.botConfig.prefix}modmailset channel [id]\` Set what channel modmails should be forwarded to\n` +
			`\`${this.botConfig.prefix}modmailset servername [name]\` Set what name people should use to send modmail to this server\n` +
			`\`${this.botConfig.prefix}addselfassignrole [id]\` Makes a role self-assignable for users using the \`${this.botConfig.prefix}getrole\`-command\n` +
			`\`${this.botConfig.prefix}removeselfassignrole [id]\` Removes a role from being self-assignable`
		}
		msg.channel.send(helpMessage);
	}

	about(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		msg.channel.send(
			"Hello, I'm **FjordFursBot**!\n" +
			"By KHTangent\n" +
			"Licenced under the MIT Licence.\n" + 
			"<https://github.com/KHTangent/FjordFursBot>\n" + 
			"Version 0.3.1"
		);
	}

	async serverInfo(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (!msg.guild) {
			msg.channel.send("Command must be used in a guild");
			return;
		}
		let members: Discord.Collection<string, Discord.GuildMember>;
		try {
			members = await msg.guild.members.fetch();
		}
		catch {
			msg.channel.send("Could not get member list");
			return;
		}
		let created = msg.guild.createdAt.toUTCString();
		let nonBots = members.filter(v => !v.user.bot).size;
		let total = members.size;
		msg.channel.send(
			`Info about **${msg.guild.name}**\n\n` +
			`**Created at**: ${created} \n` + 
			`**Members**: ${nonBots} \n` + 
			`**With bots**: ${total}`
		);
	}

	setGreetingChannel(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (!msg.guild) return;
		if (!msg.member!.hasPermission("ADMINISTRATOR")) {
			msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!servers.has(msg.guild.id)) {
			servers.set(msg.guild.id, {});
		}
		var id = msg.content.substring(`${this.botConfig.prefix}greeting channel`.length+1).trim();
		// Check if id is a text channel
		this.bot.channels.fetch(id).then((channel:Discord.Channel) => {
			if (channel.type != "text") {
				msg.channel.send("Must be a text channel.");
				return;
			}
			servers.get(msg.guild!.id)!.welcomeChannelId = id;
			msg.channel.send(`Welcome message channel set to <#${id}>`);
			ConfigLoader.writeServerConfig(servers);
		}).catch(() => {
			msg.channel.send("Unable to get channel with this id.");
		});
	}

	setGreetingMessage(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (!msg.guild) return;
		if (!msg.member!.hasPermission("ADMINISTRATOR")) {
			msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!servers.has(msg.guild.id)) {
			servers.set(msg.guild.id, {});
		}
		var message = msg.content.substring(`${this.botConfig.prefix}greeting message`.length+1).trim();
		servers.get(msg.guild.id)!.welcomeMessage = message;
		msg.channel.send(`Welcome message set.`);
		ConfigLoader.writeServerConfig(servers);
	}

	setGoodbyeChannel(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (!msg.guild) return;
		if (!msg.member!.hasPermission("ADMINISTRATOR")) {
			msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!servers.has(msg.guild.id)) {
			servers.set(msg.guild.id, {});
		}
		var id = msg.content.substring(`${this.botConfig.prefix}goodbye channel`.length+1).trim();
		// Check if id is a text channel
		this.bot.channels.fetch(id).then((channel:Discord.Channel) => {
			if (channel.type != "text") {
				msg.channel.send("Must be a text channel.");
				return;
			}
			servers.get(msg.guild!.id)!.goodbyeChannelId = id;
			msg.channel.send(`Goodbye message channel set to <#${id}>`);
			ConfigLoader.writeServerConfig(servers);
		}).catch(() => {
			msg.channel.send("Unable to get channel with this id.");
		});
	}

	setGoodbyeMessage(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (!msg.guild) return;
		if (!msg.member!.hasPermission("ADMINISTRATOR")) {
			msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!servers.has(msg.guild.id)) {
			servers.set(msg.guild.id, {});
		}
		var message = msg.content.substring(`${this.botConfig.prefix}goodbye message`.length+1).trim();
		servers.get(msg.guild.id)!.goodbyeMessage = message;
		msg.channel.send(`Goodbye message set.`);
		ConfigLoader.writeServerConfig(servers);
	}

	setModmailChannel(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (!msg.guild) return;
		if (!msg.member!.hasPermission("ADMINISTRATOR")) {
			msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!servers.has(msg.guild.id)) {
			servers.set(msg.guild.id, {});
		}
		var id = msg.content.substring(`${this.botConfig.prefix}modmailset channel`.length+1).trim();
		// Check if id is a text channel
		this.bot.channels.fetch(id).then((channel:Discord.Channel) => {
			if (channel.type != "text") {
				msg.channel.send("Must be a text channel.");
				return;
			}
			servers.get(msg.guild!.id)!.modmailChannelId = id;
			msg.channel.send(`Modmail message channel set to <#${id}>`);
			ConfigLoader.writeServerConfig(servers);
		}).catch(() => {
			msg.channel.send("Unable to get channel with this id.");
		});
	}

	setModmailServerName(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (!msg.guild) return;
		if (!msg.member!.hasPermission("ADMINISTRATOR")) {
			msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!servers.has(msg.guild.id)) {
			servers.set(msg.guild.id, {});
		}
		var serverName = msg.content.substring(`${this.botConfig.prefix.length}modmailset servername`.length+1).trim();
		if (serverName == "" || serverName.includes(" ")) {
			msg.channel.send("Server name must be a single word");
			return;
		}
		if (this.guildIdFromModmailName(serverName, servers) == "") {
			servers.get(msg.guild.id)!.modmailServerName = serverName;
			msg.channel.send("Modmail server name set.");
			ConfigLoader.writeServerConfig(servers);
		}
		else {
			msg.channel.send("Server name already in use, please use a different name.");
		}
	}

	async sendModmail(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (msg.member) return;
		var splitMessage = msg.content.split(" ");
		if (splitMessage.length < 3) {
			msg.channel.send(`Usage: \`${this.botConfig.prefix}modmail [ServerName] [message]\``);
			return;
		}
		var gID = this.guildIdFromModmailName(splitMessage[1], servers);
		if (gID == "" || !servers.get(gID)!.modmailChannelId) {
			msg.channel.send("Invalid server name.");
			return;
		}
		try {
			var channel = await this.bot.channels.fetch(servers.get(gID)!.modmailChannelId!);
			(channel as Discord.TextChannel).send(splitMessage.slice(2).join(" "));
			msg.react("☑");
		} catch (e) {
			msg.channel.send("Could not send modmail, please contact the server owner.");
		}
	}

	async addSelfAssignRole(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (!msg.guild) return;
		if (!msg.member!.hasPermission("ADMINISTRATOR")) {
			msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!servers.has(msg.guild.id)) {
			servers.set(msg.guild.id, {});
		}
		var roleid = msg.content.substring(`${this.botConfig.prefix}addselfassignrole`.length+1).trim();
		var role;
		try {
			role = await msg.guild.roles.fetch(roleid);
		} catch (e) {
			msg.channel.send("Error getting role with id " + roleid);
		}
		if (!role) {
			msg.channel.send("Error getting role with id " + roleid);
			return;
		}
		if (!servers.get(msg.guild.id)!.selfAssignableRoles) {
			servers.get(msg.guild.id)!.selfAssignableRoles = [];
		}
		else {
			// Verify that the role isn't there already
			for (var grole of servers.get(msg.guild.id)!.selfAssignableRoles!) {
				if (grole.id == role.id || grole.name == role.name.toLowerCase()) {
					msg.channel.send("This role has already been added.");
					return;
				}
			}
		}
		servers.get(msg.guild!.id)!.selfAssignableRoles!.push({
			id: role.id,
			name: role.name.toLowerCase()
		});
		ConfigLoader.writeServerConfig(servers);
		msg.channel.send(`Role ${role.name} has been made self-assignable.`);
	}

	removeSelfAssignRole(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (!msg.guild) return;
		if (!msg.member!.hasPermission("ADMINISTRATOR")) {
			msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!servers.has(msg.guild.id)) {
			servers.set(msg.guild.id, {});
		}
		if (!servers.get(msg.guild.id)!.selfAssignableRoles) {
			msg.channel.send("This server does not have any self-assignable roles");
		}
		var roleid = msg.content.substring(`${this.botConfig.prefix}removeselfassignrole`.length+1).trim();
		for (var i = 0; i < servers.get(msg.guild.id)!.selfAssignableRoles!.length; i++) {
			if (servers.get(msg.guild.id)!.selfAssignableRoles![i].id == roleid) {
				servers.get(msg.guild.id)!.selfAssignableRoles!.splice(i, 1);
				msg.channel.send("Role removed");
				ConfigLoader.writeServerConfig(servers);
				return;
			}
		}
		msg.channel.send("Role not found.");
	}

	listRoles(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (!msg.guild) return;
		if (!servers.get(msg.guild.id) || !servers.get(msg.guild.id)!.selfAssignableRoles) {
			msg.channel.send("This server does not have any self-assignable roles.");
			return;
		}
		var listMessage = "List of self-assignable roles: ```" +
			servers.get(msg.guild.id)!.selfAssignableRoles!.map(r => r.name).join(", ") + "```";
		msg.channel.send(listMessage);
	}

	async getRole(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (!msg.guild) return;
		if (!servers.get(msg.guild.id) || !servers.get(msg.guild.id)!.selfAssignableRoles) {
			msg.channel.send("This server does not have any self-assignable roles.");
			return;
		}
		var roleName = msg.content.substring(`${this.botConfig.prefix}getrole`.length+1).trim().toLowerCase();
		var roleObject = servers.get(msg.guild.id)!.selfAssignableRoles!.find(r => r.name == roleName);
		if (!roleObject) {
			msg.channel.send("Role not found: `" + roleName + "`");
			return;
		}
		try {
			msg.member!.roles.add(roleObject.id, "Requested");
			msg.react("☑");
		} catch (e) {
			msg.channel.send("Something went wrong while giving you the role.");
		}
	}

	async takeRole(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (!msg.guild) return;
		if (!servers.get(msg.guild.id) || !servers.get(msg.guild.id)!.selfAssignableRoles) {
			msg.channel.send("This server does not have any self-assignable roles.");
			return;
		}
		var roleName = msg.content.substring(`${this.botConfig.prefix}takerole`.length+1).trim().toLowerCase();
		var roleObject = servers.get(msg.guild.id)!.selfAssignableRoles!.find(r => r.name == roleName);
		if (!roleObject) {
			msg.channel.send("Role not found: `" + roleName + "`");
			return;
		}
		try {
			msg.member!.roles.remove(roleObject.id, "Requested");
			msg.react("☑");
		} catch (e) {
			msg.channel.send("Something went wrong while taking that role.");
		}
	}

	async uwu(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (msg.author.bot) return;
		var toUwuize = "";
		if (msg.content.length == `${this.botConfig.prefix}uwu`.length) {
			try {
				var messages = await msg.channel.messages.fetch({limit: 2});
				toUwuize = messages.last()!.content;
			} catch (e) {
				msg.channel.send("Something went wrong");
				return;
			}
		}
		else {
			toUwuize = msg.content.substring(`${this.botConfig.prefix}uwu `.length).trim();
		}
		toUwuize = toUwuize.replace(/r/g, "w").replace(/R/g, "w").replace(/l/g, "w").replace(/L/g, "W");
		toUwuize = toUwuize.replace(/This/g, "Dis").replace(/this/g, "dis").replace(/That/g, "Dat").replace(/that/g, "dat");
		toUwuize += " uwu";
		msg.channel.send(toUwuize);
	}
	
	private guildIdFromModmailName(name:string, servers:Map<string, ServerConfig>):string {
		var gID = "";
		servers.forEach((val, key) => {
			if (val.modmailServerName == name) gID = key;
		});
		return gID;
	}
}
