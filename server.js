const express = require("express");
const https = require("https");
const path = require("path");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3002;

app.use(express.static(`${__dirname}/static`));
app.set("view engine", "pug");

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.get("/weather", (req, res) => {
    const city = req.query.city;
    const key = process.env.API_KEY;
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key + '&units=metric';
    https.get(url,
    (response) => {
        response.on("data", (data) => {
            const weather = JSON.parse(data);
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

app.all("/robots.txt", (req, res) => {
    res.sendFile(path.join(__dirname, "robots.txt"));
});

app.all("/sitemap.xml", (req, res) => {
    res.sendFile(path.join(__dirname, "sitemap.xml"));
});

app.all(["*/robots", "*/robots.txt"], (req, res) => {
    res.redirect("/robots.txt");
});

app.all(["*/sitemap", "*/sitemap.xml"], (req, res) => {
    res.redirect("/sitemap.xml");
});

app.listen(port, () => {
    console.log(`Weather App listening on port ${port}.`);
});
