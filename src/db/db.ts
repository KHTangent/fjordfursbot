import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";

var db: Database;
export async function connect(filename: string) {
	db = await open({
		filename: filename,
		driver: sqlite3.Database,
	});
}

export async function getDb(): Promise<Database> {
	return db;
}

export async function close() {
	await db.close();
}
