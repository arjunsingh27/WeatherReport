const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
require('dotenv').config();
const app = express();
const https = require("https");
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');


app.use(express.static("public"));

app.get("/", function(req,res){
  res.render("home",);
});
 
app.get("/weatherReport", function(req,res){
  res.render("weatherReport",);
});
app.post("/weatherReport",function(req,res){
 
  const cityName=req.body.cityName;
  const apiKey = process.env.SECRET_KEY;
  console.log(apiKey);
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+apiKey+"&units=metric";
  
  https.get(url, (response) => {
    console.log('statusCode:', response.statusCode);
    // console.log('headers:', response.headers);
  if(response.statusCode<250){
    response.on('data', (d) => {
       const weatherData = JSON.parse(d);
       const temp = weatherData.main.temp;
       const description = weatherData.weather[0].description;
       const weatherIcon = weatherData.weather[0].icon; 
       const weatherUrl = "https://openweathermap.org/img/wn/"+weatherIcon+".png";
      //  console.log(weatherUrl);
       res.render("weatherData",{temp:temp,description:description,weatherIconUrl:weatherUrl,cityName:_.upperFirst(cityName)});
    });
  }else{
     res.render("error",{cityNotFound:"Can't find your City Data check the name and try again "+cityName});
     response.on('error', (e) => {
     console.log(e);
  }); 
}

});
});

// app.get("/error", function(req,res){
//   res.render("error",{cityNotFound:"Can't find your City Data check the name and try again "+cityName});
// })
// app.post("/error", function(req,res){
//   res.redirect("/weatherReport");
// })

app.get("/about", function(req,res){
  res.render("about",);
});
 

app.listen(process.env.PORT || 3000,function(req,res){
    console.log("Server Started .........");
})
