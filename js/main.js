$(function() {
  var tempUnit = "F",
      weatherApiKey = "e2fc329e868fb6f7fa6ff16c676d61ef",
      googleMapsKey = "AIzaSyAe_2hdoQQB9R3m4aXlJd3AqqWX25fBYo4",
      imagesArr = ["http://www.mrwallpaper.com/wallpapers/sunny-coast-sea.jpg",
                   "http://cloud-maven.com/wp-content/uploads/2013/11/DSCN6357.jpg",
                   "http://img07.deviantart.net/ba28/i/2009/138/6/2/the_rainy_street_by_dasal.jpg",
                   "http://militaryfamily.com/wp-content/uploads/2011/12/Barnstaple-snowy-road.jpg"];
  
  loadWeather();
  
  function loadWeather() {
    console.log("start");
    getLocation();
  }
  
  function getLocation() {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;
      getCityState(lat, lon);
      getWeather(lat, lon);
    });
  }
  
  function getCityState(lat, lon) {
    var googleMapsApi = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ lat +","+ lon +"&key=" + googleMapsKey;
    
    $.getJSON(googleMapsApi, function(json) {
      $(".location p").html(json.results[0].address_components[2].long_name + ", " + 
                           json.results[0].address_components[4].short_name);
    });
  }
  
  function getWeather(lat, lon) {
    weatherApi = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + weatherApiKey + "&units=" + (tempUnit === "F" ? 'imperial' : 'metric');
    
    $.getJSON(weatherApi, function(json) {
      $("html").css("background-image", "url(" + getBackground(json.weather[0].id) + ")");
      $(".temp p").html((json.main.temp).toFixed(1));
      $(".cloud-cover p").html(json.weather[0].description);
      $(".wind p").html(getWindDirection(json.wind["deg"]) + " " + json.wind["speed"].toFixed(1) + (tempUnit === "F" ? "mph" : "kph"));
    });
  }
  
  function getBackground(id) {
    if (id < 600) {
      return imagesArr[2];
    } else if (id < 700) {
      return imagesArr[3];
    } else if (id < 800) {
      return imagesArr[1];
    }
      return imagesArr[0];
  }
  
  function convertTemp(temp) {
    return temp.toFixed(1);
  }
  
  function getWindDirection(deg) {
    var compass = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    var num = Math.floor(deg / 45);
    console.log(compass[num]);
    return compass[num];
  }
  
  $(".unit").on("click", function() {
    if ($(this).hasClass("toggle")) {
      $(this).html("&degC");
      $(this).removeClass("toggle");
      tempUnit = "C";
    } else {
      $(this).html("&degF");
      $(this).addClass("toggle");
      tempUnit = "F";
    }
    loadWeather();
  })
});