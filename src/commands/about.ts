import * as Discord from "discord.js";
import { Command } from "../interfaces/Command";

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("about")
		.setDescription("Get info about the bot"),
	execute(ctx) {
		ctx.interaction.reply(
			"Hello, I'm **FjordFursBot**!\n" +
				"By KHTangent\n" +
				"Licensed under the MIT License.\n" +
				"<https://github.com/KHTangent/FjordFursBot>\n" +
				`Version 0.8.0`
		);
	},
};

module.exports = newCommand;
