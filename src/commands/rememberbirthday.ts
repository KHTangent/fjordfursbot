import { Command } from "../interfaces/Command";
import { ServerConfigs } from "../db/ServerConfigs";
import { simpleDateString, simpleDateValidator } from "../utils";
import { Birthdays } from "../db/Birthdays";

const DATE_REGEX = /(?<day>\d?\d).(?<month>\d?\d).(?<year>\d\d\d\d)/;

let newCommand: Command = {
	name: "remember-birthday",
	guildOnly: true,
	async execute(ctx) {
		const birthdaysChannel = ServerConfigs.get(
			ctx.msg.guild!.id
		).birthdaysChannel;
		if (!birthdaysChannel) {
			ctx.msg.channel.send("Birthdays are not enabled in this server");
			return;
		}
		const match = DATE_REGEX.exec(ctx.msg.content);
		if (!match || !match.groups) {
			if (ctx.msg.content.endsWith("remove")) {
				try {
					await Birthdays.delete(ctx.msg.guild!.id, ctx.msg.author.id);
					ctx.msg.channel.send("Birthday removed");
				} catch (_: unknown) {
					ctx.msg.channel.send("Something went wrong when deleting birthday");
				}
			} else {
				ctx.msg.channel.send(
					"Invalid date provided.\n" +
						`Usage: \`${ctx.botConfig.prefix}remember-birthday dd.mm.yyyy\`\n` +
						`Example if your birthday is the 2. of April 1998: ` +
						`\`${ctx.botConfig.prefix}remember-birthday 02.04.1998\`\n` +
						`To forget a birthday, use \`${ctx.botConfig.prefix}remember-birthday remove\``
				);
			}
			return;
		}
		const day = parseInt(match.groups.day);
		const month = parseInt(match.groups.month);
		const year = parseInt(match.groups.year);
		if (!simpleDateValidator(day, month, year)) {
			ctx.msg.channel.send("That date is not valid");
			return;
		}
		try {
			await Birthdays.delete(ctx.msg.guild!.id, ctx.msg.author.id);
			await Birthdays.add({
				guildId: ctx.msg.guild!.id,
				userId: ctx.msg.author.id,
				day,
				month,
				year,
			});
			ctx.msg.channel.send(
				"Your birthday has been set to " + simpleDateString(day, month, year)
			);
		} catch (_: unknown) {
			ctx.msg.channel.send("Something went wrong while saving your birthday");
		}
	},
};

module.exports = newCommand;
