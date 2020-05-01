const database = require('./database');
const helpers = require('./helpers');

const actions = (bot) => {
  bot.on('message', (msg) => {
    const { text } = msg;
    if (text === '/add') {
      bot.sendMessage(msg.chat.id, 'To add a new activity type \'/add the-activity-you-want-to-add\'👍');
    } else if (!/\/add (.+)/.test(text)) {
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
      bot.sendMessage(msg.chat.id, 'Cool, enjoy! - Send me a message if you need more ideas.🙂');
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
                text: 'Fun!👍',
                callback_data: 'accept_activity',
              },
            ]],
          },
        }));
    }
  });

  bot.onText(/\/add (.+)/, (msg, match) => {
    const submittedActivity = match[1];
    const response = helpers.validateActivity(submittedActivity);

    if (response.validated) {
      database.addToDatabase(response.activity);
    }
    bot.sendMessage(msg.chat.id, response.msg);
  });

  // eslint-disable-next-line no-console
  bot.on('polling_error', (err) => console.log(err));
};

module.exports.actions = actions;
