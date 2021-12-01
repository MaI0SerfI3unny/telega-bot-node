const TelegaBot = require("node-telegram-bot-api")
const debug = require('./helper.js')
const fs = require('fs')
const axios = require('axios').default;

const cms = "https://cms.kyrrex.com"
const token = "2147434349:AAEyhCORKzaHCP4i8YXw0HLeQTATyX5FayM"
const bot = new TelegaBot(token, {
  polling: {
    interval: 300,
    autoStart: true,
    params:{
      timeout: 10
    }
  }
})

console.log('<h1>Hello there</h1>'.replace( /(<([^>]+)>)/ig, ''));

bot.on("message", (msg) => {
  const {id} = msg.chat
//  console.log(msg);
if (msg.text.toLowerCase() === 'hello') {
  bot.sendMessage(id, "Hello " + msg.from.username)
}else {

}
})

bot.onText(/\/start/, msg => {
  const {id} = msg.chat
  bot.sendPhoto(id, fs.readFileSync(__dirname + '/bot.jpg'))
  bot.sendMessage(id, "Here you are!!!", {
    reply_markup: {
      inline_keyboard:[
        [
          {text: 'News',callback_data: '1'},
          {text: 'Random Number',callback_data: '2'}
        ]
      ]
    }})
})

bot.onText(/\/date/, msg => {
  const {id} = msg.chat

  bot.sendMessage(id, `${(new Date().getMonth() + 1)}:${new Date().getDate()}:${new Date().getFullYear()}`)
})


bot.on('callback_query', query => {
  const {data} = query

  if (data === '2') {
    bot.sendMessage(query.message.chat.id, Math.floor(Math.random()*1000))
  }else if(data === '1') {
    axios.get(cms+'/blogmedias?_sort=published_at:desc&_locale=en')
  .then((response) => {
    if (response.status === 200) {
    //  console.log(response.data);
      for (var i = 0; i < 5; i++) {
          bot.sendMessage(query.message.chat.id, response.data[i].Title, {
            reply_markup: {
              inline_keyboard:[
                [{text: 'Okay,what...', url: `https://kyrrex.com/blog/${response.data[i].slug}` }]
              ]
            }})
      }
    }
  })
  }

})
