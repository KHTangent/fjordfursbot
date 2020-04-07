import Discord = require("discord.js");

import { ConfigLoader } from "./ConfigLoader";
import { CommandHandler } from "./CommandHandler";

console.log("Starting FjordFursBot...")

console.log("Getting bot config...");
var config = ConfigLoader.getBotConfig();
console.log("Loaded bot config.");

console.log("Getting server configs...")
var servers = ConfigLoader.getServerConfig();
console.log("Loaded server configs.");

console.log("Connecting to Discord...");
const bot = new Discord.Client();

const commandHanlder = new CommandHandler(bot, config);


bot.on("ready", () => {
	console.log("Connected to Discord.");
});

bot.on("message", (msg:Discord.Message) => {
	if (msg.content == "Hey FjordFursBot!") {
		msg.channel.send("Hello " + msg.author.username + "!");
	}

	if (msg.content.startsWith(`${config.prefix}greeting channel`)) {
		commandHanlder.setGreetingChannel(msg, servers);
	}

	if (msg.content.startsWith(`${config.prefix}greeting message`)) {
		commandHanlder.setGreetingMessage(msg, servers);
	}

	if (msg.content.startsWith(`${config.prefix}goodbye channel`)) {
		commandHanlder.setGoodbyeChannel(msg, servers);
	}

	if (msg.content.startsWith(`${config.prefix}goodbye message`)) {
		commandHanlder.setGoodbyeMessage(msg, servers);
	}
});

bot.on("guildMemberAdd", (member:Discord.GuildMember) => {
	if (!servers.has(member.guild.id)) return;
	var serverConfig = servers.get(member.guild.id) as ServerConfig; // Convinces ts that it's not undefined
	if (serverConfig.welcomeChannelId && serverConfig.welcomeMessage) {
		bot.channels.fetch(serverConfig.welcomeChannelId).then((channel:Discord.Channel) => {
			if (channel.type != "text") return;
			var textChannel = channel as Discord.TextChannel;
			textChannel.send(serverConfig.welcomeMessage!.replace(/{user}/g, "<@"+member.user.id+">"));
		});
	}
});

bot.on("guildMemberRemove", (member:Discord.GuildMember) => {
	if (!servers.has(member.guild.id)) return;
	var serverConfig = servers.get(member.guild.id) as ServerConfig;
	if (serverConfig.goodbyeChannelId && serverConfig.welcomeMessage) {
		bot.channels.fetch(serverConfig.goodbyeChannelId).then((channel:Discord.Channel) => {
			if (channel.type != "text") return;
			var textChannel = channel as Discord.TextChannel;
			textChannel.send(serverConfig.goodbyeMessage!.replace(/{user}/g, member.user.username));
		});
	}
});


bot.login(config.token);