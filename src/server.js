const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

let secretNumber = 0;

app.post('/start_game', (req, res) => {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  console.log(secretNumber)
  res.send({ message: 'Гру почато!' });
});

app.post('/guess', (req, res) => {
  const { number } = req.body;

  if(!secretNumber) {
    return res.send({message: 'Спочатку почныть гру'})
  }

  if(!number) {
    return res.send({message: 'Щось пішло не так'})
  }

  if (number == secretNumber) {
    secretNumber = 0;
    return res.send({ message: 'Число вгадано' });
  }
  
  if (number < secretNumber) {
    return res.send({ message: 'Загадане число більше' });
  }

  if (number > secretNumber) {
    return res.send({ message: 'Загадане число меньше' });
  }
});

app.listen(5000, () => {
  console.log('Сервер запущено на порту 5000');
});
