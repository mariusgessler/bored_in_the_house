require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TOKEN, {
    polling: true,
});

// On /start, send activity
// On 👎 send next random activity

// On /add add new activity