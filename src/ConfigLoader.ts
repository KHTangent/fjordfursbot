import { readFileSync, writeFile, fstat } from "fs";

export class ConfigLoader {
	static getServerConfig():Map<string, ServerConfig> {
		var parsedJSON = JSON.parse(readFileSync(__dirname + "/../servers.json").toString());
		var servers = new Map<string, ServerConfig>();
		for (let server in parsedJSON) {
			servers.set(server, parsedJSON[server]);
		}
		return servers;
	}

	static getBotConfig():BotConfig {
		var config = JSON.parse(readFileSync(__dirname + "/../config.json").toString());
		if (config["prefix"] == null) config["prefix"] = "+";
		return config;
	}

	// Does not work yet
	static writeServerConfig(config:Map<string, ServerConfig>) {
		var jsonReady = Object.create(null);
		console.log(JSON.stringify(config.keys()));
		console.log(JSON.stringify(jsonReady));
		writeFile(__dirname +"/../servers.json", JSON.stringify(jsonReady), () => {});
	}
}