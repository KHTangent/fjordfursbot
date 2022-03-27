import { Channel, Client, TextChannel } from "discord.js";
import { Birthdays } from "./db/Birthdays";
import { ServerConfigs } from "./db/ServerConfigs";

export async function handleBirthdays(bot: Client) {
	const guilds = ServerConfigs.getGuildsWithBirthdayChannels();
	const today = new Date();
	const todaysBirthdays = await Birthdays.findByDate(
		today.getDate(),
		today.getMonth() + 1
	);
	for (const birthday of todaysBirthdays) {
		const guild = guilds.find((g) => g.guildId == birthday.guildId);
		if (!guild) continue;
		let channel: TextChannel;
		try {
			const temp = await bot.channels.fetch(guild.birthdayChannelId);
			if (temp instanceof TextChannel) {
				channel = temp;
			} else continue;
		} catch (_: unknown) {
			continue;
		}
		channel.send(`Happy birthday <@${birthday.userId}>!`);
	}
}
