import Discord = require("discord.js");
import { ConfigLoader } from "./ConfigLoader";


export class CommandHandler {
	bot:Discord.Client;
	botConfig:BotConfig;

	constructor(bot:Discord.Client, botConfig:BotConfig) {
		this.bot = bot;
		this.botConfig = botConfig;
	}

	setGreetingChannel(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (!msg.member) return;
		if (!msg.member.hasPermission("ADMINISTRATOR")) {
			msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!servers.has(msg.guild!.id)) {
			servers.set(msg.guild!.id, {});
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
		if (!msg.member) return;
		if (!msg.member.hasPermission("ADMINISTRATOR")) {
			msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!servers.has(msg.guild!.id)) {
			servers.set(msg.guild!.id, {});
		}
		var message = msg.content.substring(`${this.botConfig.prefix}greeting message`.length+1).trim();
		servers.get(msg.guild!.id)!.welcomeMessage = message;
		msg.channel.send(`Welcome message set.`);
		ConfigLoader.writeServerConfig(servers);
	}

	setGoodbyeChannel(msg:Discord.Message, servers:Map<string, ServerConfig>) {
		if (!msg.member) return;
		if (!msg.member.hasPermission("ADMINISTRATOR")) {
			msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!servers.has(msg.guild!.id)) {
			servers.set(msg.guild!.id, {});
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
		if (!msg.member) return;
		if (!msg.member.hasPermission("ADMINISTRATOR")) {
			msg.channel.send("You need to be an administrator to use that command.");
			return;
		}
		if (!servers.has(msg.guild!.id)) {
			servers.set(msg.guild!.id, {});
		}
		var message = msg.content.substring(`${this.botConfig.prefix}goodbye message`.length+1).trim();
		servers.get(msg.guild!.id)!.goodbyeMessage = message;
		msg.channel.send(`Goodbye message set.`);
		ConfigLoader.writeServerConfig(servers);
	}
}