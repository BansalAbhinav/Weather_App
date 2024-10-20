const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const API_KEY = "398e06358b0c338c0585e683c8f61362";

const NotFoundSection = document.querySelector(".not-found");
const SearchCitySection = document.querySelector(".search-city");
const WeatherInfoSection = document.querySelector(".weather-info");

const contrytxt = document.querySelector(".country-text");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityTxt = document.querySelector(".humidity-value-txt");
const WindTxt = document.querySelector(".wind-value-txt");
const currentTimeTxt = document.querySelector(".current-date-txt");
const weathersummaryImg = document.querySelector(".weather-summary-img");

const forecastItemsTxt = document.querySelector(".forecast-items-container");
searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    UpdateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    UpdateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function UpadteForecast(city) {
  const ForecastData = await getfetchdata("forecast", city);
  const timeTaken = "12:00:00";
  const TodaysDate = new Date().toISOString().split("T")[0];
  forecastItemsTxt.innerHTML = "";
  ForecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(TodaysDate)
    ) {
      console.log(forecastWeather);
      UpdateForecastItems(forecastWeather);
    }
  });
}
function UpdateForecastItems(weatherData) {
  console.log(weatherData);
  const {
    dt_txt: date,
    main: { temp },
    weather: [{ id }],
  } = weatherData;

  const dateTaken = new Date(date);
  const dateoption = {
    day: "2-digit",
    month: "short",
  };
  const dateresult = dateTaken.toLocaleDateString("en-GB", dateoption);

  const ForecastItem = `<div class="forecast-items">
         <h5 class="forecast-item-date regular-txt">${dateresult}</h5>
        <img src="assets/weather/${getweatherIcon(
          id
        )}" class="forcast-item-img"/>
        <h5 class="forecast-item-temp">${Math.round(temp)} ℃</h5>
  </div>
  `;
  forecastItemsTxt.insertAdjacentHTML("beforeend", ForecastItem);
}
async function getfetchdata(endPort, city) {
  const API_URL = `https://api.openweathermap.org/data/2.5/${endPort}?q=${city}&appid=${API_KEY}&units=metric`;

  const response = await fetch(API_URL);
  return response.json();
}

function getweatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

function getcurrentDate() {
  const CurrentDate = new Date();
  const Option = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return CurrentDate.toLocaleDateString("en-GB", Option);
}
async function UpdateWeatherInfo(city) {
  const weatherData = await getfetchdata("weather", city);
  if (weatherData.cod != 200) {
    showdisplayselection(NotFoundSection);
    return;
  }
  //   console.log(weatherData);

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  contrytxt.textContent = country;
  tempTxt.textContent = Math.round(temp) + " ℃";
  humidityTxt.textContent = humidity + " %";
  WindTxt.textContent = speed + " M/s";
  conditionTxt.textContent = main;
  weathersummaryImg.src = `assets/weather/${getweatherIcon(id)}`;

  currentTimeTxt.textContent = getcurrentDate();
  await UpadteForecast(city);
  showdisplayselection(WeatherInfoSection);
}

function showdisplayselection(section) {
  [WeatherInfoSection, SearchCitySection, NotFoundSection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
}
