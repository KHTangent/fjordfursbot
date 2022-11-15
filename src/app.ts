import * as Discord from "discord.js";
import { join as pathJoin } from "path";

import { ConfigLoader } from "./ConfigLoader";
import { Command } from "./interfaces/Command";
import * as db from "./db/db";
import { ServerConfigs } from "./db/ServerConfigs";
import { AutoResponses } from "./db/AutoResponses";
import { delay, walkDirSync } from "./utils";
import { handleBirthdays } from "./BirthdayHandler";

(async () => {
	console.log("Starting FjordFursBot...");
	console.log("Loading commands...");
	let loadedCommands = new Map<string, Command>();
	let commandPaths = new Array<string>();
	walkDirSync(pathJoin(__dirname, "commands"), commandPaths);
	commandPaths = commandPaths.filter((e) => e.endsWith(".js"));
	for (let commandFile of commandPaths) {
		const command: Command = require(commandFile);
		loadedCommands.set(command.name, command);
	}
	console.log(`Loaded ${commandPaths.length} commands.`);

	console.log("Getting bot config...");
	var config = ConfigLoader.getBotConfig();
	console.log("Loaded bot config.");

	console.log("Creating sqlite3 connection...");
	await db.connect("data.db");
	console.log("sqlite3 connection established.");

	console.log("Populating caches...");
	await ServerConfigs.loadAll();
	await AutoResponses.loadAll();
	console.log("Caches populated");

	console.log("Connecting to Discord...");
	const bot = new Discord.Client({
		intents: [
			Discord.GatewayIntentBits.Guilds,
			Discord.GatewayIntentBits.GuildMessages,
			Discord.GatewayIntentBits.MessageContent,
			Discord.GatewayIntentBits.DirectMessageReactions,
			Discord.GatewayIntentBits.GuildMembers,
		],
	});

	bot.on("ready", async () => {
		console.log("Connected to Discord.");
		// Start birthday checks
		// Calculate seconds until next check
		const timeNow = new Date();
		const firstRun = new Date();
		if (timeNow.getHours() > config.birthdayHour) {
			firstRun.setTime(firstRun.getTime() + 1000 * 60 * 60 * 24);
		}
		firstRun.setHours(config.birthdayHour);
		firstRun.setMinutes(0);
		firstRun.setSeconds(0);
		const msToWait = firstRun.getTime() - timeNow.getTime();
		console.log(
			`First birthday check in ${Math.floor(msToWait / 60000)} minutes`
		);
		await delay(msToWait);
		// First call
		handleBirthdays(bot);
		// Call birthday update function every 24 hours
		setInterval(() => {
			handleBirthdays(bot);
		}, 1000 * 60 * 60 * 24);
	});

	bot.on("messageCreate", (msg: Discord.Message) => {
		if (msg.author.bot) return;
		// Check all commands
		if (msg.content.startsWith(config.prefix)) {
			let splitCommand = msg.content
				.slice(config.prefix.length)
				.trim()
				.split(/ +/);
			let command = splitCommand.shift()?.toLocaleLowerCase();

			if (command && loadedCommands.has(command)) {
				const commandObj = loadedCommands.get(command) as Command;
				if (commandObj.guildOnly && !msg.guild) {
					msg.channel.send("This command only works in servers.");
					return;
				} else if (
					commandObj.adminOnly &&
					!msg.member!.permissions.has("Administrator")
				) {
					msg.channel.send(
						"You need to be an administrator to use that command."
					);
					return;
				}
				commandObj.execute({
					bot: bot,
					botConfig: config,
					msg: msg,
				});
			}
		}
		// Check for autoresponses
		else if (msg.guild) {
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
					msg.channel.send(response!);
				}
			}
		}
	});

	bot.on("guildMemberAdd", async (member: Discord.GuildMember) => {
		// Handle welcome messages
		let serverConfig = ServerConfigs.get(member.guild.id);
		if (serverConfig.welcomeChannelId && serverConfig.welcomeMessage) {
			let welcomeChannel;
			try {
				welcomeChannel = await bot.channels.fetch(
					serverConfig.welcomeChannelId
				);
			} catch (_: unknown) {
				return;
			}
			if (
				!welcomeChannel ||
				welcomeChannel.type != Discord.ChannelType.GuildText
			) {
				return;
			}
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

	bot.on("guildMemberRemove", async (member) => {
		// Handle goodbye messages
		let serverConfig = ServerConfigs.get(member.guild.id);
		if (serverConfig.goodbyeChannelId && serverConfig.goodbyeMessage) {
			let goodbyeChannel;
			try {
				goodbyeChannel = await bot.channels.fetch(
					serverConfig.goodbyeChannelId
				);
			} catch (_: unknown) {
				return;
			}
			if (
				!goodbyeChannel ||
				goodbyeChannel.type != Discord.ChannelType.GuildText
			) {
				return;
			}
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
					.replace(/{user}/g, member.user.username)
					.replace(/{members}/g, memberCount)
			);
		}
	});

	process.on("SIGINT", async () => {
		console.log("Exiting...");
		bot.destroy();
		await db.close();
		process.exit();
	});

	bot.login(config.token);
})();
