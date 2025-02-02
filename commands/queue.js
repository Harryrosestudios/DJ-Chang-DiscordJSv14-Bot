module.exports = {
    name: 'queue',
    description: 'Move a specified song to the next position in the queue.',
    options: [
        {
            name: 'song',
            type: 3, // STRING
            description: 'The name of the song to move next in the queue.',
            required: true,
        },
    ],
    async execute(interaction) {
        const songName = interaction.options.getString('song');
        const queue = interaction.client.queue;

        if (!queue || queue.length === 0) {
            return interaction.reply('The queue is empty.');
        }

        const songIndex = queue.findIndex(song => song.name.toLowerCase() === songName.toLowerCase());
        if (songIndex === -1) {
            return interaction.reply(`The song "${songName}" is not in the queue.`);
        }

        const [song] = queue.splice(songIndex, 1);
        queue.splice(1, 0, song); // Move it to position 1 (next in queue)

        await interaction.reply(`Moved **${song.name}** to next in the queue.`);
    },
};
