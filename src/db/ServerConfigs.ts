import { ServerConfig } from "../interfaces/DbTypes";
import { getDb } from "./db";

export class ServerConfigs {
	private static servers: Map<string, ServerConfig> = new Map();

	/**
	 * Used for initial setup to build a cache of the server config
	 */
	static async loadAll(): Promise<void> {
		const db = await getDb();
		let rows = await db.all("SELECT * FROM servers");
		rows.forEach((row: any) => {
			this.servers.set(row.id, {
				welcomeChannelId: row.welcomeChannelId,
				welcomeMessage: row.welcomeMessage,
				goodbyeChannelId: row.goodbyeChannelId,
				goodbyeMessage: row.goodbyeMessage,
				modmailChannelId: row.modmailChannelId,
				modmailServerName: row.modmailServerName,
				noAutoResponseRole: row.noAutoResponseRole,
				birthdaysChannel: row.birthdaysChannel,
			});
		});
	}

	/**
	 * Retrieves config for a server from cache.
	 * @param id Guild ID to get config of
	 * @returns All saved parameters for the guild (can be an empty object)
	 */
	static get(id: string): ServerConfig {
		if (this.servers.has(id)) {
			return this.servers.get(id)!;
		} else {
			return {};
		}
	}

	/**
	 * Convenience function to find the guild ID a modmail server name belongs to
	 * @param name Guild name from `+modmailset`
	 * @returns Guild ID if found, otherwise ""
	 */
	static getIdFromModmailName(name: string): string {
		let id = "";
		this.servers.forEach((val, key) => {
			if (val.modmailServerName == name) {
				id = key;
			}
		});
		return id;
	}

	/**
	 * Replaces or inserts a new configuration into the database.
	 * @param id Guild ID to replace config of
	 * @param config Config to instert
	 */
	static async set(id: string, config: ServerConfig): Promise<void> {
		const db = await getDb();
		let sql = `
			INSERT INTO servers (
				id,
				welcomeChannelId,
				welcomeMessage,
				goodbyeChannelId,
				goodbyeMessage,
				modmailChannelId,
				modmailServerName,
				noAutoResponseRole,
				birthdaysChannel
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(id) DO UPDATE SET 
				welcomeChannelId = excluded.welcomeChannelId,
				welcomeMessage = excluded.welcomeMessage,
				goodbyeChannelId = excluded.goodbyeChannelId,
				goodbyeMessage = excluded.goodbyeMessage,
				modmailChannelId = excluded.modmailChannelId,
				modmailServerName = excluded.modmailServerName,
				noAutoResponseRole = excluded.noAutoResponseRole,
				birthdaysChannel = excluded.birthdaysChannel
		`;
		let updateData = [
			id,
			config.welcomeChannelId,
			config.welcomeMessage,
			config.goodbyeChannelId,
			config.goodbyeMessage,
			config.modmailChannelId,
			config.modmailServerName,
			config.noAutoResponseRole,
			config.birthdaysChannel,
		];
		try {
			await db.run(sql, updateData);
			this.servers.set(id, config);
		} catch (e: unknown) {
			throw new Error("Error saving server config");
		}
	}
}
