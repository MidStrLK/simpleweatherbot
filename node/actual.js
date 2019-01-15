var manifest 	= require("../manifest"),
	request  	= require("request"),
	cheerio  	= require("cheerio"),
	utf8     	= require('utf8'),
	clearstr    = require('./clearstr');

/* передача на сервер функции */
exports.getActual = getActual;


/* Запрашивает почасовой прогноз и отправляет обратно */
function getActual(callback, botId){
    if(!manifest || !manifest.list) return;

    var requestArray = getRequestArray();
    console.info('requestArray - ',requestArray);

    var responseArray = [],
        index = 0,
        func = function(data){
            index++;
            if(data) responseArray.push(data);

            if(index !== requestArray.length) return;

            if(botId && callback){
                callback(botId, prepareForBot(responseArray));
            }else{
                callback(0, responseArray);
            }
    };

    requestArray.forEach(function(val){
        submitRequest(val, func);
    });
}

function getRequestArray(){
    var res = [];

    if(manifest.actual){
        res = manifest.actual;
    }else{
        for(var key in manifest.list) {
            if (manifest.list[key].actual){
                var params = manifest.list[key].actual;
                res.push({
                    url:  params.url,
                    name: manifest.list[key].name,
                    temp: params.temp,
                    text: params.text
                })
            }
        }
    }



    return res;
}

/* Переводит текст для бота */
function prepareForBot(data){
    if(!data || !(data instanceof Array)) return false;

    var res = '';
    data.forEach(function(val){
        res += val.name + ': ' + val.temp + ', ' + val.text + '\n';
    });

    return res;
}

/* Запрос данных с сайта */
function submitRequest(values, callback){

    request({
        uri: values.url
    }, function(error, response, body) {
        var $;
        if(body) $ = cheerio.load(body);

        findParameter($, values, callback);
    });
}

/* Ищет параметры для каждого случая */
function findParameter($, values, callback){

    var result = {name: values.name};

    if(!values || !$ || typeof $ !== 'function') callback();

    if(values.temp && $(values.temp) && $(values.temp).each){
        $(values.temp).each(function(key) {
            var link = $(this);
            result['temp'] = link.text();
        });
    }

    result['temp'] = clearstr.clearTemp(result['temp']);

    if(values.text && $(values.text) && $(values.text).each){
        $(values.text).each(function(key) {
            var link = $(this);
            result['text'] = link.text();
        });
    }

    callback(result);
}