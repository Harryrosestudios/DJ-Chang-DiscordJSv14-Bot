const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');
const lines = require('../lines.json'); // Importing lines.json

// Helper function to get a random line from lines.json
function getRandomLine(section) {
    const sectionLines = lines[section];
    if (!sectionLines || !sectionLines.length) return 'Skipped!';
    return sectionLines[Math.floor(Math.random() * sectionLines.length)];
}

module.exports = {
    name: 'skip',
    description: 'Skip the currently playing song.',
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const serverQueue = interaction.client.queue.get(guildId);

        if (!serverQueue || !serverQueue.songs.length) {
            return interaction.reply('There are no songs in the queue to skip.');
        }

        // Stop current playback
        serverQueue.audioPlayer.stop();

        // Create an embed with a random line from the "skip" section
        const embed = new EmbedBuilder()
            .setTitle(getRandomLine('skip')) // Random line from "skip" section
            .setColor(0x1DB954)
            .setThumbnail('attachment://changsad.png'); // Reference the attached image


        // Attach changsad.png as a file
        const attachment = new AttachmentBuilder(path.join(__dirname, '../changsad.png'), { name: 'changsad.png' });

        // Send the embed with the attachment
        return interaction.reply({
            embeds: [embed],
            files: [attachment],
        });
    },
};
