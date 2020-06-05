interface ServerConfig {
	welcomeMessage?:string;
	welcomeChannelId?:string;
	goodbyeMessage?:string;
	goodbyeChannelId?:string;
	modmailServerName?:string;
	modmailChannelId?:string;
	selfAssignableRoles?:Array<RoleNameID>;
}

interface RoleNameID {
	name: string;
	id: string;
}