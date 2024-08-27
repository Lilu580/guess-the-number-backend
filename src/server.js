const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');

require('dotenv').config();
const {
  TELEGRAM_BOT_TOKEN,
  PORT,
  WEB_APP_URL
} = process.env

const app = express();
app.use(cors());
app.use(express.json());
 
const bot = new TelegramBot(`${TELEGRAM_BOT_TOKEN}`, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const webAppUrl = WEB_APP_URL;

  bot.sendMessage(chatId, 'Ласкаво просимо до гри "Вгадай число"! Відкрийте гру в WebView:', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Почати гру', web_app: { url: webAppUrl } }]
      ]
    }
  });
});

let secretNumber = 0;

app.post('/start_game', (req, res) => {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  res.send({ message: 'Гру почато!' });
});

app.post('/guess', (req, res) => {
  const { number } = req.body;
  if (number == secretNumber) {
    res.send({ message: 'Число вгадано' });
  } else if (number < secretNumber) {
    res.send({ message: 'Загадане число більше' });
  } else {
    res.send({ message: 'Загадане число меньше' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
