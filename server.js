const express = require("express");
const https = require("https");
const app = express();
const port = 3000;

app.use(express.static(`${__dirname}/static`));
app.set("view engine", "pug");

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.get("/weather", (req, res) => {
    const city = req.query.city;
    const key; //API key
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key + '&units=metric';
    https.get(url,
    (response) => {
        response.on("data", (data) => {
            const weather = JSON.parse(data);
            // console.log(weather);
            const icon = "http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@4x.png";
            res.render("weather", {
                h1:`${city}, ${weather.sys.country}`,
                icon:icon,
                description:weather.weather[0].description,
                imgtitle:weather.weather[0].description.toUpperCase(),
                temperature:weather.main.temp,
                min_temp:weather.main.temp_min,
                max_temp:weather.main.temp_max,
                humidity:weather.main.humidity
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Weather App listening on port ${port}.`);
});
