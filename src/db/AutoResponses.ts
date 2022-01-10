import { AutoResponse, AutoResponseReduced } from "../interfaces/DbTypes";
import { getDb } from "./db";

export class AutoResponses {
	private static cache: Map<string, Array<AutoResponse>> = new Map();

	/**
	 * Populate cache from database. Should only be called once
	 */
	static async loadAll() {
		const db = await getDb();
		await db.each<AutoResponse>(
			"SELECT * FROM autoResponses",
			[],
			(err, row) => {
				if (err) throw err;
				if (!this.cache.has(row.guildId)) {
					this.cache.set(row.guildId, []);
				}
				this.cache.get(row.guildId)!.push(row);
			}
		);
	}

	/**
	 * Adds a new autoresponse to the database and cache.
	 * @param ar AutoResponse object to add
	 */
	static async add(ar: AutoResponse) {
		const db = await getDb();
		try {
			await db.run(
				`
				INSERT INTO autoResponses(guildId, trigger, reply, exact)
				VALUES (?, ?, ?, ?)
			`,
				[ar.guildId, ar.trigger, ar.reply, ar.exact]
			);
		} catch (e) {
			throw new Error("Error adding autoresponse");
		}
		if (!this.cache.has(ar.guildId)) {
			this.cache.set(ar.guildId, []);
		}
		this.cache.get(ar.guildId)!.push(ar);
	}

	/**
	 * Fetches full AutoResponse object from cache.
	 * @param guildId ID of guild with AutoResponse
	 * @param trigger Trigger word to get AutoResponse for
	 * @returns AutoResponse object if found, otherwise null
	 */
	static get(guildId: string, trigger: string): AutoResponse | null {
		if (!this.cache.has(guildId)) return null;
		for (const ar of this.cache.get(guildId)!) {
			if (ar.trigger == trigger) {
				return ar;
			}
		}
		return null;
	}

	static async remove(guildId: string, trigger: string): Promise<boolean> {
		const db = await getDb();
		const res = await db.run(
			"DELETE FROM autoResponses WHERE guildId = ? AND trigger = ?",
			[guildId, trigger]
		);
		return res.changes != 0;
	}

	/**
	 * Gets a list of triggers in a guild
	 * @param guildId Guild to get AutoResponses of
	 * @returns List of triggers
	 */
	static list(guildId: string): Array<AutoResponseReduced> {
		if (!this.cache.has(guildId)) return [];
		return this.cache.get(guildId)!.map((e) => {
			return {
				exact: e.exact,
				trigger: e.trigger,
			};
		});
	}
}
