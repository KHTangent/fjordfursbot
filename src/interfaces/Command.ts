import { Client, Message } from "discord.js";
import { ServerConfig } from "./DbTypes";

export interface Command {
	name: string;
	execute(ctx: CommandContext): void;
}

export interface CommandContext {
	msg: Message;
	bot: Client;
	botConfig: BotConfig;
}
