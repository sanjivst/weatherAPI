require("dotenv").config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = new express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  const city = req.body.cityName;
  const apiId =  process.env.API_KEY;
  const unit = "metric"
  const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiId + "&q=" + city + "&units=" + unit;

  https.get(url, function(response){

    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<p>The weather is currently " + weatherDescription + "<p>");
      res.write("<h1>The temperature in " + city + " is " + temp + " degrees Celcius.");
      res.write("<img src="+ imageURL +">");
      res.send();
    })
  })
})

// Server Started
app.listen(3000, function(){
  console.log("Server Start @ 3000")
});
