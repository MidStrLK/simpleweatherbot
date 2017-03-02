var manifest 	= require("../manifest"),
    request  	= require("request"),
    cheerio  	= require("cheerio"),
    utf8     	= require('utf8');

exports.getForecast = getForecast;

function getForecast(callback, botId){
    if(!manifest || !manifest.list) return;

    var requestArray = [];

    for(var key in manifest.list) {
        requestArray = requestArray.concat(getRequestData(manifest.list[key]));
    }

    var responseArray = [],
        length = 0,
        responseArrayLength = 0,
        func = function(data){

            responseArray = responseArray.concat(data);
            responseArrayLength++;

            if(responseArrayLength !== length) return;

            if(botId){
                callback(botId, prepareForBot(responseArray));
            }else{
                if(callback) callback(0, manageForSite(responseArray));
            }

        };

    requestArray.forEach(function(val){
        for(var key in val.params){
            length++;
        }
    });

    requestArray.forEach(function(val){
        submitRequest(val, func);
    });
}

/* Получаем данные для отправки запроса */
function getRequestData(data){
    var params = data.params,
        name = data.name,
        periodic = data.periodic,
        res = [];

    if(data.url){
        res.push({
            url:data.url,
            params: params,
            inc: data.firstNumber,
            name: name,
            periodic: periodic
        });
    }else if(params['forEach']){
        params['forEach'](function(Pval){
            res.push({
                url:Pval.url,
                params: Pval.params,
                firstNumber: Pval.firstNumber,
                name: name,
                periodic: periodic
            });
        })
    }

    return res;
}


/* Запрос данных с сайта */
function submitRequest(values, callback){
    request({
        uri: values.url
    }, function(error, response, body) {
        var $ = cheerio.load(body);

        for(var key in values.params){
            findParameter($, values.params[key], key, values.name, values.firstNumber, values.periodic, callback)
        }
    });
}

/* Ищет параметры для каждого случая */
function findParameter($, tag, key, name, firstNumber, periodic, callback){
    var intArr = [],
        resArr = [],
        daynum = firstNumber || 0;
    
    if(!$(tag)) return;

    $(tag).each(function() {
        var link = $(this);
        var text = link.text().replace(/<span>.*<\/span>/g,'').replace('Мин', '');

        /* Для Гисметео, которые вставляют температуру в атрибут */
        if(!text && link.attr && (link.attr('data-max') || link.attr('data-min'))){
            if(link.attr('data-min')) {
                //text += link.attr('data-min');
                intArr.push(link.attr('data-min'));
            }

            if(link.attr('data-max')) {
                //text = link.attr('data-max');
                intArr.push(link.attr('data-max'));
            }

        }else{
            text = (key.indexOf('temp') !== -1) ? parseInt(text.replace(/'/g, '').replace(/"/g, '').replace(/−/g, '-')) : text;
            intArr.push(text);
        }



    });

    intArr['forEach'](function (val, num) {

        if(periodic && periodic === 'odd' && (key.indexOf('day') !== -1) && num%2 === 0) return;

        if(periodic && periodic === 'double' && key === 'day_temp' && num%2 !== 0){
            resArr[resArr.length-1].value += '...' + val;
        }else{
            resArr.push({
                name: name,
                key: key,
                afterday: daynum,
                value: val
            });

            daynum = daynum + 1;
        }



    });


    callback(resArr);
}

function prepareForBot(data){
    if(!data || !data.forEach) return;
    var res = [];
    data.forEach(function(val){
        /* val === { name: 'gismeteo',
         *           key: 'day_text',
         *           afterday: 3,
         *           value: 'Пасмурно, небольшой снег'}
         */
        if(val.afterday > 10) return;

        if(!res[val.afterday]) res[val.afterday] = {};

        if(!res[val.afterday][val.name]) res[val.afterday][val.name] = {};

        if(val.key === 'day_text') res[val.afterday][val.name]['text'] = val.value.trim();
        if(val.key === 'day_temp') res[val.afterday][val.name]['temp'] = val.value;
    });


    var resString = '',
        date = new Date(),
        formatDate = function(increment){
            var incDate = new Date(),
                month = incDate.getMonth() + 1;
            incDate.setDate(date.getDate() + increment);
            if(month < 10) month = '0' + String(month);
            return incDate.getDate() + '.' + month + ', ' + ["Воскресение", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"][incDate.getDay()];
        };

    res.forEach(function(resval, reskey){
        resString += formatDate(reskey) + '\n';
        for( var key in resval){
            resString += key + ': ' + resval[key]['temp'] + ', ' + resval[key]['text'] + '\n';
        }
        resString += '\n';
    });

    return resString;
}

function manageForSite(data){
    if(!data || !data.forEach) return;

    var res = {};
    data.forEach(function(val){

        if(val.afterday > 10) return;

        if(!res[val.name]) res[val.name] = {name: val.name};
        if(!res[val.name][val.afterday]) res[val.name][val.afterday] = {};

        res[val.name][val.afterday][val.key.substr(4)] = val.value;

    });

    return res;
}