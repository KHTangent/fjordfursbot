CREATE TABLE autoResponses (
	`guildId` TEXT NOT NULL,
	`trigger` TEXT NOT NULL,
	`reply` TEXT NOT NULL,
	`exact` INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE servers 
ADD `noAutoResponseRole` TEXT;
