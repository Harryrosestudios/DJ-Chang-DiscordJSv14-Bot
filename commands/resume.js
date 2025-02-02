module.exports = {
    name: 'resume',
    description: 'Resume the paused song.',
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const serverQueue = interaction.client.queue.get(guildId);

        if (!serverQueue || !serverQueue.audioPlayer) {
            return interaction.reply('No song is currently paused.');
        }

        if (serverQueue.audioPlayer.state.status === 'paused') {
            serverQueue.audioPlayer.unpause();
            interaction.client.updateBotStatus(); // Explicit status update (broken)
            return interaction.reply('Resumed the music!');
        } else {
            return interaction.reply('The music is not paused.');
        }
    },
};
