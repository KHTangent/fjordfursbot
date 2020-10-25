import { Command } from "../interfaces/Command";

let newCommand: Command = {
	name: "about",
	execute(ctx) {
		ctx.msg.channel.send(
			"Hello, I'm **FjordFursBot**!\n" +
			"By KHTangent\n" +
			"Licensed under the MIT License.\n" + 
			"<https://github.com/KHTangent/FjordFursBot>\n" + 
			`Version ${process.env.npm_package_version}` 
		);
	}
}

module.exports = newCommand;