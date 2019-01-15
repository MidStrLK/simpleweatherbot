var manifest 	= require("../manifest"),
	request  	= require("request"),
	cheerio  	= require("cheerio"),
	utf8     	= require('utf8'),
	clearstr    = require('./clearstr');

/* передача на сервер функции */
module.exports = getWeather;


/* Запрашивает почасовой прогноз и отправляет обратно */
function getWeather(callback, type, botId){

    var requestArray = getRequestArray(type);

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

/* ПОЛУЧИТЬ СПИСОК САЙТОВ */
function getRequestArray(type){
    var res = [];

    if(manifest[type]){
        res = manifest[type];
    }else{
        for(var key in manifest.list) {
            if (manifest.list[key][type]){
                var params = manifest.list[key][type];
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

        if(!values || !$ || typeof $ !== 'function'){
            callback();
        }else{
            callback(createResponse($, values));
        }

        //findParameter($, values, callback);
    });
}

function createResponse($, values){
    var result = {
        name: values.name
    };

    for(var key in values){
        if(key && key !== 'url' && key !== 'name' && values[key] !== 'dayTime'){
            result[key] = getValue($,key, values[key])
        }

    }

    result = removeArray(result);

    if(values.time && values.time === 'dayTime'){
        result = cutDayTime(result);
    }

    if(result.time && result.time.forEach){
        result.view = createView(result);
    }

    return result;
}

function createView(data){
    var result = [];

    data.time.forEach(function(val, key){
        result[val] = {
            temp: data.temp[key],
            text: data.text[key]
        }
    });

    return result;
}

function cutDayTime(data){
    for(var key in data){
        if(data[key] && data[key].forEach && data[key].length > 4){
            data[key].length = 4;
        }
    }

    data['time'] = [9,12,15,19];

    return data;
}

function removeArray(data){
    var isOnce = true;

    for(var key in data){
        if(data[key] && data[key].forEach && data[key].length > 1){
            isOnce = false;
        }
    }

    if(isOnce){
        for(var i in data){
            if(data[i] && data[i].forEach){
                data[i] = data[i][0];
            }
        }
    }

    return data;
}

function getValue($,key, value){
    var result = [];

    if($(value) && $(value)['each']){
        $(value)['each'](function() {
            var link = $(this);
            result.push(link.text());
        });
    }

    return result;
}

/* Ищет параметры для каждого случая */
function findParameter($, values, callback){
console.info('values - ',values);
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