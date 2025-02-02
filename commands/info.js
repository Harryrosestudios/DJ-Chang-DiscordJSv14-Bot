const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: 'info',
    description: 'Displays information about DJ Chang bot.',
    async execute(interaction) {
        // Fetch the bot's profile picture
        const botUser = interaction.client.user;
        const botAvatarURL = botUser.displayAvatarURL();

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle(`DJ Chang V${config.version}`) // Use version from config.json
            .setThumbnail(botAvatarURL) // Use bot's profile picture as thumbnail
            .setColor(0x1DB954) // Spotify-like green color
            .setDescription(`
**About the Bot:**
The bot is a custom Discord bot built with JavaScript. It works by automatically downloading songs added to Omni's YouTube playlist. The bot watches the playlist and downloads any added songs, making it independent from the permanent uptime of any APIs.

**Getting Started:**
Use \`/help\` to get started.

**Links:**
- [Download Eternum](https://caribdis.itch.io/eternum)
- [Listen to Omni's Playlist](https://www.youtube.com/playlist?list=PLSjFmFIO-Pcy0iLaVNJDDaTYzUYiCO9F-)
- [GitHub](https://github.com/Harryrosestudios/DJ-Chang-DiscordJSv14-Bot)
- [See The Dev's Other Projects](https://hrdd.tech)

**Call for Artists:**
If you are an artist or have experience in rendering/modeling and would like to help create DJ Chang's profile picture and banner, please contact **@harrybo**.
            `)
            .setFooter({
                text: `DJ CHANG V${config.version} | SOURCE PLAYLIST: Eternum Soundtrack (0.8) | Playlist Creator: @omniscientarchivist_ | Developer: @harrybo`,
                iconURL: botAvatarURL,
            });

        // Send the embed as a reply
        await interaction.reply({ embeds: [embed] });
    },
};