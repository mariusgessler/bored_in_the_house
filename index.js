
const firebase = require('firebase');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const helpers = require('./helpers');
// const bot = require('./bot');
require('dotenv').config();

const bot = new TelegramBot(process.env.TOKEN, {
  polling: true,
});

// Initialize Firebase
const app = firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
});

const ref = firebase.database().ref('activities');
const key = ref.toString() + '.json';

const getData = () => {
  return axios.get(key)
  .then((res) => {
     activities = Object.values(res.data).map((Object.values)); 
     return activities;
  });
};

const getRandomActivity = () => {
  return getData().then((activities) => {
    const randomActivity = helpers.random(activities);
    return randomActivity;
  })
}



bot.on('message' , (msg) => {
  const text = msg.text;
  if (text === '/start' || text === '/bored') {
    bot.sendMessage(msg.chat.id, "Bored?", {
      reply_markup: {
        inline_keyboard: [[
          {
            text: 'Yep...😒',
            callback_data: 'bored',
          }
        ]]
      }
    })
  }
})

bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  if (callbackQuery.data === 'accept_activity') {
    bot.sendMessage(msg.chat.id, "Cool, have fun! - Send me a '/bored' if you need more ideas.🙂")
  } else {
    bot.answerCallbackQuery(callbackQuery.id)
    .then(() => getRandomActivity())
    .then((randomActivity) => bot.sendMessage(msg.chat.id, `Something you could do: ${randomActivity} 🤔`, {
      reply_markup: {
        inline_keyboard: [[
          {
            text: 'Meh...👎',
            callback_data: 'decline_activity',
          },
          {
            text: 'Sounds fun!👍',
            callback_data: 'accept_activity',
          }
        ]]
      }
    }))
  }
});

bot.onText(/\/add (.+)/, (msg, match) => {
  const activity = match[1];
  console.log(activity)
  ref.push({
    activity: activity,
  })
  bot.sendMessage(msg.chat.id, ` Thanks, '${activity}' will be added to our database!😎`, 
)
})

bot.on("polling_error", (err) => console.log(err));
