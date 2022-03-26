import { Client, Message } from "discord.js";

export interface Command {
	name: string;
	adminOnly?: boolean;
	guildOnly?: boolean;
	execute(ctx: CommandContext): void;
}

export interface CommandContext {
	msg: Message;
	bot: Client;
	botConfig: BotConfig;
}
