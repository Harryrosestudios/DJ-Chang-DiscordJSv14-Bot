# DJ Chang DiscordJS v14 Bot

DJ Chang is a feature-rich Discord music bot built with **Discord.js v14** and **@discordjs/voice**. It supports playing music, managing queues, and handling inactivity timeouts dynamically. The bot also integrates Python for extracting thumbnails from songs.

---

## Features
- Play individual songs or shuffle entire playlists.
- Dynamic inactivity timeout configurable via `config.json`.
- Displays rich embeds with song information and thumbnails.
- Supports Node.js and Python integration for advanced functionality.

---

## Requirements
Before you start, ensure you have the following installed:
- **Node.js** (v16.9.0 or higher)
- **Python** (v3.6 or higher)
- **FFmpeg** (for audio processing)

---

## Installation

1. Clone the repository:

git clone git@github.com:Harryrosestudios/DJ-Chang-DiscordJSv14-Bot.git
cd DJ-Chang-DiscordJSv14-Bot


2. Install Node.js dependencies:

npm install

3. Create a `config.json` file by copying the example configuration:

cp example-config.json config.json

Fill in your Discord bot token, client ID, guild ID, and other settings as needed.

4. Ensure FFmpeg is installed on your system:

Ubuntu/Debian
sudo apt install ffmpeg
macOS (via Homebrew)
brew install ffmpeg
Windows: Download from https://ffmpeg.org/download.html


---

## Usage

1. Deploy slash commands to your Discord server:

node deploy-commands.js

2. Start the bot:

node index.js


3. Interact with the bot using commands like `/play`, `/skip`, `/nowplaying`, etc.

---

## Configuration

The bot uses a `config.json` file for its settings. Here's an example structure:

{
    "token": "Your-Bot_Token",
    "clientId": "Your-Bot-ClientID",
    "version": "1.0",
    "guildId": "The Server ID of which to use the bot in",
    "adminId": "The user ID for who should be able to use the !kill and !restart commands",
    "prefix": "The Prefix to use for Admin Commands",  
    "musicFolder": "./music/",
    "activityType": "LISTENING",
    "defaultVolume": 0.5
}


- `token`: Your bot's token from the Discord Developer Portal.
- `clientId`: The client ID of your bot.
- `guildId`: The ID of your Discord server.
- `inactivityTimeout`: Timeout duration in milliseconds (e.g., 60000 = 1 minute).

---

## Using PM2 for Process Management
To ensure that the !kill and !restart commands work seamlessly, you can use PM2, a process manager for Node.js applications. PM2 allows you to run your bot as a
background process and provides easy commands to restart or stop it programmatically.

### Install PM2

1. Install PM2 globally using npm:

   npm install -g pm2

2. Verify the installation:

  pm2 --version


## Start the Bot with PM2

Start your bot using PM2:

pm2 start index.js --name "DJ-Chang-Bot"



## How It Works

### Node.js Features:
The bot is primarily built using **Node.js** with the following key libraries:
- **discord.js**: For interacting with the Discord API.
- **@discordjs/voice**: For handling voice connections and audio playback.

### Python Integration:
The bot uses a Python script (`extract_thumbnail.py`) to extract song thumbnails dynamically. This script is executed via Node.js using the `child_process` module.

---

## Contributing

1. Fork this repository.
2. Create a new branch for your feature or bug fix:

git checkout -b feature-name

3. Commit your changes and push them to GitHub:

git push origin feature-name

4. Open a pull request to merge your changes.

---

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial-NoDerivatives (CC BY-NC-ND)** License. See the [LICENSE](LICENSE) file for details.

---

## Troubleshooting

### Common Issues:

1. **Bot not responding to commands**:
- Ensure you have deployed slash commands using `node deploy-commands.js`.
- Verify that your bot has the necessary permissions in your Discord server.

2. **Audio playback issues**:
- Ensure FFmpeg is installed and accessible in your system's PATH.
  
---

Enjoy using DJ Chang! 🎵 Let me know if you encounter any issues or have suggestions for improvements.




