var allweather    = require("./allweather"),
	calculate  = require("./calculate"),
	formatDate = require('../formatdate'),
    interval   = 5,
    lastWeather,
    lastCalc;

function start(COLLECTION){
	var func = function() {
			var date    = formatDate.getNowDate(),
                day     = date.getDate(),
				hours   = date.getHours(),
				minutes = date.getMinutes();

			if(lastWeather !== hours) {
                lastWeather = hours;
                allweather.getAllWeather(null, COLLECTION);
            }

			if(hours == 23 && lastCalc !== day) {
                lastCalc = day;
                calculate.calc(null, COLLECTION);
            }
		};

	setInterval(func, interval*60000); // 5 мин = 300 000
}

exports.start = start;
