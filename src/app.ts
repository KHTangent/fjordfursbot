import Discord = require("discord.js");
import { join as pathJoin } from "path";
import { readdirSync } from "fs";

import { ConfigLoader } from "./ConfigLoader";
import { Command } from "./interfaces/Command";

console.log("Starting FjordFursBot...");

console.log("Loading commands...");
let loadedCommands = new Map<string, Command>();
let commandsDir = readdirSync(pathJoin(__dirname, "commands")).filter((f) =>
	f.endsWith(".js")
);
for (let commandFile of commandsDir) {
	const command: Command = require(pathJoin(
		__dirname,
		"commands",
		commandFile
	));
	loadedCommands.set(command.name, command);
}
console.log(`Loaded ${commandsDir.length} commands.`);

console.log("Getting bot config...");
var config = ConfigLoader.getBotConfig();
console.log("Loaded bot config.");

console.log("Getting server configs...");
var servers = ConfigLoader.getServerConfig();
console.log("Loaded server configs.");

console.log("Connecting to Discord...");
const bot = new Discord.Client();

bot.on("ready", () => {
	console.log("Connected to Discord.");
});

bot.on("message", (msg: Discord.Message) => {
	if (!msg.content.startsWith(config.prefix)) return;

	let splitCommand = msg.content.slice(config.prefix.length).trim().split(/ +/);
	let command = splitCommand.shift()?.toLocaleLowerCase();

	if (command && loadedCommands.has(command)) {
		(loadedCommands.get(command)! as Command).execute({
			bot: bot,
			botConfig: config,
			msg: msg,
			servers: servers,
		});
	}
});

bot.on("guildMemberAdd", (member: Discord.GuildMember) => {
	if (!servers.has(member.guild.id)) return;
	var serverConfig = servers.get(member.guild.id) as ServerConfig; // Convinces ts that it's not undefined
	if (serverConfig.welcomeChannelId && serverConfig.welcomeMessage) {
		bot.channels
			.fetch(serverConfig.welcomeChannelId)
			.then((channel: Discord.Channel) => {
				if (channel.type != "text") return;
				var textChannel = channel as Discord.TextChannel;
				textChannel.send(
					serverConfig.welcomeMessage!.replace(
						/{user}/g,
						"<@" + member.user.id + ">"
					)
				);
			});
	}
});

bot.on("guildMemberRemove", (member: Discord.GuildMember) => {
	if (!servers.has(member.guild.id)) return;
	var serverConfig = servers.get(member.guild.id) as ServerConfig;
	if (serverConfig.goodbyeChannelId && serverConfig.welcomeMessage) {
		bot.channels
			.fetch(serverConfig.goodbyeChannelId)
			.then((channel: Discord.Channel) => {
				if (channel.type != "text") return;
				var textChannel = channel as Discord.TextChannel;
				textChannel.send(
					serverConfig.goodbyeMessage!.replace(/{user}/g, member.user.username)
				);
			});
	}
});

bot.login(config.token);
