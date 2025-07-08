const Telegram_Api = require('node-telegram-bot-api')

const token = '7597104065:AAGNUru4VQ1ASJnBeK-g3ryNXBRep1TKioA'

const bot = new Telegram_Api(token, {polling: true})

const {gameOptions, againOptions , guessOptions} = require('./options') 

const chats = {}
const numFind = {}


const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Bot is alive'));
app.listen(process.env.PORT || 3000);




const startGame = async (chatId) =>{
    await bot.sendMessage(chatId , 'Сейчас я загадаю число а ты найди');
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId , 'отгадывай' , gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: 'start', description: 'Начальное приветствие'},
        {command: 'info', description: 'Информация, что делает бот'},
        {command: 'game', description: 'Отгадай число'},
        {command: 'findNumber', description: 'Угадаю число за 10 вопросов'},
    ])

    
    bot.on('message' , async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if(text === '/start'){
           await bot.sendSticker(chatId , 'https://cdn2.combot.org/programmer_xd/webp/1xf09f8e97.webp');
           return bot.sendMessage(chatId, 'Fuck you');
        }
        if(text === '/game'){
            return startGame(chatId);
        }
        if(text === '/findNumber'){
            numFind[chatId] = {l: 1 , r : 1000};
            const mid  = Math.floor((1 + 1000) / 2);
            await bot.sendMessage(chatId , 'Я буду загодать ваше число за 10 попыток выбери число от 1 до 1000');
            numFind[chatId].mid = mid;
            return bot.sendMessage(chatId , `Это ${mid}`, guessOptions);

            

        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `
            Я умею:
            - 🎯 /game — Я загадаю число от 0 до 9, попробуй угадать!
            - 🧠 /findNumber — Ты загадай число от 1 до 1000, я попробую угадать.
            `);
        }

    })
}
bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    // --- Игра: пользователь угадывает число ---
    if (data === '/again') {
        return startGame(chatId);
    }

    if (chats[chatId] !== undefined) {
        const correct = chats[chatId];
        if (data == correct) {
            delete chats[chatId];
            return bot.sendMessage(chatId, `Ты угадал! Это число: ${correct}`, againOptions);
        } else if (data !== correct && data !== 'more' && data !== 'less' && data !== 'equal') {
            delete chats[chatId];
            return bot.sendMessage(chatId, `ЛОХ, это было число: ${correct}`, againOptions);
        }
    }

    // --- Игра: бот угадывает число ---
    if (numFind[chatId]) {
        let { l, r, mid } = numFind[chatId];
        if (data === 'less') {
            r = mid - 1;
        } else if (data === 'more') {
            l = mid + 1;
        } else if (data === 'equal') {
            delete numFind[chatId];
            return bot.sendMessage(chatId, `Ура! Я угадал число: ${mid}`);
        }

        if (l > r) {
            delete numFind[chatId];
            return bot.sendMessage(chatId, `Ты обманул 😡`);
        }

        mid = Math.floor((l + r) / 2);
        numFind[chatId] = { l, r, mid };
        return bot.sendMessage(chatId, `Это ${mid}?`, guessOptions);
    }

    return bot.sendMessage(chatId, 'Не понял, что ты выбрал 🤔');
});


start()