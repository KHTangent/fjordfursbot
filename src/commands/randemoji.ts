import * as Discord from "discord.js";
import * as Emoji from "node-emoji";
import { Command } from "../interfaces/Command";

const CreatureEmojis = [
	"🐵",
	"🐒",
	"🦍",
	"🦧",
	"🐶",
	"🐕",
	"🦮",
	"🐕‍🦺",
	"🐩",
	"🐺",
	"🦊",
	"🦝",
	"🐱",
	"🐈",
	"🐈‍⬛",
	"🦁",
	"🐯",
	"🐅",
	"🐆",
	"🐴",
	"🐎",
	"🦄",
	"🦓",
	"🦌",
	"🦬",
	"🐮",
	"🐂",
	"🐃",
	"🐄",
	"🐷",
	"🐖",
	"🐗",
	"🐽",
	"🐏",
	"🐑",
	"🐐",
	"🐪",
	"🐫",
	"🦙",
	"🦒",
	"🐘",
	"🦣",
	"🦏",
	"🦛",
	"🐭",
	"🐁",
	"🐀",
	"🐹",
	"🐰",
	"🐇",
	"🐿️",
	"🦫",
	"🦔",
	"🦇",
	"🐻",
	"🐨",
	"🐼",
	"🦥",
	"🦦",
	"🦨",
	"🦘",
	"🦡",
	"🦃",
	"🐔",
	"🐓",
	"🐣",
	"🐤",
	"🐥",
	"🐦",
	"🐧",
	"🕊️",
	"🦅",
	"🦆",
	"🦢",
	"🦉",
	"🦤",
	"🦩",
	"🦚",
	"🦜",
	"🐸",
	"🐊",
	"🐢",
	"🦎",
	"🐍",
	"🐲",
	"🐉",
	"🐲",
	"🐉",
	"🐲",
	"🐉",
	"🦕",
	"🦖",
	"🐳",
	"🐋",
	"🐬",
	"🦭",
	"🐟",
	"🐠",
	"🐡",
	"🦈",
	"🐙",
	"🐚",
	"🐌",
	"🦋",
	"🐛",
	"🐜",
	"🐝",
	"🪲",
	"🐞",
	"🦗",
	"🪳",
	"🕷️",
	"🦂",
	"🦟",
	"🪰",
	"🪱",
	"🦠",
];

let newCommand: Command = {
	command: new Discord.SlashCommandBuilder()
		.setName("randemoji")
		.setDescription("Generate random emojis")
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setDescription("How many emoji to generate")
				.setMinValue(1)
				.setMaxValue(50)
				.setRequired(true)
		)
		.addBooleanOption((option) =>
			option
				.setName("animal")
				.setDescription("Wether the first emoji should be an animal")
				.setRequired(false)
		)
		.toJSON(),
	execute(ctx) {
		let count = ctx.interaction.options.getInteger("amount", true);
		const startWithAnimal = ctx.interaction.options.getBoolean("animal");
		let reply = "Your emojis: ";
		if (startWithAnimal) {
			reply +=
				CreatureEmojis[Math.floor(Math.random() * CreatureEmojis.length)];
			--count;
		}
		for (let i = 0; i < count; ++i) {
			reply += Emoji.random().emoji;
		}
		ctx.interaction.reply(reply);
	},
};

module.exports = newCommand;
