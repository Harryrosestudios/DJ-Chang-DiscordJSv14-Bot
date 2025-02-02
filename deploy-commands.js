const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Load configuration from config.json
const config = require('./config.json');

// Validate required configuration
if (!config.token || !config.clientId || !config.guildId) {
    console.error('Error: Missing required fields in config.json. Ensure token, clientId, and guildId are present.');
    process.exit(1);
}

// Read all command files from the "commands" folder
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ('name' in command && 'description' in command) {
        commands.push({
            name: command.name,
            description: command.description,
            options: command.options || [],
        });
    } else {
        console.warn(`Skipping ${file}: Missing "name" or "description".`);
    }
}

// Create REST instance
const rest = new REST({ version: '10' }).setToken(config.token);

// Deploy commands to specific guild
(async () => {
    try {
        console.log(`Starting deployment of ${commands.length} commands to guild ${config.guildId}...`);

        const data = await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands }
        );

        console.log(`✅ Successfully deployed ${data.length} commands to guild ${config.guildId}`);
        console.log('Available commands:');
        data.forEach(command => console.log(`- ${command.name}: ${command.description}`));
        
    } catch (error) {
        console.error('❌ Deployment failed:');
        console.error(error);
    }
})();
