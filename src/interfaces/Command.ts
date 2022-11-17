import * as Discord from "discord.js";

export interface Command {
	command: Discord.RESTPostAPIChatInputApplicationCommandsJSONBody;
	execute(interaction: Discord.ChatInputCommandInteraction): void;
}
