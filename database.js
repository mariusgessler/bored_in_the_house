require('dotenv').config();
const firebase = require('firebase');
const axios = require('axios');
const helpers = require('./helpers');


firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
});

const ref = firebase.database().ref('activities');
const key = `${ref.toString()}.json`;

const getRandomActivity = () => axios.get(key)
  .then((res) => {
    const activities = Object.values(res.data).map((Object.values));
    return activities;
  })
  .then((activities) => {
    const randomActivity = helpers.random(activities);
    return randomActivity;
  });

const addToDatabase = (activity) => {
  ref.push({
    activity,
  });
};

module.exports = {
  getRandomActivity,
  addToDatabase,
};
