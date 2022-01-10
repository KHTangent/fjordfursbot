export interface ServerConfig {
	welcomeMessage?: string;
	welcomeChannelId?: string;
	goodbyeMessage?: string;
	goodbyeChannelId?: string;
	modmailServerName?: string;
	modmailChannelId?: string;
}

export interface RoleNameID {
	name: string;
	id: string;
}
