var actual      = require("./node/actual"),
    TelegramBot = require('node-telegram-bot-api'),
    token       = '242894983:AAFE8XZQhBSFtQV8OEDPGY4HV_W6WZBDWz4',
    botOptions  = {
        polling: true
    };


exports.start = start;

function start() {
    var bot = new TelegramBot(token, botOptions);

    bot.getMe().then(function (me) {
        console.log('NAME - %s, ID - %s, USER - %s', me.first_name, me.id, me.userame);
    });

    bot.on('text', function (msg) {
        var messageChatId = msg.chat.id;
        var messageText = msg.text;
        var messageDate = msg.date;
        var messageUsr = msg.from.username;

        if (messageText === '/a') {
            actual.getActual(sendMessageByBot, messageChatId);
            //sendMessageByBot(messageChatId, 'Hello World!');
        }
        console.log(msg);
    });


    function sendMessageByBot(aChatId, aMessage) {
        bot.sendMessage(aChatId, aMessage, {caption: 'I\'m a cute bot!'});
    }

}