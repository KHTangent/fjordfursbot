import Discord = require("discord.js");

import { ConfigLoader } from "./ConfigLoader";

console.log("Starting FjordFursBot...")

console.log("Getting bot config...");
var config = ConfigLoader.getBotConfig();
console.log("Loaded bot config.");

console.log("Getting server configs...")
var servers = ConfigLoader.getServerConfig();
console.log("Loaded server configs.");

console.log("Connecting to Discord...");
const bot = new Discord.Client();

bot.on("ready", () => {
	console.log("Connected to Discord.");
});

bot.on("message", (msg:Discord.Message) => {
	if (msg.content == "Hey FjordFursBot!") {
		msg.channel.send("Hello " + msg.author.username + "!");
	}

	if (msg.member && msg.content.startsWith(`${config.prefix}greeting channel`)) {
		if (!msg.member.hasPermission("ADMINISTRATOR")) {
			msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!servers.has(msg.guild!.id)) {
			servers.set(msg.guild!.id, {});
		}
		var id = msg.content.substring(`${config.prefix}greeting channel`.length+1).trim();
		// Check if id is a text channel
		bot.channels.fetch(id).then((channel:Discord.Channel) => {
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

	if (msg.member && msg.content.startsWith(`${config.prefix}greeting message`)) {
		if (!msg.member.hasPermission("ADMINISTRATOR")) {
			msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!servers.has(msg.guild!.id)) {
			servers.set(msg.guild!.id, {});
		}
		var message = msg.content.substring(`${config.prefix}greeting message`.length+1).trim();
		servers.get(msg.guild!.id)!.welcomeMessage = message;
		msg.channel.send(`Welcome message set.`);
		ConfigLoader.writeServerConfig(servers);
	}
});

bot.on("guildMemberAdd", (member:Discord.GuildMember) => {
	if (!servers.has(member.guild.id)) return;
	var serverConfig = servers.get(member.guild.id) as ServerConfig;
	if (serverConfig.welcomeChannelId && serverConfig.welcomeMessage) {
		bot.channels.fetch(serverConfig.welcomeChannelId).then((channel:Discord.Channel) => {
			if (channel.type != "text") return;
			var textChannel = channel as Discord.TextChannel;
			textChannel.send(serverConfig.welcomeMessage!.replace("{user}", "<@"+member.user.id+">"));
		});
	}
});

bot.login(config.token);