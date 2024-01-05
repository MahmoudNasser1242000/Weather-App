const weatherContainer = document.querySelector(".weather-container")

const showWeather = async (country, days, icon="")=> {
    const wether = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=581758af160d4da384d192058232712&q=${country}&${days}`);
    const res = await wether.json();
    // console.log(res.forecast.forecastday[0].date);

    const currentWeather = res.current;
    let windDir;
    switch (currentWeather.wind_dir) {
        case "N":
        case "NE":
        case "NW":
        case "NNW":
        case "NNE":
            windDir = "North";
            break;

        case "S":
        case "SE":
        case "SW":
        case "SSW":
        case "SSE":
            windDir = "South";
            break; 
            
        case "E":
            windDir = "East";
            break; 

        case "W":
            windDir = "West";
            break; 

        default:
            windDir = "_";
    }

    const weatherOfDays = res.forecast.forecastday;
    const dateOne = new Date(weatherOfDays[0].date);
    const dateTwo = new Date(weatherOfDays[1].date);
    const dateThree = new Date(weatherOfDays[2].date);

    let flag;
    if (icon !== "") {
        flag = `<img src='${icon}' alt='country flag' class='flag'/>`;
    } else {
        flag = "";
    }

    weatherContainer.innerHTML = `<div class="col-md-4">
                                    <div class="card rounded-0 border-0">
                                        <div class="card-header d-flex justify-content-between align-items-center">
                                            <span>${dateOne.toLocaleDateString("en-EN", { weekday: 'long' })}</span>
                                            <span>${dateOne.getDate()}${dateOne.toLocaleDateString("en-EN", { month: 'long' })}</span>
                                        </div>
                                        <div class="card-body">
                                            <span class="country py-3">
                                                ${country}
                                                ${flag}
                                            </span>
                                            <h5 class="card-title d-flex flex-wrap justify-content-between align-items-center">
                                                <span class="first-deg">
                                                    <span class='text-warning'>${currentWeather.temp_c}</span><sup>o</sup>C
                                                </span>
                                                <span class="fs-1 me-4 align-self-end">
                                                    <img src='${currentWeather.condition.icon}' alt='weather icon'/>
                                                </span>
                                            </h5>
                                            <span class="py-3 type">${currentWeather.condition.text}</span>
                                            <div class="weather-info d-flex align-items-center pt-2">
                                                <div>
                                                    <span>&#x2602;</span>
                                                    <span>${currentWeather.wind_degree}deg</span>
                                                </div>
                                                <div class="ms-3">
                                                    &#x1F321;
                                                    <span>${currentWeather.wind_kph}m/h</span>
                                                </div>
                                                <div class="ms-3">
                                                    &#x2608;
                                                    <span>${windDir}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-4 x">
                                    <div class="card card-middle rounded-0 border-0">
                                        <div class="card-header card-header-middele text-center">
                                            ${dateTwo.toLocaleDateString("en-EN", { weekday: 'long' })}
                                        </div>
                                        <div class="card-body d-flex justify-content-center align-items-center">
                                            <div>
                                                <span class="py-3 fs-1 w-100 d-flex justify-content-center">
                                                    <img src='${weatherOfDays[1].day.condition.icon}' alt='weather icon'/>
                                                </span>
                                                <h5 class="card-title text-white text-center">${weatherOfDays[1].day.maxtemp_c}<sup>o</sup>C</h5>
                                                <p class="card-text text-center">${weatherOfDays[1].day.mintemp_c}<sup>o</sup>C</p>
                                                <span class="text-warning d-inline-block pb-5 text-center w-100">${weatherOfDays[1].day.condition.text}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-4">
                                    <div class="card rounded-0 border-0">
                                        <div class="card-header text-center">
                                            ${dateThree.toLocaleDateString("en-EN", { weekday: 'long' })}
                                        </div>
                                        <div class="card-body d-flex justify-content-center align-items-center">
                                            <div>
                                                <span class="py-3 fs-1 d-flex justify-content-center">
                                                    <img src='${weatherOfDays[2].day.condition.icon}' alt='weather icon'/>
                                                </span>
                                                <h5 class="card-title text-white text-center">${weatherOfDays[2].day.maxtemp_c}<sup>o</sup>C</h5>
                                                <p class="card-text text-center">${weatherOfDays[2].day.mintemp_c}<sup>o</sup>C</p>
                                                <span class="text-warning d-inline-block pb-5 text-center w-100">${weatherOfDays[2].day.condition.text}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
}

let country;
let countryIcon;
const getLocation = async ()=> {
    const data = await fetch("https://ipgeolocation.abstractapi.com/v1/?api_key=840dbbc9876443fabe49c3d8e1913001&ip_address=102.189.44.125");
    const res = await data.json();

    if (res !== undefined) {
        const countryIndex = res.timezone.name.indexOf("/") + 1;
        country = res.timezone.name.slice(countryIndex, );
        
        countryIcon = res.flag.png
    } else {
        country = "Cairo";
        countryIcon = "";
    }
    showWeather(country, "days=3", countryIcon);
}
getLocation();

const search = document.querySelector("input[type='search']");
search.addEventListener("keyup", async (e)=> {
    let value;
    if (e.target.value !== "") {
        value = e.target.value;
    } else {
        value = country;
    }

    const data = await fetch(`http://api.weatherapi.com/v1/search.json?key=581758af160d4da384d192058232712&q=${value}`);
    const res = await data.json();

    let _country;
    let _countryIcon;
    if (res.length !== 0) {
        _country = res[0].name;
        if (res[0].name === country) {
            _countryIcon = countryIcon;
        } else {
            _countryIcon = "";
        }
    } else {
        _country = country;
        _countryIcon = countryIcon;
    }

    showWeather(_country, "days=3", _countryIcon);
})