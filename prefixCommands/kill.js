const { exec } = require('child_process');
const config = require('../config.json');

module.exports = {
    name: 'kill',
    description: 'Stop the bot process (Admin only)',
    adminOnly: true,
    execute(message) {
        if (message.author.id !== config.adminId) {
            return message.reply('❌ You do not have permission to use this command.');
        }

        exec('pm2 stop DJ-Chang', (error) => {
            if (error) {
                console.error(`Kill error: ${error}`);
                return message.reply('❌ Failed to stop bot process');
            }
            message.reply('🛑 Bot process stopped successfully');
        });
    }
};
