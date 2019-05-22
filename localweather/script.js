$(document).ready(function() {
  var lat;
  var lon;
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
          lon = position.coords.longitude;
          lat = position.coords.latitude;
          $("#data").html("latitude: " + position.coords.latitude + "<br>longitude: " + position.coords.longitude);
          //gets lat and lon
          var api = 'https://fcc-weather-api.glitch.me/api/current?lat=' + lat + '&lon=' + lon + '';
          console.log(api); 
          $.getJSON(api, function(data) {
              var ftemp;
              var ctemp;
              var tempSwap = false;
              var city = data.name;
              var weatherType = data.weather[0].description;
              var ctemp = data.main.temp.toFixed(0);
              var windSpeed = data.wind.speed;
              ftemp = (ctemp * (9 / 5) + 32).toFixed(0);
              console.log(city);
              $('#name').html(data.name);
              $('#temp').html(ftemp + " &#8457");
              $('#temp').click(function() {
                  if (tempSwap === false) {
                      $('#temp').html(ctemp + " &#8451");
                      tempSwap = true;
                  } else {
                      $('#temp').html(ftemp + " &#8457");
                      tempSwap = false;
                      //button to switch C and F
                  }
              });
              //JSON call for Open Weather API

              if (ftemp > 90) {
                  $('body').css('border-color', 'red');
              } else if (ftemp > 80) {
                  $('.solid').css('border-color', 'orangered');
              } else if (ftemp > 70) {
                  $('body').css('border-color', 'gold');
              } else if (ftemp > 60) {
                  $('body').css('border-color', 'steelblue');
              } else if (ftemp > 50) {
                  $('body').css('border-color', 'blue');
              } else if (ftemp > 40) {
                  $('body').css('border-color', 'darkblue');
              } else if (ftemp > 32) {
                  $('body').css('border-color', 'navy');
              } else if (ftemp <= 31) {
                  $('body').css('border-color', 'aliceblue');
              }
              //changes line color    
              // $('#weather').html(weatherType);
              $('#windspeed').html("Wind " + windSpeed + " MPH");
              $("#desc").text(data.weather[0].main); 
              $('#icon').prepend("<img src=" + data.weather[0].icon + "/>"); 
              //  console.log(city);
              // console.log(api);
          });
      });
  }
});