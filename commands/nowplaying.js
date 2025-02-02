const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const lines = require('../lines.json'); // Importing lines.json

// Helper function to get a random line from lines.json
function getRandomLine(section, songName) {
    const sectionLines = lines[section];
    if (!sectionLines || !sectionLines.length) return `Now Playing: ${songName}`;
    const randomLine = sectionLines[Math.floor(Math.random() * sectionLines.length)];
    return randomLine.replace(/\[SONG\]/g, songName);
}

module.exports = {
    name: 'nowplaying',
    description: 'Get information about the currently playing song.',
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const serverQueue = interaction.client.queue.get(guildId);

        if (!serverQueue || !serverQueue.currentSong) {
            return interaction.reply('No song is currently playing.');
        }

        const songPath = serverQueue.currentSong.path;
        const thumbnailPath = path.join(__dirname, '../thumbnails', `${serverQueue.currentSong.name}.jpg`);
        const songName = serverQueue.currentSong.name;

        // Extract thumbnail using the Python script
        exec(`python3 extract_thumbnail.py "${songPath}" "${thumbnailPath}"`, (error) => {
            const hasThumbnail = !error && fs.existsSync(thumbnailPath);
            const attachment = hasThumbnail ? 
                new AttachmentBuilder(thumbnailPath, { name: 'thumbnail.jpg' }) : 
                null;

            const embed = new EmbedBuilder()
                .setTitle(`Now Playing: ${songName}`) // Updated header format
                .setDescription(getRandomLine('now_playing', songName)) // Using "now_playing" section from lines.json
                .setColor(0x1DB954)
                .setFooter({ text: 'Enjoy your music!' });

            if (attachment) {
                embed.setThumbnail('attachment://thumbnail.jpg');
            }

            interaction.reply({
                embeds: [embed],
                files: attachment ? [attachment] : []
            });
        });
    },
};
