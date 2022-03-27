import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "about",
	execute(ctx) {
		ctx.msg.channel.send(
			"Hello, I'm **FjordFursBot**!\n" +
				"By KHTangent\n" +
				"Licensed under the MIT License.\n" +
				"<https://github.com/KHTangent/FjordFursBot>\n" +
				`Version 0.7.0`
		);
	},
};

module.exports = newCommand;
