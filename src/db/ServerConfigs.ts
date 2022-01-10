import { getDb } from "./db";

export class ServerConfigs {
	private static servers: Map<string, ServerConfig> = new Map();

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
				selfAssignableRoles: [],
			});
		});
		rows = await db.all("SELECT * FROM selfAssignRoles");
		rows.forEach((row) => {
			this.servers.get(row.id)?.selfAssignableRoles?.push({
				id: row.roleId,
				name: row.name,
			});
		});
	}

	static get(id: string): ServerConfig {
		if (this.servers.has(id)) {
			return this.servers.get(id)!;
		} else {
			return {};
		}
	}

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
				modmailServerName
			) VALUES (?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(id) DO UPDATE SET 
				welcomeChannelId = excluded.welcomeChannelId,
				welcomeMessage = excluded.welcomeMessage,
				goodbyeChannelId = excluded.goodbyeChannelId,
				goodbyeMessage = excluded.goodbyeMessage,
				modmailChannelId = excluded.modmailChannelId,
				modmailServerName = excluded.modmailServerName
		`;
		let updateData = [
			id,
			config.welcomeChannelId,
			config.welcomeMessage,
			config.goodbyeChannelId,
			config.goodbyeMessage,
			config.modmailChannelId,
			config.modmailServerName,
		];
		try {
			await db.run(sql, updateData);
			this.servers.set(id, config);
		} catch (e: unknown) {
			throw e;
			throw new Error("Error saving server config");
		}
	}
}
