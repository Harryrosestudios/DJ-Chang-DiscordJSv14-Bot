const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Needed for prefix commands
    ],
});

// Shared state for the bot
client.commands = new Collection();
client.prefixCommands = new Collection(); // For prefix commands
client.queue = new Map(); // Tracks queues for each guild

// Load slash commands dynamically
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Load prefix commands dynamically
const prefixCommandFiles = fs.readdirSync('./prefixCommands').filter(file => file.endsWith('.js'));
for (const file of prefixCommandFiles) {
    const command = require(`./prefixCommands/${file}`);
    client.prefixCommands.set(command.name, command);
}

// Update bot status dynamically (Broken)
function updateBotStatus() {
    const activeQueue = [...client.queue.values()].find(q => q.currentSong);
    if (activeQueue?.currentSong) {
        client.user.setActivity(`Playing: ${activeQueue.currentSong.name}`, { type: 'LISTENING' });
    } else {
        client.user.setActivity('To DJ Chang!', { type: 'LISTENING' });
    }
}

// Attach updateBotStatus to the client so it can be accessed globally (broken)
client.updateBotStatus = updateBotStatus;

// Play a song in the queue
function playSong(guildId) {
    const serverQueue = client.queue.get(guildId);

    if (!serverQueue || !serverQueue.songs.length) {
        if (serverQueue) {
            console.log(`No more songs in queue for guild ${guildId}. Disconnecting.`);
            serverQueue.connection.destroy();
            client.queue.delete(guildId);
        }
        client.updateBotStatus(); // Update status when playback stops
        return;
    }

    const song = serverQueue.songs[0];
    console.log(`Now playing "${song.name}" in guild ${guildId}.`);
    const resource = createAudioResource(song.path);

    serverQueue.audioPlayer.play(resource);
    serverQueue.connection.subscribe(serverQueue.audioPlayer);
    serverQueue.currentSong = song;
    client.updateBotStatus(); // Update status when a new song starts

    serverQueue.audioPlayer.once(AudioPlayerStatus.Idle, () => {
        console.log(`Finished playing "${song.name}" in guild ${guildId}.`);
        serverQueue.songs.shift();
        playSong(guildId);
    });

    serverQueue.audioPlayer.on('error', error => {
        console.error(`Error with audio player in guild ${guildId}:`, error);
        serverQueue.songs.shift(); // Skip the problematic song
        playSong(guildId); // Attempt to play the next song
    });
}

// Handle inactivity timeout
function setInactivityTimeout(guildId) {
    const serverQueue = client.queue.get(guildId);
    if (!serverQueue) return;

    clearTimeout(serverQueue.inactivityTimeout);
    serverQueue.inactivityTimeout = setTimeout(() => {
        if (serverQueue.audioPlayer.state.status !== AudioPlayerStatus.Playing) {
            console.log(`Inactivity timeout reached for guild ${guildId}. Disconnecting.`);
            serverQueue.connection.destroy();
            client.queue.delete(guildId);
            client.updateBotStatus();
        }
    }, config.inactivityTimeout); 
}

// Bot ready event
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.updateBotStatus(); // Initialize status
});

// Interaction handling for slash commands
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);

        // Update bot status after executing playback-related commands
        if (['play', 'pause', 'resume', 'skip', 'stop'].includes(interaction.commandName)) {
            client.updateBotStatus();
        }
    } catch (error) {
        console.error(`Error executing command "${interaction.commandName}":`, error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

// Prefix command handling
client.on('messageCreate', async message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.prefixCommands.get(commandName);

    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(`Error executing prefix command "${commandName}":`, error);
        message.reply('❌ There was an error executing that command.');
    }
});

// Prevent automatic joining of voice channels
client.on('voiceStateUpdate', (oldState, newState) => {
    // No-op to prevent auto-join
});

// Login to Discord
client.login(config.token);
