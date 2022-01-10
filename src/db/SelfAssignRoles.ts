import { RoleNameID } from "../interfaces/DbTypes";
import { getDb } from "./db";

export class SelfAssignRoles {
	/**
	 * Inserts a new role to be self-assignable in a guild
	 * @param guildId Guild where the role should be self-assignable
	 * @param role Object with name and id of role
	 */
	static async add(guildId: string, role: RoleNameID): Promise<void> {
		const db = await getDb();
		try {
			await db.run(
				"INSERT INTO selfAssignRoles(id, name, roleId) VALUES (?, ?, ?)",
				[guildId, role.name, role.id]
			);
		} catch (e) {
			throw new Error("Error inserting role");
		}
	}

	/**
	 * Removes a self-assignable role from the database.
	 * @param guildId ID of guild who has the role
	 * @param roleName __Name__ of the role to remove from list
	 * @returns True if a role was removed, False otherwise
	 */
	static async remove(guildId: string, roleName: string): Promise<boolean> {
		const db = await getDb();
		const res = await db.run(
			"DELETE FROM selfAssignRoles WHERE id = ? AND name = ?",
			[guildId, roleName]
		);
		return res.changes != 0;
	}

	/**
	 * Gets an array of the names of self-assignable roles
	 * @param guildId Guild ID to fetch roles for
	 * @returns Array of names of self-assignable roles
	 */
	static async list(guildId: string): Promise<Array<string>> {
		const db = await getDb();
		return (
			await db.all("SELECT name FROM selfAssignRoles WHERE id = ?", [guildId])
		).map((e) => e.name);
	}

	/**
	 * Finds the role ID for a named role in a guild
	 * @param guildId Guild where the role is self-assignable
	 * @param name Name of role
	 * @returns Role ID, or "" if not found
	 */
	static async getId(guildId: string, name: string): Promise<string> {
		const db = await getDb();
		const row = await db.get(
			"SELECT roleId FROM selfAssignRoles WHERE id = ? and name = ?",
			[guildId, name]
		);
		return row ? row.roleId : "";
	}
}
