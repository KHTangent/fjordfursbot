# FjordFursBot - A very basic Discord bot

FjordFursBot is a simple bot written for the FjordFurs Discord server. It doesn't have a lot of features at this time, but 
more features might be added later. Please open an issue if you find a bug or have a suggestion. 
 
----------

## Currently supported features
- Greet new members with a custom message
 
----------

## Current commands
If you set a custom prefix, replace "+" with your prefix for the commands below.
- `+greeting channel [id]` Set what channel to greet new users in
- `+greeting message [message]` Set a message to greet users with. Replaces `{user}` with a mention of the new user.
 
----------

## Setup
1. Install Node.js, and open a command prompt/shell
2. Install TypeScript from npm: `npm install -g typescript` (prefix with `sudo` if needed)
3. Clone the project with `git clone https://github.com/KHTangent/fjordfursbot`
4. In the new directory, run `npm install`
5. Compile the bot by running `tsc` in the project directory
6. Create a copy of `config-example.json` named `config.json`, and set your Discord bot token there
7. Start the bot with `node out/app.js`


