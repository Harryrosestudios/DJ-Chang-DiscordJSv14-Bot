const { exec } = require('child_process');
const config = require('../config.json');

module.exports = {
    name: 'restart',
    description: 'Restart the bot (Admin only)',
    adminOnly: true,
    execute(message) {
        if (message.author.id !== config.adminId) {
            return message.reply('❌ You do not have permission to use this command.');
        }

        exec('pm2 restart DJ-Chang', (error) => {
            if (error) {
                console.error(`Restart error: ${error}`);
                return message.reply('❌ Failed to restart bot');
            }
            message.reply('🔁 Bot restarting...');
        });
    }
};
