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
 
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const webAppUrl = WEB_APP_URL;

  try {
    await bot.sendMessage(chatId, 'Ласкаво просимо до гри "Вгадай число"! Відкрийте гру в WebView:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Почати гру', web_app: { url: webAppUrl } }]
        ]
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
});

let secretNumber = 0;

app.post('/start_game', (req, res) => {
  try {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    res.status(200).send({ message: 'Гру почато!' });
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).send({ message: 'Сталася помилка при запуску гри' });
  }
});

app.post('/guess', (req, res) => {
  try {
    const { number } = req.body;

    if(!number) {
      return res.status(500).send({message: 'Щось пішло не так'})
    }

    if (number == secretNumber) {
      return res.status(200).send({ message: 'Число вгадано' });
    } 
    
    if (number < secretNumber) {
      return res.status(200).send({ message: 'Загадане число більше' });
    } 

    if (number > secretNumber) {
      return res.status(200).send({ message: 'Загадане число меньше' });
    }
  } catch {
    console.error('Error processing guess:', error);
    res.status(500).send({ message: 'Сталася помилка при обробці запиту' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
