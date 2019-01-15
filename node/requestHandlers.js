var fs          = require("fs"),
    index       = fs['readFileSync']('./index.html'),
    hourly      = require("./hourly"),
    actual      = require("./actual"),
    forecast    = require("./forecast"),
    weather     = require("./weather");


function submitRequest(response, handle, pathname, postData){

  if(!pathname || !response){
    response.writeHead(500, { 'Content-Type': 'application/json', 'charset':'utf-8' });
    response.write('Ошибка в запросе ' + pathname);
    response.end();
  }else{
    if(pathname === '/'){
      response.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
      response.end(index);
    }else {
      var path = pathname.replace(/\//g, ''),
          func = function (err, result) {
            var res = 0,
                httpsc = 200;
            if (err) {
              res = err;
              httpsc = 500;
            } else {
              if (result || result === 0) res = result;
              if (result && (result.result || result.result === 0)) res = result.result;
              if (result && result.result && (result.result.n || result.result.n === 0)) res = result.result.n;
            }

            response.writeHead(httpsc, {'Content-Type': 'application/json', 'charset': 'utf-8'});
            response.write(JSON.stringify(res));
            response.end();
          };

      if (pathname === '/api/getactual') {
          //actual.getActual(func);
          weather(func, 'actual');
      }else if (pathname === '/api/gethourly') {
          //hourly.getHourly(func);
          weather(func, 'hourly');
      }else if (pathname === '/api/getforecast') {
          //forecast.getForecast(func);
          weather(func, 'forecast');
      } else {
          response.writeHead(500, {'Content-Type': 'application/json', 'charset': 'utf-8'});
          response.write('Ошибка в запросе к БД ' + path);
          response.end();
      }
    }
  }
}

exports.submitRequest       = submitRequest;