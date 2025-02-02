const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name: 'stop',
    description: 'Stop the music and leave the voice channel.',
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const serverQueue = interaction.client.queue.get(guildId);

        if (!serverQueue || !serverQueue.connection) {
            return interaction.reply('The bot is not connected to any voice channel.');
        }

        // Stop the audio player and destroy the connection
        serverQueue.audioPlayer.stop();
        serverQueue.connection.destroy();

        // Clear the queue and delete the guild's queue entry
        interaction.client.queue.delete(guildId);

        // Update bot status to "Idle"
        interaction.client.updateBotStatus();

        return interaction.reply('Stopped playback and disconnected from the voice channel.');
    },
};
