import { readFileSync, writeFile, writeFileSync, existsSync } from "fs";

export class ConfigLoader {
	static getServerConfig(): Map<string, ServerConfig> {
		if (!existsSync(__dirname + "/../servers.json")) {
			writeFileSync(__dirname + "/../servers.json", "{}");
		}
		var parsedJSON = JSON.parse(
			readFileSync(__dirname + "/../servers.json").toString()
		);
		var servers = new Map<string, ServerConfig>();
		for (let server in parsedJSON) {
			servers.set(server, parsedJSON[server]);
		}
		return servers;
	}

	static getBotConfig(): BotConfig {
		var config = JSON.parse(
			readFileSync(__dirname + "/../config.json").toString()
		);
		if (config["prefix"] == null) config["prefix"] = "+";
		return config;
	}

	static writeServerConfig(config: Map<string, ServerConfig>) {
		var jsonReady = Object.create(null);
		config.forEach((val, key) => {
			jsonReady[key] = val;
		});
		writeFile(
			__dirname + "/../servers.json",
			JSON.stringify(jsonReady),
			() => {}
		);
	}
}
