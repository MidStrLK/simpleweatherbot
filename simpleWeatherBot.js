var server 			= require("./node/server"),
	router 			= require("./node/router"),
	requestHandlers = require("./node/requestHandlers"),
    telegrambot 	= require("./node/telegrambot"),
	handle 			= {};

handle["/"]                 = requestHandlers.submitRequest;    // index.html
handle["/api/remove"]           = requestHandlers.submitRequest;    // очистить БД
handle["/api/insert"]           = requestHandlers.submitRequest;    // Посчитать погоду и положить в БД
handle["/api/select"]           = requestHandlers.submitRequest;    // Получить погоду на сегодня
handle["/api/count"]            = requestHandlers.submitRequest;    // Тест БД
handle["/api/testCalculate"]    = requestHandlers.submitRequest;    // Тест БД
handle["/api/mongorequest"]     = requestHandlers.submitRequest;    // Тест БД

handle["/api/gethourly"]        = requestHandlers.submitRequest;    // Почасовой прогноз
handle["/api/getactual"]        = requestHandlers.submitRequest;    // Почасовой прогноз
handle["/api/getforecast"]      = requestHandlers.submitRequest;    // Почасовой прогноз

server.start(router.route, handle);

telegrambot.start();