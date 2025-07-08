const Telegram_Api = require('node-telegram-bot-api')

const token = '7597104065:AAGNUru4VQ1ASJnBeK-g3ryNXBRep1TKioA'

const bot = new Telegram_Api(token, {polling: true})

const {gameOptions, againOptions} = require('./options') 

const chats = {}


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
        {command:'/start', description :'Начальное приветьстствие '  },
        {command:'/info', description :'Информация что делаеть бот' },
        {command:'/game', description :'Отгадай число' },
    
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
    })
}
bot.on('callback_query' , msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if(data === '/again'){
        return startGame(chatId);
    }
    if(data == chats[chatId]){
        return bot.sendMessage(chatId , `Ты угадал это число ${chats[chatId]}`, againOptions);
    }
    else return bot.sendMessage(chatId , `ЛОх это было числ ${chats[chatId]}` , againOptions);
    
    
})

start()