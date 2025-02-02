const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List all available commands.',
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Help - Available Commands')
            .setDescription('Here are all the commands you can use:')
            .addFields(
                { name: '/play [song]', value: 'Play a specific song or shuffle all songs.' },
                { name: '/pause', value: 'Pause song playback.' },
                { name: '/resume', value: 'resume song playback.' },
                { name: '/now playing', value: 'Get information about the currently playing song.' },
                { name: '/skip', value: 'Skip to the next track.' },
                { name: '/queue <song>', value: 'Move a specified song to next in the queue.' },
                { name: '/stop', value: 'Stops playback and leaves the voice channel.' },
                { name: '/info', value: 'Shows information on how the bot works and where it acquires its music from.' },
                { name: '/help', value: 'Show this help message.' }
            )
            .setColor(0x1DB954);

        await interaction.reply({ embeds: [embed] });
    },
};
