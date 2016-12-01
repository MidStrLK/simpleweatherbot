var actual      = require("./actual"),
    hourly      = require("./hourly"),
    TelegramBot = require('node-telegram-bot-api'),
    token       = '242894983:AAFE8XZQhBSFtQV8OEDPGY4HV_W6WZBDWz4',
    botOptions  = {
        polling: true
    };


exports.start = start;

function start() {
    var bot = new TelegramBot(token, botOptions),
        intervalID = 0;

    bot['getMe']().then(function (me) {
        console.log('NAME - %s, ID - %s, USER - %s', me['first_name'], me['id'], me['userame']);
    });

    bot.on('text', function (msg) {

        console.info('msg - ',msg);

        var messageChatId = msg['chat'].id;
        var messageText = msg.text;
        var messageDate = msg.date;
        var messageUsr = msg.from['username'];

        if (messageText === '/now') {
            actual.getActual(sendMessageByBot, messageChatId);
        }else if (messageText === '/day') {
            hourly.getHourly(sendMessageByBot, messageChatId);
        }else if (messageText.indexOf('/spam') !== -1) {

            var i = 1,
                interval = parseInt(messageText.substr(6));

            if(!interval) interval = 60;

            intervalID = setInterval(function(){

                var msgSpam = '[' + i + '] : ' + messageChatId;

                sendMessageByBot(messageChatId, msgSpam);
            }, interval*60*1000);
        }else if (messageText === '/stop') {
            clearInterval(intervalID);
        }
    });


    function sendMessageByBot(aChatId, aMessage) {
        bot['sendMessage'](aChatId, aMessage, {caption: 'I\'m a cute bot!'});
    }

}