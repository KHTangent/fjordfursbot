import { readFileSync, statSync } from "fs";

export class ConfigLoader {
	static getBotConfig(): BotConfig {
		const jsonPath = __dirname + "/../config.json";
		let json: any = {};
		if (statSync(jsonPath).isFile()) {
			json = JSON.parse(readFileSync(jsonPath).toString());
		}
		const clientId = process.env["CLIENT_ID"] || json["clientId"];
		if (!clientId) {
			console.error("Client id must be set");
			process.exit();
		}
		const token = process.env["TOKEN"] || json["token"];
		if (!token) {
			console.error("Token must be set");
			process.exit();
		}
		const birthdayHour = parseInt(
			process.env["BIRTHDAY_HOUR"] || json["birthdayHour"] || 7
		);
		if (isNaN(birthdayHour) || birthdayHour! < 0 || birthdayHour > 23) {
			console.error('"birthdayHour" must be an integer in the range 0-23');
			process.exit();
		}
		return {
			birthdayHour,
			token,
			clientId,
		};
	}
}
