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
- `+help` Gives a list of commands
- `+about` Shows information about the bot
- `+greeting channel [id]` Set what channel to greet new users in
- `+greeting message [message]` Set a message to greet users with. Replaces `{user}` with a mention of the new user.
- `+goodbye channel [id]` Set what channel to send a message when someone leaves
- `+goodbye message [message]` Set a message to send when someone leaves the server. Replaces `{user}` with the name of the user who left.
- `+modmailset channel [id]` Set what channel modmails should be forwarded to
- `+modmailset servername [name]` Set what name people should use to send modmail to this server
- `+addselfassignrole [id]` Makes a role self-assignable for users using the `+getrole`-command
- `+removeselfassignrole [id]` Removes a role from being self-assignable
- `+listroles` Lists self-assignable roles for this server
- `+getrole [name]` Gives you a role that has been made self-assignable. Note the use of name, not ID
- `+takerole [name]` Removes a self-assignable role
- `+modmail [servername] [message]` Sends an anonymous modmail (must be used in DM)
 
----------

## Setup
1. Install Node.js, and open a command prompt/shell
2. Install TypeScript from npm: `npm install -g typescript` (prefix with `sudo` if needed)
3. Clone the project with `git clone https://github.com/KHTangent/fjordfursbot`
4. In the new directory, run `npm install`
5. Compile the bot by running `tsc` in the project directory
6. Create a copy of `config-example.json` named `config.json`, and set your Discord bot token there
7. Start the bot with `node out/app.js`


