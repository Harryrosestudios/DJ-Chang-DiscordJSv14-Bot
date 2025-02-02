const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const lines = require('../lines.json'); 

function getRandomLine(section, songName) {
    const sectionLines = lines[section];
    if (!sectionLines || !sectionLines.length) return `Now Playing: ${songName}`;
    const randomLine = sectionLines[Math.floor(Math.random() * sectionLines.length)];
    return randomLine.replace(/\[SONG\]/g, songName);
}

module.exports = {
    name: 'play',
    description: 'Play a song or shuffle the entire playlist.',
    options: [
        {
            name: 'song',
            type: 3, 
            description: 'The name of the song to play (optional).',
            required: false,
        },
    ],
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const queue = interaction.client.queue;
        const songName = interaction.options.getString('song');

        if (!interaction.member.voice.channel) {
            return interaction.reply('You need to be in a voice channel to play music!');
        }

        let serverQueue = queue.get(guildId);

        if (!serverQueue) {
            const queueConstruct = {
                textChannel: interaction.channel,
                voiceChannel: interaction.member.voice.channel,
                connection: null,
                songs: [],
                audioPlayer: createAudioPlayer(),
                currentSong: null,
            };

            queue.set(guildId, queueConstruct);
            serverQueue = queueConstruct;

            if (songName) {
                const songPath = path.join('./music', `${songName}.mp3`);
                if (!fs.existsSync(songPath)) {
                    queue.delete(guildId);
                    return interaction.reply(`The song "${songName}" does not exist.`);
                }
                serverQueue.songs.push({ name: songName, path: songPath });
            } else {
                const musicFolder = './music/';
                const files = fs.readdirSync(musicFolder).filter(file => file.endsWith('.mp3'));

                if (!files.length) {
                    queue.delete(guildId);
                    return interaction.reply('The music folder is empty!');
                }

                serverQueue.songs = files.map(file => ({
                    name: file.replace('.mp3', ''),
                    path: path.join(musicFolder, file),
                }));
                serverQueue.songs.sort(() => Math.random() - 0.5);
            }

            try {
                const connection = joinVoiceChannel({
                    channelId: serverQueue.voiceChannel.id,
                    guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });

                serverQueue.connection = connection;
                playSong(interaction.guild.id, interaction.client);

                // Display the embed for the first song
                return displayEmbed(interaction, serverQueue.songs[0]);
            } catch (error) {
                queue.delete(guildId);
                return interaction.reply('There was an error connecting to the voice channel.');
            }
        } else {
            if (songName) {
                const songPath = path.join('./music', `${songName}.mp3`);
                if (!fs.existsSync(songPath)) {
                    return interaction.reply(`The song "${songName}" does not exist.`);
                }
                serverQueue.songs.splice(1, 0, { name: songName, path: songPath });
                return interaction.reply(`**${songName}** added as the next song in the queue.`);
            } else {
                return interaction.reply('A playlist is already playing. Use `/queue` to add more songs.');
            }
        }
    },
};

function playSong(guildId, client) {
    const serverQueue = client.queue.get(guildId);

    if (!serverQueue || !serverQueue.songs.length) {
        if (serverQueue) {
            serverQueue.connection.destroy();
            client.queue.delete(guildId);
        }
        client.updateBotStatus(); // Update status via client object (broken)
        return;
    }

    const song = serverQueue.songs[0];

    try {
        const resource = createAudioResource(song.path);
        serverQueue.audioPlayer.play(resource);
        serverQueue.connection.subscribe(serverQueue.audioPlayer);
        serverQueue.currentSong = song;
        client.updateBotStatus(); // Update status via client object (broken)

        serverQueue.audioPlayer.once(AudioPlayerStatus.Idle, () => {
            serverQueue.songs.shift();
            playSong(guildId, client); // Pass client recursively
        });
    } catch (error) {
        serverQueue.songs.shift();
        playSong(guildId, client);
    }
}

async function displayEmbed(interaction, currentSong) {
    const songPath = currentSong.path;
    const thumbnailPath = path.join(__dirname, '../thumbnails', `${currentSong.name}.jpg`);
    const songName = currentSong.name;

    // Extract thumbnail using Python script
    exec(`python3 extract_thumbnail.py "${songPath}" "${thumbnailPath}"`, (error) => {
        const hasThumbnail = !error && fs.existsSync(thumbnailPath);
        const attachment = hasThumbnail ? 
            new AttachmentBuilder(thumbnailPath, { name: 'thumbnail.jpg' }) : 
            null;

        const embed = new EmbedBuilder()
            .setTitle(`Now Playing: ${songName}`) 
            .setDescription(getRandomLine('new_song', songName))
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
}
