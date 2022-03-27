import { readFileSync } from "fs";

export class ConfigLoader {
	static getBotConfig(): BotConfig {
		var config = JSON.parse(
			readFileSync(__dirname + "/../config.json").toString()
		);
		if (config["prefix"] == null) config["prefix"] = "+";
		if (config["birthdayHour"] == null) config["birthdayHour"] = 7;
		if (config["birthdayHour"]! < 0 || config["birthdayHour"] > 23) {
			console.error('"birthdayHour" must be an integer in the range 0-23');
			process.exit();
		}
		config["birthdayHour"] = Math.floor(config["birthdayHour"]);
		return config;
	}
}
