exports.list = [
	/* YANDEX */
	{
		name: 'yandex',
		url: "http://yandex.ru/pogoda/moscow",
		params: {
			 now_text: '.current-weather__comment'
			,now_temp: '.current-weather__thermometer.current-weather__thermometer_type_now'
			,now_img:  '.current-weather__col_type_now'
			,day_text: '.forecast-brief__item-comment'
			,day_temp: '.forecast-brief__item-temp-day'
			//,day_temp_night: '.forecast-brief__item-temp-night'
		},
        hourly:[{
            url: 'https://yandex.ru/pogoda/moscow/details',
            text: '.forecast-detailed__day-info_first .weather-table__body-cell_type_condition .weather-table__value',
            temp: '.forecast-detailed__day-info.forecast-detailed__day-info_first table td.weather-table__body-cell.weather-table__body-cell_type_daypart > div.weather-table__temp',
            //temp: '.forecast-detailed__day-info_first .weather-table__temp',
            time: '.forecast-detailed__day-info_first .weather-table__daypart'
        }]
	},

	/* GISMETEO */
	{
		name: 'gismeteo',
		url: "https://www.gismeteo.ru/weather-moscow-4368/2-weeks/",
		periodic: 'double',
		params: {
			 now_text: 'body > section.content > div > div > div.right_col_1 div > div.wn_body > div.info_item.clearfix > div.ii._ic > div > span'
			,now_temp: 'body > section.content > div > div > div.right_col_1 div > div.wn_body > div.info_item.clearfix > div.ii._temp > div > span'
			,day_text: 'body > section.content > div > div > div.main > div.__frame_sm > div > div div.twoweeksline > div.twoweeks_col.twoweeks_desc'
			,day_temp: '.twoweeks_minmax_temp span'
		},
        hourly:[{
            url: 'https://www.gismeteo.ru/weather-moscow-4368/',
            text: 'section.content > div > div > div.main > div.__frame_sm > div.forecast_frame.hw_wrap.one_day > div  div._line.iconline.clearfix span',
            temp: 'section.content > div > div > div.main > div.__frame_sm > div.forecast_frame.hw_wrap.one_day > div div._line.templine.clearfix > div div > span',
            time: 'section.content > div > div > div.main > div.__frame_sm > div.forecast_frame.hw_wrap.one_day > div > div div._line.timeline.clearfix div > span'
        }]
	},

	/* ACCUWEATHER */
	{
		name: 'accuweather',
		params: [{
			url: 'http://www.accuweather.com/ru/ru/moscow/294021/weather-forecast/294021',
			params: {
				 now_text: '.panel-body #feed-tabs .current .cond'
				,now_temp: '.panel-body #feed-tabs .current .large-temp'
			}
		},{
			url: 'http://www.accuweather.com/ru/ru/moscow/294021/daily-weather-forecast/294021',
			firstNumber: 0,
			params: {
				 day_text: '.panel-body #feed-tabs .day .cond'
				,day_temp: '.panel-body #feed-tabs .day .temp'
				//,day_temp_night: '#feed-tabs .day .low'
			}
		},{
			url: 'http://www.accuweather.com/ru/ru/moscow/294021/daily-weather-forecast/294021?day=6',
			firstNumber: 5,
			params: {
				 day_text: '.panel-body #feed-tabs .day .cond'
				,day_temp: '.panel-body #feed-tabs .day .temp'
				//,day_temp_night: '#feed-tabs .day .low'
			}
		},{
			url: 'http://www.accuweather.com/ru/ru/moscow/294021/daily-weather-forecast/294021?day=11',
			firstNumber: 10,
			params: {
				 day_text: '.panel-body #feed-tabs .day .cond'
				,day_temp: '.panel-body #feed-tabs .day .temp'
				//,day_temp_night: '#feed-tabs .day .low'
			}
		}],
        hourly:[{
            url: 'http://www.accuweather.com/en/ru/moscow/294021/hourly-weather-forecast/294021?hour=',
            text: '#detail-hourly > div > div.hourly-table.overview-hourly > table > tbody > tr > td > span',
            temp: '#detail-hourly > div > div.hourly-table.overview-hourly > table > tbody > tr > td > span',
            firstNumber: 0
        }/*,{
            url: 'http://www.accuweather.com/en/ru/moscow/294021/hourly-weather-forecast/294021?hour=8',
            text: '#detail-hourly > div > div.hourly-table.overview-hourly > table > tbody > tr > td > span',
            temp: '#detail-hourly > div > div.hourly-table.overview-hourly > table > tbody > tr > td > span',
            firstNumber: 8
        },{
            url: 'http://www.accuweather.com/en/ru/moscow/294021/hourly-weather-forecast/294021?hour=16',
            text: '#detail-hourly > div > div.hourly-table.overview-hourly > table > tbody > tr > td > span',
            temp: '#detail-hourly > div > div.hourly-table.overview-hourly > table > tbody > tr > td > span',
            firstNumber: 16
        }*/]
	}
];