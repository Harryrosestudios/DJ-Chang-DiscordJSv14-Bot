module.exports = {
    name: 'pause',
    description: 'Pause the currently playing song.',
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const serverQueue = interaction.client.queue.get(guildId);

        if (!serverQueue || !serverQueue.audioPlayer) {
            return interaction.reply('No song is currently playing.');
        }

        if (serverQueue.audioPlayer.state.status === 'playing') {
            serverQueue.audioPlayer.pause();
            interaction.client.updateBotStatus(); // Explicit status update
            return interaction.reply('Paused the music!');
        } else {
            return interaction.reply('The music is already paused. Use `/resume` to resume.');
        }
    },
};
