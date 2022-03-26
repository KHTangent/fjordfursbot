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
	name: "randemoji",
	execute(ctx) {
		let count = 3;
		const messageParts = ctx.msg.content.split(" ");
		if (messageParts.length > 1) {
			const parsed = parseInt(messageParts[1]);
			if (isNaN(parsed) || parsed < 1 || parsed > 50) {
				ctx.msg.channel.send("Emoji count must be in the range 1-50");
				return;
			}
			count = parsed;
		}
		let reply = "Your emojis: ";
		if (messageParts.length > 2 && messageParts[2].startsWith("a")) {
			reply +=
				CreatureEmojis[Math.floor(Math.random() * CreatureEmojis.length)];
			--count;
		}
		for (let i = 0; i < count; ++i) {
			reply += Emoji.random().emoji;
		}
		ctx.msg.channel.send(reply);
	},
};

module.exports = newCommand;
