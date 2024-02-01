import * as Discord from "discord.js";
import { Command } from "../interfaces/Command";
import { ServerConfigs } from "../db/ServerConfigs";
import { simpleDateString, simpleDateValidator } from "../utils";
import { Birthdays } from "../db/Birthdays";

const DATE_REGEX = /(?<day>\d?\d).(?<month>\d?\d).(?<year>\d\d\d\d)/;

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("remember-birthday")
		.setDescription("Remember your birthday")
		.setDMPermission(false)
		.addStringOption((option) =>
			option
				.setName("date")
				.setDescription('Your bithday, in dd.mm.yyyy, or "remove" to remove')
				.setRequired(true)
		)
		.toJSON(),
	async execute(interaction) {
		const date = interaction.options.getString("date", true);
		const birthdaysChannel = ServerConfigs.get(
			interaction.guild!.id
		).birthdaysChannel;
		if (!birthdaysChannel) {
			interaction.reply("Birthdays are not enabled in this server");
			return;
		}
		const match = DATE_REGEX.exec(date);
		if (!match || !match.groups) {
			if (date.startsWith("remove")) {
				try {
					await Birthdays.delete(interaction.guild!.id, interaction.user.id);
					interaction.reply("Birthday removed");
				} catch (_: unknown) {
					interaction.reply("Something went wrong when deleting birthday");
				}
			} else {
				interaction.reply(
					"Invalid date provided.\n" +
						`Usage: \`/remember-birthday dd.mm.yyyy\`\n` +
						`Example if your birthday is the 2nd of April 1998: ` +
						`\`/remember-birthday 02.04.1998\`\n` +
						`To forget a birthday, use \`/remember-birthday remove\``
				);
			}
			return;
		}
		const day = parseInt(match.groups.day);
		const month = parseInt(match.groups.month);
		const year = parseInt(match.groups.year);
		if (!simpleDateValidator(day, month, year)) {
			interaction.reply("That date is not valid");
			return;
		}
		try {
			await Birthdays.delete(interaction.guild!.id, interaction.user.id);
			await Birthdays.add({
				guildId: interaction.guild!.id,
				userId: interaction.user.id,
				day,
				month,
				year,
			});
			interaction.reply(
				"Your birthday has been set to the " +
					simpleDateString(day, month, year)
			);
		} catch (_: unknown) {
			interaction.reply("Something went wrong while saving your birthday");
		}
	},
};

module.exports = newCommand;
