const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');
const lines = require('../lines.json'); 

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

        serverQueue.audioPlayer.stop();

        const embed = new EmbedBuilder()
            .setTitle(getRandomLine('skip')) 
            .setThumbnail('attachment://changsad.png'); 


        const attachment = new AttachmentBuilder(path.join(__dirname, '../changsad.png'), { name: 'changsad.png' });

        return interaction.reply({
            embeds: [embed],
            files: [attachment],
        });
    },
};
