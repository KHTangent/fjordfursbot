import { ServerConfig, Birthday } from "../interfaces/DbTypes";
import { getDb } from "./db";

export class Birthdays {
	/**
	 * Inserts a new birthday into the database
	 * Assumes ranges have been validated beforehand
	 * @param bd Birthday object to add
	 */
	static async add(bd: Birthday) {
		const db = await getDb();
		try {
			await db.run(
				`
				INSERT INTO birthdays(guildId, userId, day, month, year)
				VALUES (?, ?, ?, ?, ?)
			`,
				[bd.guildId, bd.userId, bd.day, bd.month, bd.year]
			);
		} catch (_: unknown) {
			throw new Error("Unable to insert birthday");
		}
	}

	/**
	 * Returns
	 * @param day Day part of date (1-31)
	 * @param month Month (1-12)
	 * @returns
	 */
	static async findByDate(day: number, month: number): Promise<Birthday[]> {
		const db = await getDb();
		let rows = await db.all(
			`SELECT * FROM birthdays WHERE day = ? AND month = ?`,
			[day, month]
		);
		return rows;
	}

	static async delete(guildId: string, userId: string) {
		const db = await getDb();
		await db.run(`DELETE FROM birthdays WHERE guildId = ? AND userId = ?`, [
			guildId,
			userId,
		]);
	}
}
