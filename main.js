const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.data'); // Corrected the selector for date
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.querySelector('#locationInput'); 
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city'); 
const geolocationButton = document.getElementById('geolocationButton'); 
const API_KEY = 'd95b999725f941babcf151814232709';
let cityInput = "London";

cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        app.style.opacity = "0";
    });
});

form.addEventListener('submit', (e) => {
    if (search.value.length === 0) {
        alert('Please type in a city');
    } else {
        cityInput = search.value;
        fetchWeatherData();
        search.value = "";
        app.style.opacity = "0";
    }
    e.preventDefault();
});

function updateWeatherUI(weatherData) {
    // Update temperature
    temp.innerHTML = weatherData.current.temp_c + "&#176;C";

    // Update condition (e.g., "Cloudy", "Sunny", etc.)
    conditionOutput.innerHTML = weatherData.current.condition.text;

    // Update date and time
    const date = weatherData.location.localtime;
    const y = date.substr(0, 4);
    const m = date.substr(5, 2);
    const d = date.substr(8, 2);
    const time = date.substr(11);
    dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m}, ${y}`;
    timeOutput.innerHTML = time;

   
    nameOutput.innerHTML = weatherData.location.name;

    const iconId = weatherData.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
    icon.src = "./icons/" + iconId;

    cloudOutput.innerHTML = weatherData.current.cloud + "%";
    humidityOutput.innerHTML = weatherData.current.humidity + "%";
    windOutput.innerHTML = weatherData.current.wind_kph + "km/h";

    let timeOfDay = "day";
    if (!weatherData.current.is_day) {
        timeOfDay = "night";
    }

    const code = weatherData.current.condition.code;
    if (code == 1000) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
        btn.style.background = "#e5ba92";
        if (timeOfDay == "night") {
            btn.style.background = "#181e27";
        }
    } else if (
        code == 1003 ||
        code == 1006 ||
        code == 1009 ||
        code == 1030 ||
        code == 1069 ||
        code == 1087 ||
        code == 1135 ||
        code == 1273 ||
        code == 1276 ||
        code == 1279 ||
        code == 1282
    ) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
        btn.style.background = "#fa6d1b";
        if (timeOfDay == "night") {
            btn.style.background = "#181e27";
        }
    } else if (
        code == 1063 ||
        code == 1069 ||
        code == 1072 ||
        code == 1150 ||
        code == 1153 ||
        code == 1180 ||
        code == 1183 ||
        code == 1186 ||
        code == 1189 ||
        code == 1192 ||
        code == 1195 ||
        code == 1204 ||
        code == 1207 ||
        code == 1240 ||
        code == 1243 ||
        code == 1246 ||
        code == 1249 ||
        code == 1252
    ) {
        app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
        btn.style.background = "#647d75";
        if (timeOfDay == "night") {
            btn.style.background = "#325c80";
        }
    } else {
        app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
        btn.style.background = "#4d72aa";
        if (timeOfDay == "night") {
            btn.style.background = "#1b1b1b";
        }
    }

    app.style.opacity = "1";
}


async function fetchWeatherByGeolocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const weatherData = await fetchWeatherByCoordinates(latitude, longitude);
            updateWeatherUI(weatherData);
        }, (error) => {
            console.error('Geolocation error:', error);
            alert('Unable to get your location. Please enter a city manually.');
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

geolocationButton.addEventListener('click', fetchWeatherByGeolocation);

function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return weekday[new Date(`${year}-${month}-${day}`).getDay()]; 
}



async function fetchWeatherData() {
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityInput}&aqi=no`);
        const data = await response.json();
        updateWeatherUI(data);
        
    } catch (error) {
        console.error('Weather data fetch error:', error);
        alert('City not found, please try again');
        app.style.opacity = "1";
    }
}

async function fetchWeatherByCoordinates(latitude, longitude) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&aqi=no`);
    const data = await response.json();
    return data;
}

fetchWeatherData();
