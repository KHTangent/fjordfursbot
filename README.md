# FjordFursBot - A very basic Discord bot

FjordFursBot is a simple bot written for the FjordFurs Discord server. It doesn't have a lot of features at this time, but more features might be added later. Please open an issue if you find a bug or have a suggestion. 
 
----------

## Currently supported features
- Greet new members with a custom message
- Send a message when a user leaves
- Send anonymous modmail
- Self-assignable roles using commands
- Auto-responses to words and phrases, with an opt-out role
- Wish people happy birthday on their birthday

----------

## Current commands
All commands are slash commands, and provide documentation while you type them.

### For users
- `/help` Gives a list of commands
- `/about` Shows information about the bot
- `/serverinfo` Shows member count and creation date of server
- `/uwu {message}` Translates the message above, or the provided text into uwuspeech
- `/getrole [name]` Gives you a role that has been made self-assignable. Note the use of name, not ID
- `/takerole [name]` Removes a self-assignable role
- `/listroles` Lists self-assignable roles for this server
- `/modmail [servername] [message]` Sends an anonymous modmail (must be used in DM)
- `/randemoji [count] {a}` Sends `count` random emojis. If `a` is true, start with an animal/creature
- `/remember-birthday dd.mm.yyyy` (if enabled in server) Remembers your birthday, so the bot can wish you happy birthday when the day comes :)

### For admins
- `/greeting channel [id]` Set what channel to greet new users in
- `/greeting message [message]` Set a message to greet users with. Replaces `{user}` with a mention of the new user, and `{members}` with guild member count.
- `/goodbye channel [id]` Set what channel to send a message when someone leaves
- `/goodbye message [message]` Set a message to send when someone leaves the server. Replaces `{user}` with the name of the user who left, and `{members}` with guild member count.
- `/modmailset channel [id]` Set what channel modmails should be forwarded to
- `/modmailset servername [name]` Set what name people should use to send modmail to this server
- `/addselfassignrole [id]` Makes a role self-assignable for users using the `/getrole`-command
- `/removeselfassignrole [name]` Removes a role from being self-assignable. Note that name is used here, not id.
- `/setbirthdayschannel [id]` Sets channel to wish people happy birthday in

### Auto-responses
Autoresponses are replies the bot makes to specific words or phrases. A user can choose to opt out of all responses using a customizable role. The following commands are available for admins to manage the auto-responses: 
- `/addautoresponse [trigger] [exact/anywhere] [response]` Makes the bot respond to `trigger` with `response`. The middle parameter should be `Exact` if the bot should only respond to messages containing only the `trigger`, and `Anywhere` if the `trigger` only has to be somewhere in the message.
 - `/removeautoresponse [trigger]` Remove the autoresponse on `trigger`
 - `/listautoresponses` Gives a list of all triggers of autoresponses
 - `/setnoautoresponserole [role id]` Sets a role to opt out of auto-responses. A user with this role will never receive an auto-response. 

----------

## Setup
1. Install Node.js, and open a command prompt/shell
2. Clone the project with `git clone https://github.com/KHTangent/fjordfursbot`
3. In the new directory, run `npm install`
4. Create a copy of `config-example.json` named `config.json`, and set your Discord bot token and client ID there
5. Run database migrations: `npm run migrate`
6. Compile and run the bot with `npm start` from the project directory

### Configuring with environment variables
It's also possible to set bot token and client ID using the `TOKEN` and `CLIENT_ID` environment variables. You can either set them in your shell, or add them to a `.env` file in the root directory.

## Upgrading
Remember to re-run `db-migrate` when a new update has arrived to update the database schema.
If other errors happen, try deleting the `out/` directory, and run again.
