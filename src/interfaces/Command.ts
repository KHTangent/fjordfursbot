import { Client, Message } from "discord.js";

export interface Command {
	name: string;
	execute(ctx: CommandContext): void;
}

export interface CommandContext {
	msg: Message;
	bot: Client;
	botConfig: BotConfig;
	servers: Map<string, ServerConfig>;
}
