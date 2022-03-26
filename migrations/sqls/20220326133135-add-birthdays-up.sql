/* Replace with your SQL commands */

CREATE TABLE birthdays (
	`guildId` TEXT NOT NULL,
	`userId` TEXT UNIQUE NOT NULL,
	`day` INTEGER NOT NULL,
	`month` INTEGER NOT NULL,
	`year` INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE servers
ADD `birthdaysChannel` TEXT;
