$(document).ready(function getWeather() {

	var lat;
	var lon;



	if (navigator.geolocation) {

		navigator.geolocation.getCurrentPosition(success, error);
	} else {
		alert("Geolocation services are not supported by your web browser.");
	}

	function success(position) {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
		var key = '25f02275e13d469fb4f9a4205acbdd66';
		
		var reversegeocodingapi = "https://api.opencagedata.com/geocode/v1/json?q="+lat+"%2C%20"+lon+"&key="+key+"&language=en&pretty=1";
		$.getJSON(reversegeocodingapi, function(data) {
			$("#province").html(data.results[0].components.state);
			$("#city").html(data.results[0].components.city);
				
		}); //end getJSON
		getWeatherData(lat, lon);
	} //end success


	function error() {
		alert("Geolocation has encountered an error, try again with a secure connection.");
	}


	function getWeatherData(latitude, longitude) {
		var key ='c3bc00e7b1e1594cd6fd3ffd1c537410';
		var weatherapiurl = "https://api.forecast.io/forecast/"+key+"/"+latitude+","+longitude+"?callback=?"
		$.getJSON(weatherapiurl, function(weatherdata) {
			console.log(weatherdata)
			var tempf = Math.round(weatherdata.currently.temperature);
			$("#temp").html(tempf + "°");
			var tempc = Math.round(((weatherdata.currently.temperature)-32)/(9/5));
			var feelslikef = Math.round(weatherdata.currently.apparentTemperature);
			$("#feels-like").html("Feels Like: " + feelslikef + "°F");
			var feelslikec =  Math.round(((weatherdata.currently.apparentTemperature)-32)/(9/5));
			var summary = weatherdata.currently.summary;
			$("#weather-description").html(summary);
			var windspeed = weatherdata.currently.windSpeed;
			$("#windspeed").html(windspeed+' <small>m/s</small>');
			var chanceRain = weatherdata.currently.precipProbability;
			((precipArray[0]*10)/10) + "%")
			$("#chanceRain").html(Math.round(chanceRain*100)+' <small>%</small>');

			//skycons
			var icon = weatherdata.currently.icon;
			var skycons = new Skycons({"color": "#FFFFFF"});
			skycons.set("weather-icon", icon);
			skycons.play();


			//3-DAY FORECAST
			//convert future dates (given in API by seconds since Jan 1 1970) to day of the week
			var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]; //to find day of the week
			var dayArray = []; //to store days of the week
			var iconArray = []; //to store icon values
			var tempMaxArray = []; //to store max temps
			var tempMinArray = []; //to store min temps
			var precipArray = []; //to store precipitation probability
			//first, create function to get all the information
			function weatherInfo() {
				var time = weatherdata.daily.data[i].time;
				var date = new Date(time*1000);
				day = weekday[date.getDay()];
				dayArray.push(day);
				var weatherIcon = weatherdata.daily.data[i].icon;
				
				iconArray.push(weatherIcon);
				var tempMax = weatherdata.daily.data[i].temperatureMax;
				tempMaxArray.push(tempMax);
				var tempMin = weatherdata.daily.data[i].temperatureMin;
				tempMinArray.push(tempMin);
				var precip = weatherdata.daily.data[i].precipProbability;
				precipArray.push(precip);
			};
			//if it's before 6am (but after midnight), run the function as if later that day = "tomorrow" (so if it's 4am on a Sunday, Sunday will still show up as the first day in the forecast)
			var now = new Date();
			var hour = now.getHours();
			if (hour < 6) {
				for (var i=0; i<3; i++) {
					weatherInfo();
				};
			} else {
				for (var i=1; i<4; i++) {
					weatherInfo();
				};
			};

			//put weekdays into html
			$("#daytwo").html(dayArray[0]);
			$("#daythree").html(dayArray[1]);
			$("#dayfour").html(dayArray[2]);
			//put icons into html
			console.log(iconArray)
			skycons.set("weathertwo", iconArray[0]);
			skycons.set("weatherthree", iconArray[1]);
			skycons.set("weatherfour", iconArray[2]);
			//put highs and lows into html
			$("#daytwo-hl").html(Math.round(tempMaxArray[0]) + "/" + Math.round(tempMinArray[0])+"°F");
			$("#daythree-hl").html(Math.round(tempMaxArray[1]) + "/" + Math.round(tempMinArray[1])+"°F");
			$("#dayfour-hl").html(Math.round(tempMaxArray[2]) + "/" + Math.round(tempMinArray[2])+"°F");
			//put chance of precipitation into html
			$("#daytwo-p").html((Math.round(precipArray[0]*10)/10)*100 + "%");
			$("#daythree-p").html((Math.round(precipArray[1]*10)/10)*100 + "%");
			$("#dayfour-p").html((Math.round(precipArray[2]*10)/10)*100 + "%");


			//toggle between F and C for every temperature
			$("#cbutton").click(function(event) {
				$("#temp").html(tempc + "°");
				$("#feels-like").html("Feels Like: " + feelslikec + "°C");
				$("#daytwo-hl").html(Math.round(((tempMaxArray[0])-32)*(5/9))+"/"+Math.round(((tempMinArray[0])-32)*(5/9))+"°C");
				$("#daythree-hl").html(Math.round(((tempMaxArray[1])-32)*(5/9))+"/"+Math.round(((tempMinArray[1])-32)*(5/9))+"°C");
				$("#dayfour-hl").html(Math.round(((tempMaxArray[2])-32)*(5/9))+"/"+Math.round(((tempMinArray[2])-32)*(5/9))+"°C");
			});//end c click
			//f click
			$("#fbutton").click(function(event) {
				$("#temp").html(tempf + "°");
				$("#feels-like").html("Feels Like: " + feelslikef + "°F");
				$("#daytwo-hl").html(Math.round(tempMaxArray[0])+"/"+Math.round(tempMinArray[0])+"°F");
				$("#daythree-hl").html(Math.round(tempMaxArray[1])+"/"+Math.round(tempMinArray[1])+"°F");
				$("#dayfour-hl").html(Math.round(tempMaxArray[2])+"/"+Math.round(tempMinArray[2])+"°F");
			});//end f click
		}); //end getJSON
	}; //end getWeatherData
}); //end ready
