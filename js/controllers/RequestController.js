myApp.controller('RequestController',
    function QuestionController($scope, $http) {

        /*---АКТУАЛЬНЫЙ---*/
        $http.get('/api/getactual').success(function (data) {
            $scope.actual = data;
        });
        /*---АКТУАЛЬНЫЙ---*/

        /*---ПОЧАСОВОЙ---*/
        var nowHour = (new Date()).getHours(),
            newHourly = {};
        $http.get('/api/gethourly').success(function(data) {
            data.forEach(function(val, key){
                if(!newHourly[key]) newHourly[key] = {};
                for(var Okey in val){
                    if(parseInt(Okey) >= nowHour || Okey === 'name') newHourly[key][Okey] = val[Okey];
                }
            });
            $scope.hourly = newHourly;
        });

        $scope.hourlyTime = [' '];
        for(var i=nowHour;i<24;i++){
            $scope.hourlyTime.push(i+':00');
        }
        /*---ПОЧАСОВОЙ---*/


        /*----ПРОГНОЗ----*/
        $scope.forecastDate = [' '];

        var date = new Date(),
            formatDate = function(increment){
                var incDate = new Date(),
                    month = incDate.getMonth() + 1;
                incDate.setDate(date.getDate() + increment);
                if(month < 10) month = '0' + String(month);
                return incDate.getDate() + '.' + month + ', ' + ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][incDate.getDay()];
            };

        var holyday = {};
        for(var k=0;k<11;k++){
            var formDay = formatDate(k);
            $scope.forecastDate.push(formDay);
            if(formDay.indexOf("Вс") !== -1 || formDay.indexOf("Сб") !== -1) holyday[k] = true;
        }

        console.info('holyday - ',holyday);

        $http.get('/api/getforecast').success(function(data) {

            if(data && data instanceof Object){
                for(var key in data){
                    if(data[key] && data[key] instanceof Object){
                        for(var twokey in data[key]){
                            data[key][twokey].holyday = (holyday[twokey]) ? 'class-holyday' : 'class-workday';
                        }
                    }
                }
            }

            $scope.forecast = data;
        });
        /*----ПРОГНОЗ----*/

    }
);