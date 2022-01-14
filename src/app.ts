import Discord = require("discord.js");
import { join as pathJoin } from "path";
import { readdirSync } from "fs";

import { ConfigLoader } from "./ConfigLoader";
import { Command } from "./interfaces/Command";
import { connect as connectToDb } from "./db/db";
import { ServerConfigs } from "./db/ServerConfigs";
import { AutoResponses } from "./db/AutoResponses";

(async () => {
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

	console.log("Creating sqlite3 connection...");
	await connectToDb("data.db");
	console.log("sqlite3 connection established.");

	console.log("Populating chaches...");
	await ServerConfigs.loadAll();
	await AutoResponses.loadAll();
	console.log("Caches populated");

	console.log("Connecting to Discord...");
	const bot = new Discord.Client();

	bot.on("ready", () => {
		console.log("Connected to Discord.");
	});

	bot.on("message", (msg: Discord.Message) => {
		if (msg.author.bot) return;
		if (msg.content.startsWith(config.prefix)) {
			let splitCommand = msg.content
				.slice(config.prefix.length)
				.trim()
				.split(/ +/);
			let command = splitCommand.shift()?.toLocaleLowerCase();

			if (command && loadedCommands.has(command)) {
				(loadedCommands.get(command)! as Command).execute({
					bot: bot,
					botConfig: config,
					msg: msg,
				});
			}
		} else if (msg.guild) {
			// Check for autoresponses
			const serverConfig = ServerConfigs.get(msg.member!.guild.id);
			if (
				serverConfig.noAutoResponseRole &&
				msg.member!.roles.cache.has(serverConfig.noAutoResponseRole)
			) {
				return;
			}
			const ars = AutoResponses.list(msg.guild.id);
			for (const ar of ars) {
				if (
					(ar.exact && ar.trigger == msg.content) ||
					(!ar.exact && msg.content.indexOf(ar.trigger) != -1)
				) {
					const response = AutoResponses.get(msg.guild.id, ar.trigger)?.reply;
					msg.channel.send(response);
				}
			}
		}
	});

	bot.on("guildMemberAdd", async (member: Discord.GuildMember) => {
		let serverConfig = ServerConfigs.get(member.guild.id);
		if (serverConfig.welcomeChannelId && serverConfig.welcomeMessage) {
			let welcomeChannel;
			try {
				welcomeChannel = await bot.channels.fetch(
					serverConfig.welcomeChannelId
				);
			} catch (e) {
				return;
			}
			if (welcomeChannel.type != "text") return;
			welcomeChannel = welcomeChannel as Discord.TextChannel;
			let memberCount = "`unknown`";
			try {
				memberCount =
					"" +
					(await welcomeChannel.guild.members.fetch()).filter(
						(v) => !v.user.bot
					).size;
			} catch (_: unknown) {
				// ignore
			}
			welcomeChannel.send(
				serverConfig.welcomeMessage
					.replace(/{user}/g, "<@" + member.user.id + ">")
					.replace(/{members}/g, memberCount)
			);
		}
	});

	bot.on("guildMemberRemove", async (member: Discord.GuildMember) => {
		let serverConfig = ServerConfigs.get(member.guild.id);
		if (serverConfig.goodbyeChannelId && serverConfig.goodbyeMessage) {
			let goodbyeChannel;
			try {
				goodbyeChannel = await bot.channels.fetch(
					serverConfig.goodbyeChannelId
				);
			} catch (e) {
				return;
			}
			if (goodbyeChannel.type != "text") return;
			goodbyeChannel = goodbyeChannel as Discord.TextChannel;
			let memberCount = "`unknown`";
			try {
				memberCount =
					"" +
					(await goodbyeChannel.guild.members.fetch()).filter(
						(v) => !v.user.bot
					).size;
			} catch (_: unknown) {
				// ignore
			}
			goodbyeChannel.send(
				serverConfig.goodbyeMessage
					.replace(/{user}/g, "<@" + member.user.id + ">")
					.replace(/{members}/g, memberCount)
			);
		}
	});

	bot.login(config.token);
})();
