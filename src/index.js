
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const database = require('./database');

const bot = new TelegramBot(process.env.TOKEN, {
  polling: true,
});

bot.on('message', (msg) => {
  const { text } = msg;
  if (text === '/start' || text === '/bored') {
    bot.sendMessage(msg.chat.id, 'Bored?', {
      reply_markup: {
        inline_keyboard: [[
          {
            text: 'Yep...😒',
            callback_data: 'bored',
          },
        ]],
      },
    });
  }
});

bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  if (callbackQuery.data === 'accept_activity') {
    bot.sendMessage(msg.chat.id, "Cool, enjoy! - Send me a '/bored' if you need more ideas.🙂");
  } else {
    bot.answerCallbackQuery(callbackQuery.id)
      .then(() => database.getRandomActivity())
      .then((randomActivity) => bot.sendMessage(msg.chat.id, `${randomActivity}!`, {
        reply_markup: {
          inline_keyboard: [[
            {
              text: 'Meh...👎',
              callback_data: 'decline_activity',
            },
            {
              text: 'Sounds fun!👍',
              callback_data: 'accept_activity',
            },
          ]],
        },
      }));
  }
});

bot.onText(/\/add (.+)/, (msg, match) => {
  const activity = match[1];
  database.addToDatabase(activity);
  bot.sendMessage(msg.chat.id, ` Thanks, '${activity}' will be added to our database!😎`);
});

// eslint-disable-next-line no-console
bot.on('polling_error', (err) => console.log(err));
