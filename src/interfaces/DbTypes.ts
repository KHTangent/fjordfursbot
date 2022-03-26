export interface ServerConfig {
	welcomeMessage?: string;
	welcomeChannelId?: string;
	goodbyeMessage?: string;
	goodbyeChannelId?: string;
	modmailServerName?: string;
	modmailChannelId?: string;
	noAutoResponseRole?: string;
	birthdaysChannel?: string;
}

export interface RoleNameID {
	name: string;
	id: string;
}

export interface AutoResponse {
	guildId: string;
	trigger: string;
	reply: string;
	exact: boolean;
}

export interface AutoResponseReduced {
	trigger: string;
	exact: boolean;
}

export interface Birthday {
	guildId: string;
	userId: string;
	day: number;
	month: number;
	year: number;
}
