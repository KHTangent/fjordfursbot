import * as Discord from "discord.js";

export interface Command {
	command: Discord.SlashCommandBuilder;
	execute(ctx: CommandContext): void;
}

export interface CommandContext {
	interaction: Discord.ChatInputCommandInteraction;
	bot: Discord.Client;
	botConfig: BotConfig;
}
