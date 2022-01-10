CREATE TABLE servers (
	`id` TEXT PRIMARY KEY UNIQUE,
	`welcomeChannelId` TEXT,
	`welcomeMessage` TEXT,
	`goodbyeChannelId` TEXT,
	`goodbyeMessage` TEXT,
	`modmailChannelId` TEXT,
	`modmailServerName` TEXT
);

CREATE TABLE selfAssignRoles (
	`id` TEXT NOT NULL,
	`name` TEXT NOT NULL,
	`roleId` TEXT UNIQUE NOT NULL,
	UNIQUE(`id`, `name`)
);
