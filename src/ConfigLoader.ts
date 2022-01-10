import { readFileSync } from "fs";

export class ConfigLoader {
	static getBotConfig(): BotConfig {
		var config = JSON.parse(
			readFileSync(__dirname + "/../config.json").toString()
		);
		if (config["prefix"] == null) config["prefix"] = "+";
		return config;
	}
}
