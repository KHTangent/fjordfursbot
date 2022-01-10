# FjordFursBot - A very basic Discord bot

FjordFursBot is a simple bot written for the FjordFurs Discord server. It doesn't have a lot of features at this time, but 
more features might be added later. Please open an issue if you find a bug or have a suggestion. 
 
----------

## Currently supported features
- Greet new members with a custom message
- Send a message when a user leaves
- Send anonymous modmail

----------

## Current commands
If you set a custom prefix, replace "+" with your prefix for the commands below.

### For users
- `+help` Gives a list of commands
- `+about` Shows information about the bot
- `+serverinfo` Shows member count and creation date of server
- `+uwu {message}` Translates the message above, or the provided text into uwuspeech
- `+getrole [name]` Gives you a role that has been made self-assignable. Note the use of name, not ID
- `+takerole [name]` Removes a self-assignable role
- `+listroles` Lists self-assignable roles for this server
- `+modmail [servername] [message]` Sends an anonymous modmail (must be used in DM)

### For admins
- `+greeting channel [id]` Set what channel to greet new users in
- `+greeting message [message]` Set a message to greet users with. Replaces `{user}` with a mention of the new user, and `{members}` with guild member count.
- `+goodbye channel [id]` Set what channel to send a message when someone leaves
- `+goodbye message [message]` Set a message to send when someone leaves the server. Replaces `{user}` with the name of the user who left, and `{members}` with guild member count.
- `+modmailset channel [id]` Set what channel modmails should be forwarded to
- `+modmailset servername [name]` Set what name people should use to send modmail to this server
- `+addselfassignrole [id]` Makes a role self-assignable for users using the `+getrole`-command
- `+removeselfassignrole [name]` Removes a role from being self-assignable. Note that name is used here, not id.
 
----------

## Setup
1. Install Node.js, and open a command prompt/shell
2. Clone the project with `git clone https://github.com/KHTangent/fjordfursbot`
3. In the new directory, run `npm install`
4. Create a copy of `config-example.json` named `config.json`, and set your Discord bot token there
5. Install `db-migrate` from npm: `npm install -g db-migrate`
6. Run database migrations: `db-migrate up`
7. Compile and run the bot with `npm start` from the project directory
