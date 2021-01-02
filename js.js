"use strict"
const searchInput = document.getElementById("searchCity");
const searchBtn = document.getElementById("searchBtn");
const cityNamePlace = document.getElementById("cityNamePlace");
const matchList = document.getElementById("matchList");
const dienuTevas = document.getElementById("dienuTevas");
const valanduTevas = document.getElementById("valandiniuTevas");
const lastUpdated = document.getElementById("lastUpdated");

//-------Vietoves ikelimas pagal paieska i h4----------
const visiMiestai = async () => {
    console.log("Labas")
    console.log(searchInput.value)
    try {
        const response = await fetch(`https://api.meteo.lt/v1/places/${searchInput.value}`);
        const data = await response.json();
        console.log(data);
        if (searchInput.value == data.code) {
            cityNamePlace.innerHTML = data.name;
            const cityAdministrative = document.createElement("p");
            cityAdministrative.setAttribute("class", "text-capitalize")
            cityAdministrative.style.fontSize = "15px";
            cityAdministrative.innerHTML = data.administrativeDivision;
            cityNamePlace.appendChild(cityAdministrative);
            searchInput.value = "";
        }
    } catch (error) {
        console.log("KAzkas negerai!")
        console.log(error);
    }
}
searchBtn.addEventListener("click", visiMiestai);
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        visiMiestai();
    }
});

//---------------Dienu ir orų ikelimas i html------------------------
const oruPrognoze = async () => {
    try {
        console.log("labas orai!");
        console.log(searchInput.value)
        const response = await fetch(`https://api.meteo.lt/v1/places/${searchInput.value}/forecasts/long-term`);
        const data = await response.json();
        //console.log(data);
        const lastChangedSplit = data.forecastCreationTimeUtc.split(" ");
        lastUpdated.innerHTML = `Paskutinį kartą atnaujintą šiandien ${lastChangedSplit[1]}`
        const naujosDatos = data.forecastTimestamps.map(diena => {
            const manoDatos = diena.forecastTimeUtc.split(" ")
            return manoDatos[0];
        })
        //console.log(naujosDatos);
        const uniq = naujosDatos.reduce(function (a, b) {
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, [])
        //console.log(uniq);
        dienuTevas.innerHTML = "";
        uniq.forEach(a => {
            const finalDate = new Date(a).toDateString();
            console.log(finalDate);
            const divDays = document.createElement("div");
            divDays.style.backgroundColor = "white";
            divDays.style.cursor = "pointer";
            divDays.id = a;
            divDays.setAttribute("class", "col-2 d-flex justify-content-center d-flex align-items-center scale mr-2");
            divDays.style.height = "5rem";
            divDays.style.borderRight = "1px gray solid";
            divDays.style.borderBottom = "3px #c33333 solid"
            dienuTevas.appendChild(divDays);
            if (divDays.id === uniq[0]) {
                divDays.innerHTML = `<p>Šiandien</p>`;
                rodykOrus(divDays.id);
                divDays.setAttribute("class", "active col-2 d-flex justify-content-center d-flex align-items-center scale mr-2");
            } else {
                divDays.innerHTML = `<p>${finalDate}</p>`;
            }

            const forScale = dienuTevas.getElementsByClassName("scale");
            for (let i = 0; i < forScale.length; i++) {
                forScale[i].addEventListener("click", scale);

                function scale() {
                    const activeDiv = dienuTevas.getElementsByClassName("active");
                    if (activeDiv.length > 0) {
                        activeDiv[0].className = activeDiv[0].className.replace("active", "")
                    }
                    this.className += " active";
                }
            }

            divDays.addEventListener("click", rodykOrus);

            function rodykOrus() {
                valanduTevas.innerHTML = "";
                data.forecastTimestamps.forEach(oras => {
                    //console.log(oras)
                    const dienos = oras.forecastTimeUtc.split(" ");
                    if (dienos[0] === divDays.id) {
                        // console.log("Tinka");
                        const divHours = document.createElement("div");
                        divHours.style.backgroundColor = "white";
                        divHours.style.border = "1px gray solid";
                        divHours.setAttribute("class", "col-2 text-center");
                        valanduTevas.appendChild(divHours);
                        const hoursArray = dienos[1].split(":");
                        // console.log(hoursArray);
                        divHours.innerHTML = `<p class="mt-3">${hoursArray[0]}:${hoursArray[1]}</p>
                                              <p class="mb-5">${oras.airTemperature} °C</p>
                                              <img src="img/rain-drops.png" width="20">
                                              <p>${oras.totalPrecipitation} %</p>
                                               <p>Vėjo greitis: ${oras.windSpeed}m/s</p> `
                        let condition = oras.conditionCode;
                        //console.log(condition)
                        const iconImage = document.createElement("img");
                        iconImage.width = "50";
                        divHours.insertBefore(iconImage, divHours.childNodes[1]);
                        switch (condition) {
                            case "clear":
                                // console.log("Giedra");
                                if (hoursArray[0] == "08" || hoursArray[0] == "09" || hoursArray[0] == "10" || hoursArray[0] == "11"
                                    || hoursArray[0] == "12" || hoursArray[0] == "13" || hoursArray[0] == "14" || hoursArray[0] == "15" ||
                                    hoursArray[0] == "16") {
                                    iconImage.src = "img/clear.png";
                                } else {
                                    iconImage.src = "img/clear-night.png";
                                }
                                break;
                            case "isolated-clouds":
                            case "scattered-clouds":
                                if (hoursArray[0] == "08" || hoursArray[0] == "09" || hoursArray[0] == "10" || hoursArray[0] == "11"
                                    || hoursArray[0] == "12" || hoursArray[0] == "13" || hoursArray[0] == "14" || hoursArray[0] == "15" ||
                                    hoursArray[0] == "16") {
                                    iconImage.src = "img/isolated-clouds-scattered-clouds.png";
                                } else {
                                    iconImage.src = "img/isolated-clouds-monn.png";
                                }
                                break;
                            case "overcast":
                                iconImage.src = "img/overcast.png";
                                break;
                            case "light-rain":
                                iconImage.src = "img/light-rain.png";
                                break;
                            case "moderate-rain":
                                iconImage.src = "img/moderate-rain.png";
                                break;
                            case "heavy-rain":
                                iconImage.src = "img/heavy-rain.png";
                                break;
                            case "sleet":
                                iconImage.src = "img/sleet.png";
                                break;
                            case "light-snow":
                                iconImage.src = "img/light-snow.png";
                                break;
                            case "moderate-snow":
                            case "heavy-snow":
                                iconImage.src = "img/moderate-snow-heavy-snow.png";
                                break;
                            case "fog":
                                iconImage.src = "img/fog.png"
                        }
                    } else {
                        //console.log("netinka")
                    }
                });
            }
        })
    } catch (error) {
        console.log(error);
    }
}
visiMiestai(searchInput.value = "kaunas");
oruPrognoze(searchInput.value = "kaunas");
searchBtn.addEventListener("click", oruPrognoze);
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        oruPrognoze();
    }
});

//---------Suggestions-----------------

/*const searchCity = async searchText => {
    const response = await fetch(`https://api.meteo.lt/v1/places`);
    const data = await response.json();
    console.log(data)
    let matches = data.filter(city => {
        const regex = new RegExp(`^${searchText}`, `gi`);
        return city.name.match(regex);
    });
    console.log(matches)

    if (searchText.length === 0) {
        matches = [];
        matchList.innerHTML = "";
    }
    const outputHtml = matches => {
        if (matches.length > 0) {
            console.log("hello")
            matches.map(match => {
                const option = document.createElement("option");
            option.innerHTML = match.name;
            matchList.appendChild(option)
        })}
    }
    outputHtml(matches);
}

searchInput.addEventListener("input", () => searchCity(searchInput.value));*/
